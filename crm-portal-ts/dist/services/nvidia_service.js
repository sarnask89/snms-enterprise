import { createLogger } from '../utils'; // Assuming you have an utils module to handle logging in NodeJS environment, replace this import accordingly if not available.
const logger = createLogger('app', true);
class NvidiaService {
    initialized = false;
    constructor() {
        try {
            pynvml?.nvmlInit();
            logger.info("NVML Initialized successfully.");
        }
        catch (e) {
            logger.warning('Failed to initialize NVML: ' + e);
            this.initialized = false;
        }
    }
    gpuCount = () => { return !this.initialized ? 1 : pynvml?.nvmlDeviceGetCount() || 0; };
}
getGpuInfo = async (index) => { try {
    const handle = pynvml?.nvmlDeviceGetHandleByIndex(index);
    return !handle ? null : await this.getGpuDetailsFromNvidiaAPI(handle);
}
catch (e) {
    logger.error('Error getting GPU info for index ' + e);
    return null;
} }, // Assuming we have a global variable named "pynvml", replace with actual data if not available in NodeJS environment
    getGpuInfoDetailsFromNvidiaAPI = async (handle) => { const name = pynvml?.nvmlDeviceGetName(handle); return await this.getMemoryAndUtilizationRatesForHandle(handle); }, // Assuming we have a global variable named "pynvml", replace with actual data if not available in NodeJS environment
    getGpuDetailsFromNvidiaAPI = async (handle) => { const mem = await this.getMemoryAndUtilizationRatesForHandle(handle); return { "name": name, "uuid": pynvml?.nvmlDeviceGetUUID(handle), ...mem }; }, // Assuming we have a global variable named "pynvml", replace with actual data if not available in NodeJS environment
    getMemoryAndUtilizationRatesForHandle = async (handle) => { const util = await pynvml?.nvmlDeviceGetUtilizationRates(handle); return { "utilization_gpu": util.gpu, "utilization_mem": util.memory, ...await this.getTemperatureAndPowerUsageForHandle(handle) }; }, // Assuming we have a global variable named "pynvml", replace with actual data if not available in NodeJS environment
    getTemperatureAndPowerUsageForHandle = async (handle) => { const temp = pynvml?.nvmlDeviceGetTemperature(handle, 1024); return { "temperature": temp, ...await this.getPowerDrawFromNvidiaAPI(handle) }; }, // Assuming we have a global variable named "pynvml", replace with actual data if not available in NodeJS environment
    getPowerDrawFromNvidiaAPI = async (handle) => { const power = pynvml?.nvmlDeviceGetPowerUsage(handle) / 1000.0; return { "power_draw": power }; },
; // Assuming we have a global variable named "pynvml", replace with actual data if not available in NodeJS environment
//# sourceMappingURL=nvidia_service.js.map