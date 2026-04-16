import platform
import sys
import sqlalchemy as sa

from fastapi import APIRouter, Depends, File, Form, Request, UploadFile
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models, teryt_import
from app.audit import record_audit
from app.config import DATABASE_URL
from app.database import get_db
from app.deps import require_admin, require_admin_or_manager, verify_session
from app import teryt_ws
from app.security import hash_password
from app.templating import render

router = APIRouter(prefix="/admin", dependencies=[Depends(verify_session)])


def _db_kind(url: str) -> str:
    if url.startswith("sqlite"):
        return "SQLite"
    if "postgresql" in url:
        return "PostgreSQL"
    return "Inna"


def _manager_cannot_touch(actor: models.PortalUser, target: models.PortalUser | None, new_role: models.UserRole) -> bool:
    if actor.role == models.UserRole.admin:
        return False
    if new_role == models.UserRole.admin:
        return True
    if target is not None and target.role == models.UserRole.admin:
        return True
    return False


@router.get("/info", response_class=HTMLResponse)
def admin_info(request: Request):
    safe_url = DATABASE_URL
    if "@" in safe_url:
        safe_url = safe_url.split("@")[-1]
    if safe_url.startswith("sqlite"):
        safe_url = "sqlite:…"
    return render(
        request,
        "admin/info.html",
        {
            "title": "Administracja — informacje",
            "python_version": sys.version.split()[0],
            "platform": platform.platform(),
            "db_kind": _db_kind(DATABASE_URL),
            "database_url_safe": safe_url,
        },
    )


@router.get("/menu-access", response_class=HTMLResponse, dependencies=[Depends(require_admin_or_manager)])
def menu_access_form(request: Request, db: Session = Depends(get_db)):
    items = list(db.scalars(select(models.NavMenuItem).order_by(models.NavMenuItem.sort_order)).all())
    roles = list(models.UserRole)
    perms = list(db.scalars(select(models.RoleMenuPermission)).all())
    matrix = {(p.role, p.nav_item_id): p.allowed for p in perms}
    return render(request, "admin/menu_access.html", {"title": "Menu i role", "menu_items": items, "roles": roles, "matrix": matrix})


@router.post("/menu-access", dependencies=[Depends(require_admin_or_manager)])
async def menu_access_submit(request: Request, db: Session = Depends(get_db)):
    form = await request.form()
    checked = set(form.getlist("allow"))
    for p in db.scalars(select(models.RoleMenuPermission)).all():
        p.allowed = f"{p.role.value}:{p.nav_item_id}" in checked
    db.commit()
    return RedirectResponse("/admin/menu-access", status_code=303)


@router.get("/menu-items", response_class=HTMLResponse, dependencies=[Depends(require_admin_or_manager)])
def menu_items_form(request: Request, db: Session = Depends(get_db)):
    items = list(db.scalars(select(models.NavMenuItem).order_by(models.NavMenuItem.sort_order)).all())
    return render(request, "admin/menu_items.html", {"title": "Etykiety i adresy menu", "menu_items": items})


@router.post("/menu-items", dependencies=[Depends(require_admin_or_manager)])
async def menu_items_submit(request: Request, db: Session = Depends(get_db)):
    form = await request.form()
    for item in db.scalars(select(models.NavMenuItem)).all():
        label = form.get(f"label_{item.id}")
        url_path = form.get(f"url_{item.id}")
        if label: item.label = str(label).strip()
        if url_path: item.url_path = str(url_path).strip()
    db.commit()
    return RedirectResponse("/admin/menu-items", status_code=303)


@router.get("/users", response_class=HTMLResponse, dependencies=[Depends(require_admin_or_manager)])
def portal_users_list(request: Request, db: Session = Depends(get_db)):
    rows = list(db.scalars(select(models.PortalUser).order_by(models.PortalUser.username)).all())
    return render(request, "admin/users_list.html", {"title": "Użytkownicy portalu", "users": rows})


@router.get("/users/new", response_class=HTMLResponse, dependencies=[Depends(require_admin_or_manager)])
def portal_user_new_form(request: Request):
    return render(request, "admin/user_form.html", {"title": "Nowy użytkownik", "edit_user": None, "roles": list(models.UserRole)})


@router.post("/users/new", dependencies=[Depends(require_admin_or_manager)])
def portal_user_new_submit(request: Request, db: Session = Depends(get_db), username: str = Form(...), password: str = Form(...), role: str = Form(...), active: str | None = Form(None)):
    try:
        new_role = models.UserRole(role)
        u = models.PortalUser(username=username.strip(), password_hash=hash_password(password), role=new_role, active=active in ("on", "true", "1", "yes"))
        db.add(u)
        db.flush()
        record_audit(db, "create", resource_type="portal_user", resource_id=u.id, details=f"user: {u.username}", request=request)
        db.commit()
    except Exception: db.rollback()
    return RedirectResponse("/admin/users", status_code=303)


