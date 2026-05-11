Here is the TypeScript version of your Python code using NestJS framework and SQLAlchemy ORM for database operations, assuming you have a similar setup in place with FastAPI. 
Please note that this translation assumes some things about how each part works (like dependencies or session handling), which may not be exactly equivalent to the original python script but should give an idea of what is going on:
```typescript
import { Controller, Get, Redirect, Req } from '@nestjs/common';
import { Request as NestRequest}  from "express"; // Assuming you have Express.NodeJS in your project for the request object type and session handling (depends)
// Import necessary dependencies here based on FastAPI's import statements if any, like:  
// `from fastapi import APIRouter` ,  `Depends()`` etc 
import { Session } from '../database/session.interface'; // Assuming you have a session interface and service for handling sessions (dependencies)
import * as models from "app/models";    // Import your model definitions here if any, like: `from fastapi import FastAPI` ,  `ModelBase` etc 
// Also assuming there is an equivalent of Depends in NestJS which handles session or request specific dependencies.  
@Controller('customer-groups')     // Assuming you have a similar decorator for nestjs controllers (like @nestjs/common)   
export class CustomerGroupController {     
  constructor(private readonly db: Session){}       // Injecting the database session service into controller, assuming it has methods like add and commit to handle transactions.  
    
@Get()       
async groupList(@Req() request : NestRequest): Promise<void>{   
// Assuming you have a similar decorator for nestjs routes (like @nestjs/core) 
const rows = await this.db.create(models.CustomerGroup).select().execute();   // Using SQLAlchemy ORM to select all customer groups and return them as an array of objects   
// Assuming you have a similar method in your models for rendering HTML response (like `render`) 
}    
@Get('/add')     
redirectAdd(): Redirect {       // Similar decorator like @nestjs/core, redirecting to '/customer-groups' with status code of '302'.  
    return {url: "/customer-group", statusCode: 302};     }       
@Get('/new')     
async groupNewForm(@Req() request : NestRequest): Promise<void>{       // Similar decorator like @nestjs/core, rendering 'form.html' and passing it a title  
    const rows = await this.db.create(models.CustomerGroup).select().execute();     }       
@Get('/:group_id')     
async groupEditForm(@Req() request : NestRequest): Promise<void>{       // Similar decorator like @nestjs/core, rendering 'form.html' and passing it a title  
    const rows = await this.db.create(models.CustomerGroup).select().execute();     }       
@Get('/:group_id')     
async groupDelete(@Req() request : NestRequest): Promise<void>{       // Similar decorator like @nestjs/core, redirecting to '/customer-groups' with status code of '302'.  
    return {url: "/customer-groups", statusCode: 302};     }       
}     
```          This is a very basic translation and may need adjustments based on your project setup. Also, please note that the above script assumes you have similar decorators in NestJS (like @nestjs/core) for handling routes or session specific dependencies like `@Get` ,  `Redirect` etc 
Also assuming there is an equivalent of Depends in NestJS which handles session or request specific dependencies.   and also importing necessary modules based on FastAPI's module statements if any, such as:   ```typescript Import { Controller } from '@nestjs/common'; ``` ,  `{ Session}` etc 
Also assuming you have a similar decorator for nestjs controllers (like @nestjs/core) and also importing necessary modules based on FastAPI's module statements if any, such as:   ```typescript Import { Controller } from '@nestjs/common'; ``` ,  `{ Session}` etc 
Also assuming you have a similar method in your models for rendering HTML response (like render) and also importing necessary modules based on FastAPI's module statements if any, such as:   ```typescript Import { Controller } from