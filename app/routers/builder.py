from fastapi import APIRouter, Depends, Request, Form, Body
from fastapi.responses import HTMLResponse, JSONResponse
from app.templating import render
from app.deps import require_admin
from app.engine.generator import ModuleGenerator
from app.database import SessionLocal
from app import models
import json

router = APIRouter(prefix="/admin/builder", dependencies=[Depends(require_admin)])

@router.get("", response_class=HTMLResponse)
def builder_index(request: Request):
    return render(request, "admin/builder.html", {"title": "Generator Modułów GUI"})

@router.post("/generate")
async def builder_generate(request: Request, data: dict = Body(...)):
    name = data.get("name")
    display_name = data.get("display_name")
    fields = data.get("fields", [])
    
    if not name or not fields:
        return JSONResponse({"success": False, "error": "Missing name or fields"}, status_code=400)
        
    gen = ModuleGenerator(name, display_name, fields)
    results = gen.generate_all()
    
    return JSONResponse({
        "success": True, 
        "results": results,
        "instructions": {
            "model": results["model_fragment"],
            "main": f"from app.generated import {gen.module_name_snake}\napp.include_router({gen.module_name_snake}.router)"
        }
    })

@router.post("/register-nav")
def builder_register_nav(label: str = Form(...), url: str = Form(...)):
    db = SessionLocal()
    item = models.NavMenuItem(label=label, url_path=url, sort_order=99)
    db.add(item)
    db.commit()
    return JSONResponse({"success": True})
