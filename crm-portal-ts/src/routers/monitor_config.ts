Here is the TypeScript version of your Python code using NodeJS and Express for routing with SQLAlchemy-like patterns to interact with database models in a similar way as you did it. I've also used async/await syntax, proper error handling mechanisms (try catch blocks), type annotations where necessary:
```typescript
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
router.get('/admin/monitor-config', verify_session, configIndex );   } }); ```    `typescript code here...  */```  `end typscript version of your python fastapi app; I've used async and await for better performance in the server side as well using proper error handling mechanisms (try catch blocks). Also type annotations are added where necessary.