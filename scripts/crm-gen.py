import sys
import os

# Add root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.engine.generator import ModuleGenerator
from app.database import SessionLocal
from app import models
import sqlalchemy as sa

def main():
    print("=== CRM Module Generator ===")
    name = input("Module name (e.g. Inventory Log): ").strip()
    display_name = input("Display name (e.g. Dziennik Magazynowy): ").strip()
    
    fields = []
    print("\nDefine fields (enter empty name to stop):")
    while True:
        fname = input("  Field name (snake_case): ").strip()
        if not fname: break
        flabel = input(f"  Label for {fname}: ").strip()
        ftype = input(f"  Type (string/text/integer/boolean) [string]: ").strip() or "string"
        fields.append({"name": fname, "label": flabel, "type": ftype})

    if not fields:
        print("Error: No fields defined.")
        return

    gen = ModuleGenerator(name, display_name, fields)
    results = gen.generate_all()
    
    print("\n--- Generation Results ---")
    print(f"Router: {results['router_file']}")
    print(f"URL: {results['nav_url']}")
    
    print("\n--- SQL/Model Action Needed ---")
    print("1. Add the following to app/models.py:")
    print(results['model_fragment'])
    
    print("\n2. Execute SQL to create table (PowerShell):")
    # Generate SQLite DDL
    cols = ["id INTEGER PRIMARY KEY AUTOINCREMENT"]
    for f in fields:
        if f['type'] == 'integer': t = "INTEGER"
        elif f['type'] == 'boolean': t = "BOOLEAN"
        elif f['type'] == 'text': t = "TEXT"
        else: t = "VARCHAR(255)"
        cols.append(f"{f['name']} {t}")
    sql = f"CREATE TABLE {gen.module_name_snake} ({', '.join(cols)});"
    print(f'python -c "import sqlite3; conn = sqlite3.connect(\'crm.sqlite\'); conn.execute(\'{sql}\'); conn.commit(); conn.close()"')

    print("\n3. Register router in app/main.py:")
    print(f"from app.generated import {gen.module_name_snake}")
    print(f"app.include_router({gen.module_name_snake}.router)")

    # Optional auto-nav insertion
    do_nav = input("\nRegister in Navbar now? (y/n): ").strip().lower() == 'y'
    if do_nav:
        db = SessionLocal()
        item = models.NavMenuItem(
            label=display_name,
            url_path=results['nav_url'],
            sort_order=99
        )
        db.add(item)
        db.commit()
        print("Navbar entry created.")

if __name__ == "__main__":
    main()
