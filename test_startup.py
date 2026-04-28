import sys
import os

# Add current directory to path to ensure 'app' is found
sys.path.append(os.getcwd())

try:
    print("Attempting to import app.main...")
    from app.main import app
    print("Import successful!")
    
    print("Attempting to initialize database/lifespan components...")
    from app.init_db import init_all
    init_all()
    print("Database initialization successful!")
    
    print("SUCCESS: Application and Models are healthy.")
except Exception as e:
    print("\n--- STARTUP ERROR DETECTED ---")
    import traceback
    traceback.print_exc()
    sys.exit(1)
