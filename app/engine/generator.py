import os

# Using a different marker [[ ]] for generator-time variables to avoid Jinja2 conflict
ROUTER_TEMPLATE = """
from fastapi import APIRouter, Depends, Request, Form, Query
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy import select, or_
from sqlalchemy.orm import Session
from app.database import get_db
from app.templating import render
from app.deps import verify_session
from app import models

router = APIRouter(prefix="/[[ module_name_url ]]", dependencies=[Depends(verify_session)])

@router.get("", response_class=HTMLResponse)
def [[ module_name_snake ]]_list(
    request: Request, 
    db: Session = Depends(get_db),
    q: str | None = Query(None)
):
    stmt = select(models.[[ class_name ]])
    if q:
        # Simple search across string fields
        term = f"%{q}%"
        stmt = stmt.where(or_(
            [[ search_logic ]]
        ))
    
    items = db.scalars(stmt.order_by(models.[[ class_name ]].id.desc())).all()
    return render(request, "generated/[[ module_name_snake ]]_list.html", {
        "title": "[[ module_display_name ]]",
        "items": items,
        "q": q or ""
    })

@router.get("/new", response_class=HTMLResponse)
def [[ module_name_snake ]]_new(request: Request):
    return render(request, "generated/[[ module_name_snake ]]_form.html", {
        "title": "Nowy: [[ module_display_name ]]",
        "item": None
    })

@router.post("/new")
def [[ module_name_snake ]]_new_submit(
    request: Request,
    db: Session = Depends(get_db),
    [[ form_params ]]
):
    item = models.[[ class_name ]](
        [[ model_init ]]
    )
    db.add(item)
    db.commit()
    return RedirectResponse("/[[ module_name_url ]]", status_code=303)

@router.get("/{item_id}/edit", response_class=HTMLResponse)
def [[ module_name_snake ]]_edit(item_id: int, request: Request, db: Session = Depends(get_db)):
    item = db.get(models.[[ class_name ]], item_id)
    return render(request, "generated/[[ module_name_snake ]]_form.html", {
        "title": "Edycja: [[ module_display_name ]]",
        "item": item
    })

@router.post("/{item_id}/edit")
def [[ module_name_snake ]]_edit_submit(
    item_id: int,
    request: Request,
    db: Session = Depends(get_db),
    [[ form_params ]]
):
    item = db.get(models.[[ class_name ]], item_id)
    [[ model_update ]]
    db.commit()
    return RedirectResponse("/[[ module_name_url ]]", status_code=303)

@router.post("/{item_id}/delete")
def [[ module_name_snake ]]_delete(item_id: int, db: Session = Depends(get_db)):
    item = db.get(models.[[ class_name ]], item_id)
    if item:
        db.delete(item)
        db.commit()
    return RedirectResponse("/[[ module_name_url ]]", status_code=303)
"""

LIST_TEMPLATE = """
{% extends "base.html" %}
{% block content %}
<div class="flex items-center justify-between mb-8">
    <h2 class="text-2xl font-black text-white">{{ title }}</h2>
    <a href="/[[ module_name_url ]]/new" class="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl font-bold text-sm">
        <i class="fas fa-plus mr-2"></i> Dodaj
    </a>
</div>

<div class="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
    <div class="p-6 border-b border-slate-800">
        <form action="/[[ module_name_url ]]" method="get" class="flex gap-4">
            <input type="text" name="q" value="{{ q }}" placeholder="Szukaj..." class="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary">
            <button type="submit" class="bg-slate-800 text-white px-6 py-2 rounded-xl font-bold text-sm">Szukaj</button>
        </form>
    </div>
    <table class="w-full text-left border-collapse">
        <thead>
            <tr class="bg-black/20 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800">
                <th class="px-6 py-4">ID</th>
                [[ table_headers ]]
                <th class="px-6 py-4 text-right">Akcje</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-slate-800">
            {% for item in items %}
            <tr class="hover:bg-white/5 transition-colors">
                <td class="px-6 py-4 text-xs font-mono text-primary">#{{ item.id }}</td>
                [[ table_cells ]]
                <td class="px-6 py-4 text-right flex justify-end gap-2">
                    <a href="/[[ module_name_url ]]/{{ item.id }}/edit" class="text-slate-500 hover:text-white transition-colors">
                        <i class="fas fa-edit"></i>
                    </a>
                    <form action="/[[ module_name_url ]]/{{ item.id }}/delete" method="post" onsubmit="return confirm('Czy na pewno usunąć?')">
                        <button type="submit" class="text-slate-500 hover:text-rose-400 transition-colors">
                            <i class="fas fa-trash"></i>
                        </button>
                    </form>
                </td>
            </tr>
            {% else %}
            <tr>
                <td colspan="[[ colspan ]]" class="px-6 py-20 text-center text-slate-500 italic">Brak danych</td>
            </tr>
            {% endfor %}
        </tbody>
    </table>
</div>
{% endblock %}
"""

