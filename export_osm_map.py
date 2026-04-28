import json
from app.database import SessionLocal
from app import models
from sqlalchemy import select

def export_geojson():
    db = SessionLocal()
    nodes = db.scalars(
        select(models.NetNode)
        .where(models.NetNode.latitude != None, models.NetNode.longitude != None)
    ).all()
    
    features = []
    for node in nodes:
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [float(node.longitude), float(node.latitude)]
            },
            "properties": {
                "name": node.name,
                "type": node.node_type,
                "owner": node.owner_type,
                "street_number": node.street_number,
                "description": f"ID: {node.id}, Status: {node.owner_type}"
            }
        })
        
    geojson = {
        "type": "FeatureCollection",
        "features": features
    }
    
    with open("nodes_export.geojson", "w", encoding="utf-8") as f:
        json.dump(geojson, f, ensure_ascii=False, indent=2)
        
    print(f"Exported {len(features)} nodes to nodes_export.geojson")

if __name__ == "__main__":
    export_geojson()
