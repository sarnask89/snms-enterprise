The provided code snippet is a Python script that handles various functionalities related to network discovery and management in an administrative system. It includes routes for importing devices, networks, and parsing comments using the Gemini library. Here's a breakdown of what each part does:

### Import Statements
```python
from fastapi import FastAPI, Form, HTTPException, Request
from sqlalchemy.orm import Session
from app.models import NetDevice, IpNetwork
from app.services.mikrotik_parser import match_street_name
from app.audit import record_audit
import datetime
```
- `FastAPI`: The main application framework.
- `Form`: Used to handle form data in POST requests.
- `HTTPException`: For raising HTTP errors.
- `Request`: Represents the incoming request.
- `Session`: A session object for database operations.
- `NetDevice`, `IpNetwork`: Models representing devices and networks in the database.
- `match_street_name`: A function from the `gemini` library to match street names with CRM data.
- `record_audit`: A function to log audit entries.
- `datetime`: For handling date and time.

### Application Initialization
```python
app = FastAPI()
```
Creates an instance of the FastAPI application.

### Routes

#### Import Device
```python
@app.post("/admin/discovery/import")
async def import_device(
    request: Request,
    mac: str = Form(...),
    ip: str | None = Form(None),
    device_id: int = Form(...),
    last_name: str = Form(...),
    street_id: int | None = Form(None),
    street_number: str | None = Form(None),
    apartment_number: str | None = Form(None),
    rate_limit: str | None = Form(None)
):
    # Check if the device already exists
    existing_device = db.get(NetDevice, device_id)
    if existing_device:
        return HTMLResponse("Device already exists", status_code=400)

    # Create a new NetDevice instance
    new_device = NetDevice(
        mac=mac,
        ip=ip,
        last_name=last_name,
        street_id=street_id,
        street_number=street_number,
        apartment_number=apartment_number,
        rate_limit=rate_limit,
        net_device_id=device_id,
    )
    db.add(new_device)
    db.commit()

    # Record audit
    record_audit(db, "import_device", "net_device", device_id, f"Imported device {mac} from {request.headers.get('X-Device-ID', '')}", request)

    response = HTMLResponse(f"""
        <div class="p-4 bg-emerald-50 text-white rounded-xl shadow-lg animate-bounce">
            <i class="fas fa-check-circle mr-2"></i> Device imported! Odświeżanie dzierżaw...
        </div>
    """)
    response.headers["HX-Refresh"] = "true"
    return response
```
This route handles the import of a device. It checks if the device already exists in the database, creates a new `NetDevice` instance, adds it to the session, commits the changes, and logs an audit entry.

#### Import Network
```python
@app.post("/admin/discovery/import-network")
async def import_network(
    request: Request,
    cidr: str = Form(...),
    gateway: str | None = Form(None),
    comment: str | None = Form(None),
    device_id: int = Form(...),
):
    # Check if the network already exists
    existing_net = db.get(IpNetwork, device_id)
    if existing_net:
        return HTMLResponse("Network already exists", status_code=400)

    # Create a new IpNetwork instance
    new_net = IpNetwork(
        cidr=cidr,
        gateway=gateway,
        comment=comment,
        active=True,
        net_device_id=device_id,
    )
    db.add(new_net)
    db.commit()

    # Record audit
    record_audit(db, "import_network", "net_device", device_id, f"Imported network {cidr} from {request.headers.get('X-Device-ID', '')}", request)

    response = HTMLResponse(f"""
        <div class="p-4 bg-emerald-50 text-white rounded-xl shadow-lg animate-bounce">
            <i class="fas fa-check-circle mr-2"></i> Network imported! Odświeżanie dzierżaw...
        </div>
    """)
    response.headers["HX-Refresh"] = "true"
    return response
```
This route handles the import of a network. It checks if the network already exists in the database, creates a new `IpNetwork` instance, adds it to the session, commits the changes, and logs an audit entry.

#### Smart Parse Comment
```python
@app.post("/smart-parse")
async def smart_parse_comment(
    request: Request,
    comment: