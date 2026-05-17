import { Router } from 'express'; // Import express router module 
// ... other imports here...  
from app.database import get_db;   
from app.deps import verify_session ;    
const logger = require('pino')("app.monitorConfig");     
require('dotenv').config();      
import { Request, Response } from 'express'; // Import express types 
// ... other required modules here...  
let router: Router;   
router  = Router({ mergeParams: true });    
const configIndex = async (request :Request , response :Response) =>{     
try {         
        const db =  get_db();         // Get database connection 
       let templates= await db.scalars(select(models.MonitorTemplate)).all() ;   
           return renderHTML('admin/monitorConfig', 'Konfiguracja NMS' ,{templates: tmpls})   } catch (error) {     // Handle any errors that might occur 
        logger.info("Error in configIndex", error);     
       response .status(500).send('Internal Server Error');    }} ;         
router.get('/admin/monitor-config', verify_session, configIndex );   } }