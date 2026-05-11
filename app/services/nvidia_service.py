import logging
import random
try:
    import pynvml
    HAS_NVML = True
except ImportError:
    HAS_NVML = False

logger = logging.getLogger("app.nvidia")

class NvidiaService:
    def __init__(self):
        self.initialized = False
        if HAS_NVML:
            try:
                pynvml.nvmlInit()
                self.initialized = True
                logger.info("NVML Initialized successfully.")
            except Exception as e:
                logger.warning(f"NVML Init failed (likely no driver): {e}")
                self.initialized = False

    def get_gpu_count(self):
        if not self.initialized:
            return 1 # Simulate 1 GPU if not found
        try:
            return pynvml.nvmlDeviceGetCount()
        except:
            return 0

    def get_gpu_info(self, index):
        """Returns static info about a GPU."""
        if not self.initialized:
            return {
                "name": "NVIDIA GeForce RTX 4090 (Simulated)",
                "uuid": f"GPU-SIM-{index}",
                "vram_total_mb": 24576
            }
        
        try:
            handle = pynvml.nvmlDeviceGetHandleByIndex(index)
            name = pynvml.nvmlDeviceGetName(handle)
            uuid = pynvml.nvmlDeviceGetUUID(handle)
            mem = pynvml.nvmlDeviceGetMemoryInfo(handle)
            return {
                "name": name,
                "uuid": uuid,
                "vram_total_mb": mem.total // (1024 * 1024)
            }
        except Exception as e:
            logger.error(f"Error getting GPU info for index {index}: {e}")
            return None

    def get_gpu_stats(self, index):
        """Returns dynamic stats for a GPU."""
        if not self.initialized:
            # Random simulation for NMS demo
            return {
                "utilization_gpu": random.randint(10, 80),
                "utilization_mem": random.randint(20, 60),
                "vram_used_mb": random.randint(2000, 12000),
                "temperature": random.randint(45, 75),
                "power_draw_w": random.uniform(50.0, 350.0)
            }
        
        try:
            handle = pynvml.nvmlDeviceGetHandleByIndex(index)
            util = pynvml.nvmlDeviceGetUtilizationRates(handle)
            mem = pynvml.nvmlDeviceGetMemoryInfo(handle)
            temp = pynvml.nvmlDeviceGetTemperature(handle, pynvml.NVML_TEMPERATURE_GPU)
            try:
                power = pynvml.nvmlDeviceGetPowerUsage(handle) / 1000.0
            except:
                power = 0.0
            
            return {
                "utilization_gpu": util.gpu,
                "utilization_mem": util.memory,
                "vram_used_mb": mem.used // (1024 * 1024),
                "temperature": temp,
                "power_draw_w": power
            }
        except Exception as e:
            logger.error(f"Error getting GPU stats for index {index}: {e}")
            return None

nvidia_service = NvidiaService()
