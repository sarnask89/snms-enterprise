import { Controller, Get } from '@nestjs/common';
import { Request, Response as ExpressResponse} from "express"; // Import the correct type of response object based on your use case and framework you are using like express in nest.js (Express or Nest) 
// import necessary dependencies for FastAPI & Dependency Injection if needed  
@Controller('client')    // Define a controller with path 'client' to access the methods below it, this is optional based on your use case and structure of project you are working in. If not defined then all routes will be under '/api/v1'. 
export class ClientController {    
   @Get()     
   root(@Request() request: ExpressResponse) : void{    // Define a method with path 'client' to access the methods below it, this is optional based on your use case and structure of project you are working in. If not defined then all routes will be under '/api/v1'. 
      console.log(request);   // Log request object for debugging purposes   
       return;     }       
}