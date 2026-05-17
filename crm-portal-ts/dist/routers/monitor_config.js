import { Router } from 'express'; // Import express router module 
// ... other imports here...  
from;
app.database;
var get_db = ;
from;
app.deps;
var verify_session = ;
const logger = require('pino')("app.monitorConfig");
require('dotenv').config();
// ... other required modules here...  
let router;
router = Router({ mergeParams: true });
const configIndex = async (request, response) => {
    try {
        const db = get_db(); // Get database connection 
        let templates = await db.scalars(select(models.MonitorTemplate)).all();
        return renderHTML('admin/monitorConfig', 'Konfiguracja NMS', { templates: tmpls });
    }
    catch (error) { // Handle any errors that might occur 
        logger.info("Error in configIndex", error);
        response.status(500).send('Internal Server Error');
    }
};
router.get('/admin/monitor-config', verify_session, configIndex);
//# sourceMappingURL=monitor_config.js.map