@router.get("/user-groups", response_class=HTMLResponse, dependencies=[Depends(require_admin_or_manager)])
def admin_user_groups_list(request: Request, db: Session = Depends(get_db)):
    rows = list(db.scalars(select(models.PortalUserGroup).order_by(models.PortalUserGroup.name)).all())
    return render(request, "admin/user_groups_list.html", {"title": "Grupy użytkowników", "groups": rows})


@router.get("/user-groups/new", response_class=HTMLResponse, dependencies=[Depends(require_admin_or_manager)])
def admin_user_groups_new_form(request: Request, db: Session = Depends(get_db)):
    users = list(db.scalars(select(models.PortalUser).order_by(models.PortalUser.username)).all())
    return render(request, "admin/user_group_form.html", {"title": "Nowa grupa", "group": None, "all_users": users, "selected_ids": set()})


@router.post("/user-groups/new", dependencies=[Depends(require_admin_or_manager)])
async def admin_user_groups_new_submit(request: Request, db: Session = Depends(get_db)):
    form = await request.form()
    g = models.PortalUserGroup(name=str(form.get("name")).strip(), description=str(form.get("description")).strip())
    db.add(g)
    db.commit()
    return RedirectResponse("/admin/user-groups", status_code=303)


@router.get("/teryt-sync", response_class=HTMLResponse, dependencies=[Depends(require_admin_or_manager)])
def teryt_sync_page(request: Request, db: Session = Depends(get_db)):
    sc = db.scalar(select(sa.func.count()).select_from(models.LocationState))
    dc = db.scalar(select(sa.func.count()).select_from(models.LocationDistrict))
    cc = db.scalar(select(sa.func.count()).select_from(models.LocationCity))
    districts = list(db.scalars(select(models.LocationDistrict).order_by(models.LocationDistrict.name)).all())
    cities = list(db.scalars(select(models.LocationCity).order_by(models.LocationCity.name)).all())
    return render(request, "admin/teryt_sync.html", {"title": "Synchronizacja TERYT", "state_count": sc, "district_count": dc, "city_count": cc, "districts": districts, "cities": cities})


@router.post("/teryt-sync", dependencies=[Depends(require_admin_or_manager)])
def teryt_sync_states_districts(request: Request, db: Session = Depends(get_db)):
    try:
        from app.teryt_ws import wojewodztwa_as_serializable, powiaty_as_serializable
        items, _ = wojewodztwa_as_serializable()
        s_count = 0; d_count = 0
        for it in items:
            name = str(it.get('NAZWA') or it.get('Nazwa') or '').capitalize()
            t_code = it.get('WOJ') or it.get('Woj')
            if not name or not t_code: continue
            
            state = db.scalars(select(models.LocationState).where(models.LocationState.teryt_code == str(t_code))).first()
            if not state:
                state = models.LocationState(name=name, teryt_code=str(t_code))
                db.add(state); db.flush(); s_count += 1
            
            p_items, _ = powiaty_as_serializable(str(t_code))
            for pit in p_items:
                p_name = pit.get('NAZWA') or pit.get('Nazwa')
                p_code = pit.get('POW') or pit.get('Pow')
                if not p_name or not p_code: continue
                
                exist_p = db.scalars(select(models.LocationDistrict).where((models.LocationDistrict.state_id == state.id) & (models.LocationDistrict.teryt_code == str(p_code)))).first()
                if not exist_p:
                    db.add(models.LocationDistrict(state_id=state.id, name=str(p_name), teryt_code=str(p_code)))
                    d_count += 1
        db.commit()
        record_audit(db, "teryt_sync_base", details=f"Synced states: {s_count}, districts: {d_count}", request=request)
        return RedirectResponse(f"/admin/teryt-sync?ok=1&states={s_count}&districts={d_count}", status_code=303)
    except Exception as e:
        db.rollback()
        return RedirectResponse(f"/admin/teryt-sync?error={str(e)}", status_code=303)


