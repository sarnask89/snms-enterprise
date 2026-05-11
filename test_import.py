import asyncio
from app.database import SessionLocal
from app.routers.network_discovery import import_all_leases
from fastapi import Request

async def test():
    db = SessionLocal()
    req = Request({
        'type': 'http',
        'method': 'POST',
        'url': 'http://127.0.0.1:8080/',
        'headers': []
    })
    try:
        res = await import_all_leases(80, req, db)
        print("Import zakończony. Status:", getattr(res, 'status_code', '?'))
        print(res.body.decode()[:300])
    except Exception as e:
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(test())
