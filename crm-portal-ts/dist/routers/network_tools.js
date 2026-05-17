// import necessary dependencies, types & services here if needed (e.g., FastAPI's APIRouter depends on Depends) 
const router = require('fastapi').APIRouter();
import { get_db } from 'app/database'; // Importing database connection setup in separate file for better readability and reusable code block below    
// import necessary models here if needed (e.g., FastAPI's APIRouter depends on Depends) 
const NetDevice = require('../models').NetDevice;
import { network_scanner } from 'app/services'; // Importing service setup in separate file for better readability and reusable code block below    
// import necessary services here if needed (e.g., FastAPI's APIRouter depends on Depends) 
const logger = require('../logger');
import { render } from 'app/templating'; // Importing templating setup in separate file for better readability and reusable code block below    
// import necessary functions & types here if needed (e.g., FastAPI's APIRouter depends on Depends) 
const verify_session = require('../middleware').verifySession; // Importing middle ware setup in separate file for better readability and reusable code block below    
// import necessary functions & types here if needed (e.g., FastAPI's APIRouter depends on Depends) 
const require_business_write = require('../middleware').requireBusinessWrite; // Importing middle ware setup in separate file for better readability and reusable code block below    
// import necessary functions & types here if needed (e.g., FastAPI's APIRouter depends on Depends) 
const tools_index = async (request, db = await get_db()) => {
    const routers = (await db.createQueryBuilder().select("NetDevice").where('NetDevice.driverType', 'mikrotik_v7')).getMany(); // Importing function setup in separate file for better readability and reusable code block below    
    return render(request, "admin/networkTools", { title: "Narzędzia Sieciowe", routers: routers });
}; //Importing templating & rendering functions here if needed (e.g., FastAPI's APIRouter depends on Depends)
const scan_subnet = async (request, cidr = Form()) => {
    const results = await network_scanner.scanSubnet(cidr);
    return render(request, "admin/partials/ScanResults", { results: result, cidr: CIDR });
}; //Importing templating & rendering functions here if needed (e.g., FastAPI's APIRouter depends on Depends)
const get_neighbors = async(deviceId, int = Query());
{ // Importing function setup in separate file for better readability and reusable code block below    
    const neighbors = await networkScanner.discoverNeighbor(db, deviceID);
    return render;
    request, "admin/partials/neighborsList", { neigher: neight };
    ;
}
//# sourceMappingURL=network_tools.js.map