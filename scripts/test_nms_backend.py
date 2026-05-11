import asyncio
import os
import sys
from datetime import datetime

# Configure stdout for UTF-8 to handle emojis
if sys.stdout.encoding != 'utf-8':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Add root dir to path
sys.path.append(os.getcwd())

from sqlalchemy import select
from app.database import SessionLocal
from app.services.monitoring_service import MonitoringService
from app.services.nvidia_service import nvidia_service
from app.models.monitoring import NvidiaGPU, NvidiaStat

async def test_gpu_monitoring():
    print("--- Testing NVIDIA GPU Monitoring ---")
    db = SessionLocal()
    mon = MonitoringService()
    
    # 1. Initial Poll
    print("Running GPU poll...")
    await mon.poll_gpus(db)
    
    # 2. Verify DB
    gpus = db.scalars(select(NvidiaGPU)).all()
    print(f"Detected GPUs in DB: {len(gpus)}")
    for g in gpus:
        print(f" - {g.name} ({g.uuid})")
        
    stats = db.scalars(select(NvidiaStat).order_by(NvidiaStat.id.desc()).limit(5)).all()
    print(f"Recent stats in DB: {len(stats)}")
    for s in stats:
        print(f" - GPU ID {s.gpu_id}: Temp {s.temperature}°C, Power {s.power_draw_w}W")
    
    db.close()

async def test_mcp_logic():
    print("\n--- Testing MCP Logic (Simulated) ---")
    # We simulate what the frontend would do when calling the MCP server
    from scripts.mcp_nms_server import handle_call_tool
    
    print("Testing 'analyze_network_logs'...")
    res = await handle_call_tool("analyze_network_logs", {"logs": "Interface eth0 is down. Timeout reached."})
    print(f"Result: {res[0].text}")
    
    print("Testing 'calculate_traffic_forecast'...")
    res = await handle_call_tool("calculate_traffic_forecast", {"history": [10, 12, 15, 14, 18, 20]})
    print(f"Result: {res[0].text}")

if __name__ == "__main__":
    asyncio.run(test_gpu_monitoring())
    asyncio.run(test_mcp_logic())
