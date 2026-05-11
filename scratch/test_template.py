import asyncio
from sqlalchemy import select
from app.database import SessionLocal
from app import models
from app.templating import render
from fastapi import Request

async def test_render():
    db = SessionLocal()
    try:
        stmt = select(models.CustomerDevice).order_by(models.CustomerDevice.id)
        rows = list(db.scalars(stmt).all())
        customers = {c.id: c for c in db.scalars(select(models.Customer)).all()}
        
        node_ids = [n.id for n in rows]
        subs = {}
        if node_ids:
            active_subs = db.scalars(
                select(models.Subscription)
                .where(models.Subscription.device_id.in_(node_ids), models.Subscription.active == True)
            ).all()
            subs = {s.device_id: s for s in active_subs}

        # Mock request
        from starlette.requests import Request
        scope = {'type': 'http', 'method': 'GET', 'path': '/customer-devices', 'headers': []}
        request = Request(scope)
        request.state.portal_user = None
        
        print(f"Fetched {len(rows)} devices and {len(customers)} customers.")
        
        # This will try to render the template
        try:
            content = render(
                request,
                "customer_devices/list.html",
                {
                    "title": "Komputery / urządzenia klientów",
                    "nodes": rows,
                    "customers": customers,
                    "subscriptions": subs,
                    "search_q": "",
                }
            )
            print("Render successful!")
        except Exception as e:
            print(f"Render failed: {e}")
            import traceback
            traceback.print_exc()
            
    finally:
        db.close()

if __name__ == "__main__":
    import os
    os.environ["AUTH_ENABLED"] = "False"
    asyncio.run(test_render())