FORM_TEMPLATE = """
{% extends "base.html" %}
{% block content %}
<div class="max-w-2xl mx-auto space-y-8">
    <div class="flex items-center justify-between">
        <h2 class="text-2xl font-black text-white">{{ title }}</h2>
        <a href="/[[ module_name_url ]]" class="text-xs text-slate-500 hover:text-white transition-colors">
            <i class="fas fa-arrow-left mr-1"></i> Powrót do listy
        </a>
    </div>

    <div class="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <form action="{{ '/'+'[[ module_name_url ]]'+'/'+item.id|string+'/edit' if item else '/'+'[[ module_name_url ]]'+'/new' }}" method="post" class="space-y-6">
            [[ form_fields ]]

            <div class="pt-6 border-t border-white/5">
                <button type="submit" class="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black py-4 rounded-xl shadow-lg transition-all active:scale-95">
                    {{ 'Zapisz zmiany' if item else 'Utwórz rekord' }}
                </button>
            </div>
        </form>
    </div>
</div>
{% endblock %}
"""

class ModuleGenerator:
    def __init__(self, module_name, display_name, fields):
        self.module_name_snake = module_name.lower().replace("-", "_").replace(" ", "_")
        self.module_name_url = module_name.lower().replace("_", "-").replace(" ", "-")
        self.module_display_name = display_name
        self.class_name = "".join(x.capitalize() for x in self.module_name_snake.split("_"))
        self.fields = fields
        
        for f in self.fields:
            if f['type'] == 'string': f['py_type'] = 'str | None'
            elif f['type'] == 'text': f['py_type'] = 'str | None'
            elif f['type'] == 'integer': f['py_type'] = 'int | None'
            elif f['type'] == 'boolean': f['py_type'] = 'bool | None'
            else: f['py_type'] = 'str | None'

    def generate_all(self):
        # 1. Prepare Router dynamic parts
        search_parts = [f"models.{self.class_name}.{f['name']}.ilike(term)" for f in self.fields if f['type'] in ('string', 'text')]
        form_params = [f"{f['name']}: {f['py_type']} = Form(None)" for f in self.fields]
        model_init = [f"{f['name']}={f['name']}" for f in self.fields]
        model_update = [f"item.{f['name']} = {f['name']}" for f in self.fields]
        
        router_code = ROUTER_TEMPLATE.replace("[[ module_name_url ]]", self.module_name_url) \
            .replace("[[ module_name_snake ]]", self.module_name_snake) \
            .replace("[[ class_name ]]", self.class_name) \
            .replace("[[ module_display_name ]]", self.module_display_name) \
            .replace("[[ search_logic ]]", ",\n            ".join(search_parts)) \
            .replace("[[ form_params ]]", ",\n    ".join(form_params)) \
            .replace("[[ model_init ]]", ",\n        ".join(model_init)) \
            .replace("[[ model_update ]]", "\n    ".join(model_update))

        with open(f"app/generated/{self.module_name_snake}.py", "w", encoding="utf-8") as f:
            f.write(router_code)
            
        # 2. Prepare List dynamic parts
        headers = [f'<th class="px-6 py-4">{f["label"]}</th>' for f in self.fields]
        cells = [f'<td class="px-6 py-4 text-sm text-slate-300">{{{{ item.{f["name"]} }}}}</td>' for f in self.fields]
        
        list_html = LIST_TEMPLATE.replace("[[ module_name_url ]]", self.module_name_url) \
            .replace("[[ table_headers ]]", "\n                ".join(headers)) \
            .replace("[[ table_cells ]]", "\n                ".join(cells)) \
            .replace("[[ colspan ]]", str(len(self.fields) + 2))
            
        with open(f"templates/generated/{self.module_name_snake}_list.html", "w", encoding="utf-8") as f:
            f.write(list_html)
            
        # 3. Prepare Form dynamic parts
        form_fields = []
        for f in self.fields:
            field_html = f"""
            <div>
                <label class="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 px-1">{f['label']}</label>
                """
            if f['type'] == 'text':
                field_html += f'<textarea name="{f["name"]}" rows="4" class="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary">{{{{ item.{f["name"]} if item else "" }}}}</textarea>'
            elif f['type'] == 'boolean':
                field_html += f"""
                <div class="flex items-center gap-2">
                    <input type="checkbox" name="{f['name']}" {{{{ 'checked' if item and item.{f['name']} else '' }}}} class="rounded border-white/10 bg-white/5 text-primary focus:ring-primary">
                    <span class="text-xs text-slate-400">Aktywne / Tak</span>
                </div>"""
            else:
                input_type = 'number' if f['type'] == 'integer' else 'text'
                field_html += f'<input type="{input_type}" name="{f["name"]}" value="{{{{ item.{f["name"]} if item else "" }}}}" class="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary">'
            
            field_html += "\n            </div>"
            form_fields.append(field_html)

        form_html = FORM_TEMPLATE.replace("[[ module_name_url ]]", self.module_name_url) \
            .replace("[[ form_fields ]]", "\n".join(form_fields))
            
        with open(f"templates/generated/{self.module_name_snake}_form.html", "w", encoding="utf-8") as f:
            f.write(form_html)
            
        return {
            "router_file": f"app/generated/{self.module_name_snake}.py",
            "model_fragment": self._generate_model_fragment(),
            "nav_url": f"/{self.module_name_url}"
        }

    def _generate_model_fragment(self):
        lines = [f"class {self.class_name}(Base):", f'    __tablename__ = "{self.module_name_snake}"', "    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)"]
        for f in self.fields:
            if f['type'] == 'string': col = "String(255)"
            elif f['type'] == 'text': col = "Text"
            elif f['type'] == 'integer': col = "Integer"
            elif f['type'] == 'boolean': col = "Boolean"
            else: col = "String(255)"
            lines.append(f"    {f['name']}: Mapped[{f['py_type']}] = mapped_column({col}, nullable=True)")
        return "\n".join(lines)