@router.post("/teryt-sync/cities", dependencies=[Depends(require_admin_or_manager)])
def teryt_sync_cities_submit(request: Request, db: Session = Depends(get_db), district_id: int = Form(...)):
    try:
        from app.teryt_ws import gminy_as_serializable, miejscowości_as_serializable
        district = db.get(models.LocationDistrict, district_id)
        if not district: return RedirectResponse("/admin/teryt-sync?error=Nie+znaleziono+powiatu", status_code=303)
        
        woj_code = district.state.teryt_code
        pow_code = district.teryt_code
        
        # Jeśli brak teryt_code w bazie (stare rekordy), spróbujmy szukać po nazwie w GUS (legacy fallback)
        if not pow_code:
            from app.teryt_ws import powiaty_as_serializable
            p_items, _ = powiaty_as_serializable(woj_code)
            search_name = district.name.lower().replace("powiat ", "").strip()
            for p in p_items:
                if search_name in str(p.get('NAZWA', '')).lower():
                    pow_code = p.get('POW'); break
        
        if not pow_code: return RedirectResponse("/admin/teryt-sync?error=Brak+kodu+powiatu", status_code=303)

        g_items, _ = gminy_as_serializable(woj_code, pow_code)
        count = 0
        for g in g_items:
            gmi = g.get('GMI'); rodz = g.get('RODZ')
            m_items, _ = miejscowości_as_serializable(woj_code, pow_code, gmi)
            for m in m_items:
                m_name = m.get('NAZWA') or m.get('Nazwa')
                m_simc = m.get('SIMC') or m.get('Symbol')
                if not m_name: continue
                exist = db.scalars(select(models.LocationCity).where((models.LocationCity.district_id == district.id) & (models.LocationCity.name == m_name))).first()
                if not exist:
                    db.add(models.LocationCity(district_id=district.id, name=m_name, teryt_code=m_simc, commune_code=gmi, commune_type=rodz))
                    count += 1
        db.commit()
        record_audit(db, "teryt_sync_cities", details=f"Synced {count} for {district.name}", request=request)
        return RedirectResponse(f"/admin/teryt-sync?ok=1&cities={count}", status_code=303)
    except Exception as e:
        db.rollback()
        return RedirectResponse(f"/admin/teryt-sync?error={str(e)}", status_code=303)


@router.post("/teryt-sync/streets", dependencies=[Depends(require_admin_or_manager)])
def teryt_sync_streets_submit(request: Request, db: Session = Depends(get_db), city_id: int = Form(...)):
    try:
        from app.teryt_ws import ulice_as_serializable
        city = db.get(models.LocationCity, city_id)
        if not city: return RedirectResponse("/admin/teryt-sync?error=Nie+znaleziono+miasta", status_code=303)
        
        woj_code = city.district.state.teryt_code
        pow_code = city.district.teryt_code
        gmi = city.commune_code or '01'
        rodz = city.commune_type or '1'
        
        # Legacy fallback if district has no teryt_code
        if not pow_code:
            from app.teryt_ws import powiaty_as_serializable
            p_items, _ = powiaty_as_serializable(woj_code)
            s_name = city.district.name.lower().replace("powiat ", "").strip()
            for p in p_items:
                if s_name in str(p.get('NAZWA', '')).lower():
                    pow_code = p.get('POW'); break

        u_items, _ = ulice_as_serializable(woj_code, pow_code, gmi, rodz, city.name)
        count = 0
        for u in u_items:
            u_name = u.get('NAZWA') or u.get('Nazwa')
            u_ulic = u.get('ULIC') or u.get('Symbol')
            if not u_name: continue
            exist = db.scalars(select(models.LocationStreet).where((models.LocationStreet.city_id == city.id) & (models.LocationStreet.name == u_name))).first()
            if not exist:
                db.add(models.LocationStreet(city_id=city.id, name=u_name, teryt_code=u_ulic))
                count += 1
        db.commit()
        record_audit(db, "teryt_sync_streets", details=f"Synced {count} for {city.name}", request=request)
        return RedirectResponse(f"/admin/teryt-sync?ok=1&streets={count}", status_code=303)
    except Exception as e:
        db.rollback()
        return RedirectResponse(f"/admin/teryt-sync?error={str(e)}", status_code=303)


@router.post("/teryt-import/terc", dependencies=[Depends(require_admin_or_manager)])
def admin_teryt_import_terc(request: Request, db: Session = Depends(get_db), file: UploadFile = File(...)):
    try:
        s, d = teryt_import.import_terc_xml(db, file.file)
        record_audit(db, "teryt_import_terc", details=f"Imported {s} states, {d} districts from XML", request=request)
        return RedirectResponse(f"/admin/teryt-sync?ok=1&states={s}&districts={d}", status_code=303)
    except Exception as e:
        return RedirectResponse(f"/admin/teryt-sync?error=Błąd+importu+TERC: {str(e)}", status_code=303)


@router.post("/teryt-import/simc", dependencies=[Depends(require_admin_or_manager)])
def admin_teryt_import_simc(request: Request, db: Session = Depends(get_db), file: UploadFile = File(...)):
    try:
        c = teryt_import.import_simc_xml(db, file.file)
        record_audit(db, "teryt_import_simc", details=f"Imported {c} cities from XML", request=request)
        return RedirectResponse(f"/admin/teryt-sync?ok=1&cities={c}", status_code=303)
    except Exception as e:
        return RedirectResponse(f"/admin/teryt-sync?error=Błąd+importu+SIMC: {str(e)}", status_code=303)


