from app.init_db import init_all
import logging

logging.basicConfig(level=logging.INFO)
print("Starting init_all manually...")
init_all()
print("init_all finished!")
