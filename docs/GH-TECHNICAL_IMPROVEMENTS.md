# SNMS Enterprise - Technical Improvements & Architecture Recommendations

**Document Type**: Architecture & Performance Analysis  
**Date**: April 28, 2026

---

## Table of Contents

1. [Architecture Improvements](#architecture-improvements)
2. [Performance Optimizations](#performance-optimizations)
3. [Code Quality Enhancements](#code-quality-enhancements)
4. [Operational Improvements](#operational-improvements)
5. [Migration Path](#migration-path)

---

## Architecture Improvements

### 1. Service Layer Abstraction 🏗️

**Current Issue**: Business logic mixed with route handlers

**Current Pattern**:
```python
# app/routers/customers.py
@router.post("/customers/new")
def create_customer(request, db, ...):
    cid = int(customer_id) if customer_id and str(customer_id).strip().isdigit() else None
    c = models.Customer(...)
    db.add(c)
    db.flush()
    record_audit(db, ...)
    db.commit()
    return RedirectResponse(...)
```

**Improvement**: Extract business logic into service layer

```python
# app/services/customer_service.py
from app.models import Customer
from app.audit import record_audit
from fastapi import HTTPException

class CustomerService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_customer(self, customer_code: str, first_name: str, 
                        last_name: str, **kwargs) -> Customer:
        """Business logic for customer creation."""
        # Validate
        existing = self.db.scalars(
            select(Customer).where(Customer.customer_code == customer_code)
        ).first()
        
        if existing:
            raise ValueError(f"Customer code {customer_code} already exists")
        
        # Create
        customer = Customer(
            customer_code=customer_code,
            first_name=first_name,
            last_name=last_name,
            **kwargs
        )
        self.db.add(customer)
        self.db.flush()
        
        # Audit
        record_audit(
            self.db,
            "create",
            resource_type="customer",
            resource_id=customer.id,
            details=f"code: {customer.customer_code}"
        )
        return customer

# app/routers/customers.py
from app.services.customer_service import CustomerService

@router.post("/customers/new")
def create_customer(request, db, form_data):
    try:
        service = CustomerService(db)
        customer = service.create_customer(**form_data)
        db.commit()
        return RedirectResponse(f"/customers/{customer.id}", status_code=303)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create customer")
```

**Benefits**:
- Testable business logic separate from HTTP handling
- Reusable across different endpoints (REST API, background jobs)
- Easier to add validation and rules
- Clear separation of concerns

**Implementation Timeline**: 6-8 weeks for full migration

---

### 2. Dependency Injection Pattern 🔧

**Current Issue**: Direct database access in routers

**Improvement**: Use proper dependency injection

```python
# app/dependencies.py
from typing import Annotated
from fastapi import Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.customer_service import CustomerService

def get_customer_service(db: Session = Depends(get_db)) -> CustomerService:
    return CustomerService(db)

CustomerServiceDep = Annotated[CustomerService, Depends(get_customer_service)]

# app/routers/customers.py
@router.post("/customers/new")
def create_customer(
    request: Request,
    customer_service: CustomerServiceDep,
    form_data: CustomerCreate = Depends(),
):
    try:
        customer = customer_service.create_customer(**form_data.dict())
        return RedirectResponse(...)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))
```

**Benefits**:
- Easier to mock in tests
- Services are loosely coupled
- Dependency graph is explicit
- Easier to swap implementations

---

### 3. Repository Pattern for Data Access 📦

**Current Issue**: Data queries scattered across routers

**Improvement**: Create repository layer

```python
# app/repositories/customer_repository.py
from sqlalchemy.orm import Session
from app.models import Customer

class CustomerRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def get_by_id(self, customer_id: int) -> Customer | None:
        return self.db.get(Customer, customer_id)
    
    def get_by_code(self, customer_code: str) -> Customer | None:
        return self.db.scalars(
            select(Customer).where(Customer.customer_code == customer_code)
        ).first()
    
    def search(self, query: str | None = None, status: str | None = None) -> list[Customer]:
        stmt = select(Customer).options(
            joinedload(Customer.city),
            joinedload(Customer.street)
        ).order_by(Customer.id.desc())
        
        if query and query.strip():
            term = f"%{query.strip()}%"
            stmt = stmt.where(or_(
                Customer.customer_code.ilike(term),
                Customer.last_name.ilike(term),
                Customer.email.ilike(term)
            ))
        
        if status and status in [s.value for s in CustomerStatus]:
            stmt = stmt.where(Customer.status == CustomerStatus(status))
        
        return list(self.db.scalars(stmt).all())
    
    def create(self, **kwargs) -> Customer:
        customer = Customer(**kwargs)
        self.db.add(customer)
        return customer
    
    def save(self) -> None:
        self.db.flush()

# Usage in service
class CustomerService:
    def __init__(self, repository: CustomerRepository):
        self.repository = repository
    
    def search_customers(self, query: str | None, status: str | None):
        return self.repository.search(query, status)
```

**Benefits**:
- Single place to modify queries
- Easy to implement pagination/filtering
- Query optimization in one place
- Testable with mock repository

---

### 4. Event System for Async Operations 🔔

**Current Issue**: Long-running operations block HTTP responses

**Current Problem**:
```python
@router.post("/admin/teryt-sync")
def sync_teryt(request, db):
    # This blocks the entire request!
    for state in wojewodztwa_as_serializable():
        for district in powiaty_as_serializable(state['id']):
            # ... 10+ seconds of SOAP calls
    return RedirectResponse(...)
```

**Improvement**: Use async events

```python
# app/events.py
from enum import Enum
from pydantic import BaseModel

class EventType(str, Enum):
    TERYT_SYNC_REQUESTED = "teryt_sync_requested"
    CUSTOMER_CREATED = "customer_created"
    INVOICE_GENERATED = "invoice_generated"

class Event(BaseModel):
    type: EventType
    payload: dict
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# app/event_bus.py
import asyncio
from typing import Callable

class EventBus:
    def __init__(self):
        self._handlers: dict[EventType, list[Callable]] = {}
    
    def subscribe(self, event_type: EventType, handler: Callable) -> None:
        if event_type not in self._handlers:
            self._handlers[event_type] = []
        self._handlers[event_type].append(handler)
    
    async def emit(self, event: Event) -> None:
        handlers = self._handlers.get(event.type, [])
        tasks = [h(event) for h in handlers]
        await asyncio.gather(*tasks)

# app/background_tasks.py
async def handle_teryt_sync(event: Event):
    """Long-running TERYT sync task."""
    db = SessionLocal()
    try:
        logger.info("Starting TERYT sync...")
        for state in wojewodztwa_as_serializable():
            for district in powiaty_as_serializable(state['id']):
                # ... sync logic
        logger.info("TERYT sync completed")
    except Exception as e:
        logger.error(f"TERYT sync failed: {e}")
    finally:
        db.close()

# app/main.py - register event handlers
from app.background_tasks import handle_teryt_sync

# In lifespan:
event_bus = EventBus()
event_bus.subscribe(EventType.TERYT_SYNC_REQUESTED, handle_teryt_sync)

# app/routers/admin.py - emit event instead of blocking
@router.post("/admin/teryt-sync")
async def trigger_teryt_sync(request: Request):
    await event_bus.emit(Event(
        type=EventType.TERYT_SYNC_REQUESTED,
        payload={}
    ))
    return JSONResponse({"status": "TERYT sync started in background"})
```

**Benefits**:
- HTTP requests don't block on long operations
- Can process events asynchronously
- Easier to add UI progress tracking
- Scalable with message queue (Celery, RQ)

---

## Performance Optimizations

### 5. Query Optimization & Eager Loading 📊

**Current Issue**: N+1 query problem

**Before**:
```python
customers = db.scalars(select(Customer)).all()
for customer in customers:
    print(customer.city.name)  # ← N additional queries!
```

**After**:
```python
customers = db.scalars(
    select(Customer).options(
        joinedload(Customer.city),
        joinedload(Customer.district),
        joinedload(Customer.state)
    )
).unique().all()
```

**Action Items**:
- [ ] Add `joinedload()` to all customer list queries
- [ ] Add `selectinload()` for collections (customer.nodes)
- [ ] Profile with SQLAlchemy event logging
- [ ] Create test fixture for N+1 detection

---

### 6. Add Query Result Caching ⚡

**Problem**: TERYT city/street data queried repeatedly

```python
# app/cache.py
import functools
from datetime import timedelta
import redis

cache = redis.Redis(host='localhost', port=6379, db=0)

def cached(ttl: int = 3600):
    """Cache decorator for expensive operations."""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            cache_key = f"{func.__name__}:{args}:{kwargs}"
            
            # Try cache
            cached_value = cache.get(cache_key)
            if cached_value:
                return json.loads(cached_value)
            
            # Compute and cache
            result = func(*args, **kwargs)
            cache.setex(cache_key, ttl, json.dumps(result))
            return result
        
        return wrapper
    return decorator

# Usage
@cached(ttl=3600)  # 1 hour
def get_teryt_cities(district_id: int):
    return db.scalars(
        select(LocationCity).where(LocationCity.district_id == district_id)
    ).all()
```

**Configuration Need**:
```yaml
# docker-compose.yml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

---

### 7. Add Pagination to Large Lists 📄

**Current Issue**: `customer_list` loads ALL customers

```python
# app/schemas.py
from pydantic import BaseModel, Field

class PaginationParams(BaseModel):
    page: int = Field(1, ge=1)
    per_page: int = Field(20, ge=5, le=100)

class PaginatedResponse(BaseModel, Generic[T]):
    items: list[T]
    total: int
    page: int
    per_page: int
    pages: int

# app/repositories/customer_repository.py
def search_paginated(self, query: str | None, page: int, per_page: int):
    stmt = self._base_search_stmt(query)
    total = self.db.query(Customer).filter(...).count()
    
    offset = (page - 1) * per_page
    items = self.db.scalars(stmt.offset(offset).limit(per_page)).all()
    
    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page
    )
```

---

## Code Quality Enhancements

### 8. Type Annotations & Mypy ✅

**Current State**: Partial type hints

**Improvement**: Full strict mode

```bash
# pyproject.toml
[tool.mypy]
python_version = "3.11"
strict = true
plugins = []

# Run:
mypy app/ --strict
```

**Benefits**:
- Catches type errors at development time
- Better IDE autocomplete
- Self-documenting code

---

### 9. Structured Logging 📝

**Current**:
```python
logger.error(f"Mikrotik API error (get_leases): {e}")  # Plain text
```

**Improvement**:
```python
import structlog

structlog.configure(
    processors=[
        structlog.processors.JSONRenderer()
    ]
)

logger = structlog.get_logger()

# Usage:
logger.error(
    "mikrotik_api_error",
    error_type=type(e).__name__,
    host=self.host,
    port=self.port,
    operation="get_leases",
    duration_ms=elapsed_ms
)

# Output:
{
    "event": "mikrotik_api_error",
    "error_type": "TimeoutError",
    "host": "10.0.0.1",
    "port": 8728,
    "operation": "get_leases",
    "duration_ms": 30000,
    "timestamp": "2026-04-28T10:30:45.123Z"
}
```

**Benefits**:
- Parseable by log aggregation systems (ELK, Datadog)
- Better searchability and analysis
- Easier debugging

---

### 10. Automated Code Quality Checks 🤖

```bash
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/psf/black
    rev: 23.1.0
    hooks:
      - id: black
  
  - repo: https://github.com/PyCQA/isort
    rev: 5.12.0
    hooks:
      - id: isort
  
  - repo: https://github.com/PyCQA/flake8
    rev: 6.0.0
    hooks:
      - id: flake8
  
  - repo: https://github.com/PyCQA/bandit
    rev: 1.7.5
    hooks:
      - id: bandit

# Install:
pip install pre-commit
pre-commit install
pre-commit run --all-files
```

---

## Operational Improvements

### 11. Monitoring & Observability 📈

**Add Prometheus metrics**:

```python
# app/metrics.py
from prometheus_client import Counter, Histogram, Gauge

# Request metrics
request_count = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

request_duration = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration',
    ['method', 'endpoint']
)

# Business metrics
customers_created = Counter(
    'customers_created_total',
    'Total customers created'
)

# Database metrics
db_connections = Gauge(
    'db_connections_active',
    'Active database connections'
)

# app/middleware_portal.py - add metrics
@app.middleware("http")
async def add_metrics(request: Request, call_next):
    with request_duration.labels(
        method=request.method,
        endpoint=request.url.path
    ).time():
        response = await call_next(request)
    
    request_count.labels(
        method=request.method,
        endpoint=request.url.path,
        status=response.status_code
    ).inc()
    
    return response
```

**Visualize with Grafana**:
- Request latency percentiles
- Error rates by endpoint
- Database connection pool usage
- API quota utilization

---

### 12. Distributed Tracing 🔗

```python
# app/main.py
from opentelemetry.auto_instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.exporter.jaeger import JaegerExporter
from opentelemetry.sdk.trace import TracerProvider

FastAPIInstrumentor().instrument_app(app)

jaeger_exporter = JaegerExporter(agent_host_name="localhost")
trace.set_tracer_provider(TracerProvider())
trace.get_tracer_provider().add_span_processor(
    BatchSpanProcessor(jaeger_exporter)
)
```

**Benefits**:
- Trace requests across services
- Identify performance bottlenecks
- Understand service dependencies

---

### 13. Database Backup Strategy 🔄

```python
# app/backup_service.py
import subprocess
import datetime

class DatabaseBackupService:
    @staticmethod
    def backup_sqlite(db_path: str, backup_dir: str):
        timestamp = datetime.datetime.now().isoformat()
        backup_path = f"{backup_dir}/crm_{timestamp}.sqlite.gz"
        
        subprocess.run([
            "tar", "czf", backup_path, db_path
        ], check=True)
        
        logger.info(f"Database backed up to {backup_path}")
        
        # Keep only last 30 days
        BackupRetentionPolicy.cleanup(backup_dir, days=30)

# app/routers/admin.py
@router.post("/admin/backup")
def trigger_backup(request: Request, db: Session):
    backup_service = DatabaseBackupService()
    backup_service.backup_sqlite(DATABASE_PATH, BACKUP_DIR)
    return {"status": "Backup created"}
```

---

## Migration Path

### Phase 1: Foundation (Weeks 1-2)
- [x] Security hotfixes
- [ ] Set up structured logging
- [ ] Add Prometheus metrics
- [ ] Configure pre-commit hooks

### Phase 2: Architecture (Weeks 3-4)
- [ ] Extract service layer for Customer module
- [ ] Create repository pattern
- [ ] Add dependency injection helpers
- [ ] Write tests for services

### Phase 3: Performance (Weeks 5-6)
- [ ] Add eager loading to queries
- [ ] Implement Redis caching
- [ ] Add pagination
- [ ] Profile and optimize slow queries

### Phase 4: Operations (Weeks 7-8)
- [ ] Set up Prometheus/Grafana
- [ ] Configure Jaeger tracing
- [ ] Implement backup automation
- [ ] Document deployment runbooks

### Phase 5: Scaling (Weeks 9-10)
- [ ] Add event bus for async tasks
- [ ] Consider Celery for background jobs
- [ ] Evaluate PostgreSQL migration
- [ ] Load testing

---

## Infrastructure Improvements

### Recommended Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      DATABASE_URL: "postgresql+psycopg://crm:password@db:5432/snms_crm"
      REDIS_URL: "redis://redis:6379/0"
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: crm
      POSTGRES_PASSWORD: password
      POSTGRES_DB: snms_crm
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin

volumes:
  postgres_data:
```

---

## Success Metrics

Track these KPIs:

| Metric | Target | Current |
|--------|--------|---------|
| API Response Time (p95) | <200ms | ? |
| Error Rate | <0.1% | ? |
| Database Queries/Request | <5 | ? |
| Test Coverage | >80% | ? |
| Security Vulnerabilities | 0 critical | 3 |
| MTTD (Mean Time To Detect) | <5 min | ? |
| MTTR (Mean Time To Resolve) | <15 min | ? |

---

**Document Version**: 1.0  
**Last Updated**: 2026-04-28