@router.post("/teryt-import/ulic", dependencies=[Depends(require_admin_or_manager)])
def admin_teryt_import_ulic(request: Request, db: Session = Depends(get_db), file: UploadFile = File(...)):
    try:
        u = teryt_import.import_ulic_xml(db, file.file)
        record_audit(db, "teryt_import_ulic", details=f"Imported {u} streets from XML", request=request)
        return RedirectResponse(f"/admin/teryt-sync?ok=1&streets={u}", status_code=303)
    except Exception as e:
        return RedirectResponse(f"/admin/teryt-sync?error=Błąd+importu+ULIC: {str(e)}", status_code=303)


@router.get("/audit-logs", response_class=HTMLResponse, dependencies=[Depends(require_admin_or_manager)])
def admin_audit_logs(request: Request, db: Session = Depends(get_db)):
    rows = list(db.scalars(select(models.AuditLog).order_by(models.AuditLog.timestamp.desc()).limit(200)).all())
    users = {u.id: u for u in db.scalars(select(models.PortalUser)).all()}
    return render(request, "admin/audit_logs.html", {"title": "Dziennik zdarzeń", "rows": rows, "users": users})


@router.get("/backups", response_class=HTMLResponse, dependencies=[Depends(require_admin_or_manager)])
def admin_backups(request: Request, db: Session = Depends(get_db)):
    rows = list(db.scalars(select(models.BackupExport).order_by(models.BackupExport.created_at.desc())).all())
    users = {u.id: u for u in db.scalars(select(models.PortalUser)).all()}
    return render(request, "admin/backups.html", {"title": "Kopie zapasowe", "rows": rows, "users": users})


@router.post("/backups/new", dependencies=[Depends(require_admin_or_manager)])
def admin_backups_new(request: Request, db: Session = Depends(get_db), label: str = Form(...), notes: str = Form(...)):
    b = models.BackupExport(label=label.strip(), notes=notes.strip(), created_by_id=request.state.portal_user.id)
    db.add(b)
    db.commit()
    return RedirectResponse("/admin/backups", status_code=303)


@router.post("/backups/{backup_id}/delete", dependencies=[Depends(require_admin)])
def admin_backups_delete(backup_id: int, db: Session = Depends(get_db)):
    b = db.get(models.BackupExport, backup_id)
    if b:
        db.delete(b)
        db.commit()
    return RedirectResponse("/admin/backups", status_code=303)


@router.get("/reload", response_class=HTMLResponse, dependencies=[Depends(require_admin_or_manager)])
def admin_reload_list(request: Request, db: Session = Depends(get_db)):
    rows = list(db.scalars(select(models.ConfigReloadLog).order_by(models.ConfigReloadLog.created_at.desc()).limit(100)).all())
    users = {u.id: u for u in db.scalars(select(models.PortalUser)).all()}
    return render(request, "admin/reload.html", {"title": "Przeładowanie (log)", "rows": rows, "users": users})


@router.post("/reload", dependencies=[Depends(require_admin_or_manager)])
def admin_reload_submit(request: Request, db: Session = Depends(get_db), note: str | None = Form(None)):
    db.add(models.ConfigReloadLog(actor_id=request.state.portal_user.id, note=(note or "").strip() or None))
    db.commit()
    return RedirectResponse("/admin/reload", status_code=303)


@router.get("/copyrights", response_class=HTMLResponse, dependencies=[Depends(require_admin_or_manager)])
def admin_copyrights(request: Request, db: Session = Depends(get_db)):
    s = db.scalars(select(models.AppSetting).where(models.AppSetting.key == "site.copyright_text")).first()
    txt = s.value if s else ""
    return render(request, "admin/copyrights.html", {"title": "Prawa autorskie", "copyright_text": txt})


@router.post("/copyrights", dependencies=[Depends(require_admin_or_manager)])
def admin_copyrights_submit(db: Session = Depends(get_db), value: str = Form(...)):
    s = db.scalars(select(models.AppSetting).where(models.AppSetting.key == "site.copyright_text")).first()
    if not s:
        s = models.AppSetting(key="site.copyright_text", value=value)
        db.add(s)
    else:
        s.value = value
    db.commit()
    return RedirectResponse("/admin/copyrights", status_code=303)


@router.post("/users/{user_id}/delete", dependencies=[Depends(require_admin)])
def portal_user_delete(user_id: int, request: Request, db: Session = Depends(get_db)):
    u = db.get(models.PortalUser, user_id)
    if u and u.id != request.state.portal_user.id:
        record_audit(db, "delete", resource_type="portal_user", resource_id=u.id, details=f"user: {u.username}", request=request)
        db.delete(u)
        db.commit()
    return RedirectResponse("/admin/users", status_code=303)
