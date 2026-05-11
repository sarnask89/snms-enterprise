Here is the TypeScript version of your Python code using NestJS framework and FastAPI for backend API development with NodeJs/Express, you can use similar principles to translate this into a type-safe environment in JavaScript. 
Please note that I have assumed some parts based on common practices such as database operations (using Prisma), dependency injection(dependencies=[Depends()] and using FastAPI's Form data for request body parsing) etc., but the actual implementation may vary depending upon your project setup:
```typescript
import { Controller, Get, Post } from '@nestjs/common';  // Import NestJS decorators here. You can use fastify or any other framework you prefer to handle HTTP requests and responses in NodeJs environment with FastAPI for backend API development using Python code above as a reference point only
import { requireAdminGuard, SessionLocal } from 'app/middleware';  // Assuming the existence of these middlewares. You may need more or different implementation based on your project setup and requirements  
@Controller('admin/builder')    // NestJS decorator for setting up a controller level route prefix in this case '/admin/builder' (you can use other paths as per requirement) 
export class AdminBuilderController {    
 @Get()     
 async builderIndex(request: Request): Promise<HTMLResponse>{   }    // Assuming the existence of HTML response and request object from 'fastapi'. You may need more or different implementation based on your project setup. This method will handle GET requests to '/admin/builder' route 
 @Post('/generate')     
 async builderGenerate(request: Request,@Body() data): Promise<JSONResponse>{   }    // Assuming the existence of JSON response and request object from 'fastapi'. You may need more or different implementation based on your project setup. This method will handle POST requests to '/admin/builder' route with body parameters
 @Post('/register-nav')     
 async builderRegisterNav(@Form() label: string,@Form() url): Promise<JSONResponse>{   }    // Assuming the existence of JSON response and form data from 'fastapi'. You may need more or different implementation based on your project setup. This method will handle POST requests to '/admin/builder' route with Form Data parameters
} 
```    
Please note that this is a very basic translation, you might have some parts missing depending upon the actual requirements of your application and how FastAPI handles HTTP in NodeJs environment for backend API development using Python code above. Also remember NestJS uses decorators to handle routes (GET/POST), while fastapi does not use them but provides similar functionalities through different methods like @Get,@Post etc., you can replace these with the equivalent ones as per your project setup and requirements