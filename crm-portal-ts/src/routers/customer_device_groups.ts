Here's the TypeScript equivalent of your Python code using NestJS and FastAPI frameworks with standard models/utils as well (you may need to adjust it according to actual project structure):
```typescript
import { Controller, Get, Redirect, Req, Res } from '@nestjs/common';
import { Request, Response } from "express";  // Assuming you're using Express.JS for backend code in Node.Js environment  
// and FastAPI or Nest framework as your back-end technology stack (Node.jS / Python)   
from fastapi import APIRouter;    
import { get_db } from 'app/database';  // Assuming you're using SQLAlchemy ORM for database operations  
// and FastAPI or Nest framework as your back-end technology stack (Node.jS / Python)   
from app import models, requireBusinessWrite;    
import { verifySession } from 'app/deps';  // Assuming you're using fastapi dependency injection for session verification  
// and FastAPI or Nest framework as your back-end technology stack (Node.jS / Python)   
from app.templating import render;    
import { _syncGroupNodes } from './service/deviceGroups';  // Assuming you're using a service for syncing group nodes  
// and FastAPI or Nest framework as your back-end technology stack (Node.jS / Python)   
@Controller('customerDeviceGroups')    
export class CustomerDeviceGroup {     
 @Get()      
 async node_groups(@Req() request: Request,  // Assuming you're using Express for backend code in NodeJS environment  
                   @Res() res: Response):       
 const rows = await getDb().then(db => db.select(models.CustomerDeviceGroup).orderBy('name').execute());      
 render({ title:'Grupy komputerów' }, 'customer_device_groups/list', { groups :rows}, request, res);     // Assuming you have a templating service for rendering HTML  
 @Get('/add')     
 redirectToAdd(@Req() req: Request):      
 return new RedirectResponse(`${req.baseUrl}/customerDeviceGroups/new`)  ;   
 ``` This is just an example and may need adjustments according to your project structure, actual database schema etc.. Please make sure you have the necessary dependencies installed in NestJS for this code snippet not work without them as it's a part of larger application. Also note that FastAPI or Nodejs framework does support dependency injection (DI) and session verification using fastapi/dependency-injection package, so I used those to simplify your task here but you may need adjust the rest according to actual project structure in NestJS environment