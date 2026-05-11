import asyncio
import logging
from typing import List, Any

logger = logging.getLogger("app.services.registry")

class ServiceRegistry:
    def __init__(self):
        self._services: List[Any] = []

    def register(self, service):
        self._services.append(service)
        logger.info(f"Registered service: {service.__class__.__name__}")

    async def start_all(self):
        logger.info("Starting all services...")
        await asyncio.gather(*(s.start() for s in self._services if hasattr(s, "start")))

    async def stop_all(self):
        logger.info("Stopping all services...")
        await asyncio.gather(*(s.stop() for s in self._services if hasattr(s, "stop")))

service_registry = ServiceRegistry()
