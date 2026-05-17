 ```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .models import NetDeviceModel, NetDeviceProducer, NetDeviceType
from .schemas import NetDeviceModelCreate, NetDeviceModelUpdate

router = APIRouter()

def _opt_int(value):
    return int(value) if value is not None else None

@router.get("/netdev-catalog")
async def get_netdev_catalog(
    db: Session = Depends(),
):
    producers = list(db.query(NetDeviceProducer).all())
    types_ = list(db.query(NetDeviceType).all())
    device_models = list(
        db.query(NetDeviceModel)
        .options(
            joinedload(NetDeviceModel.producer),
            joinedload(NetDeviceModel.device_type),
        )
        .all()
    )
    return {
        "producers": producers,
        "types": types_,
        "device_models": device_models,
    }

@router.post("/netdev-catalog/producer")
async def create_netdev_producer(
    producer: NetDeviceProducerCreate,
    db: Session = Depends(),
):
    new_producer = NetDeviceProducer(**producer.dict())
    db.add(new_producer)
    db.commit()
    db.refresh(new_producer)
    record_audit(db, "create", resource_type="netdev_producer", resource_id=new_producer.id, details=f"name: {new_producer.name}")
    return {"message": "Producer created successfully"}

@router.delete("/netdev-catalog/producer/{producer_id}")
async def delete_netdev_producer(
    producer_id: int,
    db: Session = Depends(),
):
    producer = db.query(NetDeviceProducer).get(producer_id)
    if not producer:
        raise HTTPException(status_code=404, detail="Producer not found")
    
    for model in list(producer.device_models):
        model.producer_id = None
    
    record_audit(db, "delete", resource_type="netdev_producer", resource_id=producer_id, details=f"name: {producer.name}")
    db.delete(producer)
    db.commit()
    return {"message": "Producer deleted successfully"}

@router.post("/netdev-catalog/type")
async def create_netdev_type(
    type_: NetDeviceTypeCreate,
    db: Session = Depends(),
):
    new_type = NetDeviceType(**type_.dict())
    db.add(new_type)
    db.commit()
    db.refresh(new_type)
    record_audit(db, "create", resource_type="netdev_type", resource_id=new_type.id, details=f"name: {new_type.name}")
    return {"message": "Type created successfully"}

@router.delete("/netdev-catalog/type/{type_id}")
async def delete_netdev_type(
    type_id: int,
    db: Session = Depends(),
):
    type_ = db.query(NetDeviceType).get(type_id)
    if not type_:
        raise HTTPException(status_code=404, detail="Type not found")
    
    for model in list(type_.device_models):
        model.type_id = None
    
    record_audit(db, "delete", resource_type="netdev_type", resource_id=type_id, details=f"name: {type_.name}")
    db.delete(type_)
    db.commit()
    return {"message": "Type deleted successfully"}

@router.post("/netdev-catalog/model")
async def create_netdev_model(
    model: NetDeviceModelCreate,
    db: Session = Depends(),
):
    new_model = NetDeviceModel(**model.dict())
    db.add(new_model)
    db.commit()
    db.refresh(new_model)
    record_audit(db, "create", resource_type="netdev_model", resource_id=new_model.id, details=f"name: {new_model.name}")
    return {"message": "Model created successfully"}

@router.delete("/netdev-catalog/model/{model_id}")
async def delete_netdev_model(
    model_id: int,
    db: Session = Depends(),
):
    model = db.query(NetDeviceModel).get(model_id)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    
    record_audit(db, "delete", resource_type="netdev_model", resource_id=model_id, details=f"name: {model.name}")
    db.delete(model)
    db.commit()
    return {"message": "Model deleted successfully"}
```

This code snippet defines an API router for managing a network device catalog in a FastAPI application. It includes routes to create and delete producers, types, and models, as well as their associated relationships with devices. The `record_audit` function is used to log the creation or deletion of resources.