import { Session } from "typeorm"; // Importing typeORM session object. 
// This is necessary because TypeScript does not support the use of 'any' directly, but we need to import it for using its types and methods later on in our codebase.  

class MonitoringService{    
    db: Session | null = null; // Declare a variable with type "Session" (typeORM session object) or set as NULL initially 
                                // This is necessary because TypeScript does not support the use of 'any' directly, but we need to import it for using its types and methods later on in our codebase.  
    
    async ping_device(ip: string): Promise<number | null> {        
        if (!ip) return; // Checking whether ip is not empty or undefined 
                                // This will prevent any possible errors when calling the function with an invalid IP address, similar to Python's None.  
                                
        try{            
            const process = await import("child_process").then(mod => mod.execSync(`ping -n 1 -w 50 ${ip} `)); // Using child-process module for ping command execution in NodeJS environment, similar to Python's subprocess library  
                                                            // This will return the output of executed process or null if it fails   
            const result = JSON.parse(`${process}`); 
            
           /* Parse latency from 'ping -l' command by splitting string and getting time in ms, similar to Python script */  
                                                            // This will return the output of executed process or null if it fails   
            const rtt = result.map(item => {if (typeof item === "object"){return parseInt((parseFloat)(new Date() - new Date(Object.values(item)[3])) / 100)} else {} });   // This will return an array of parsed RTTs or empty if it fails   
            
            /* Return the first element from rtt, similar to Python's `rtt[0]` */    
                                                            // If there is no data in 'ping -l', this function returns null.  
                                                                  return (typeof item === "object") ? parseInt((parseFloat)(new Date() - new Date(Object.values(item)[3])) /100) : "";    } catch { /* Catching any error */ }} // End of try-catch block for async function ping_device  
    
}