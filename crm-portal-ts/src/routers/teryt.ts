Here is the TypeScript version of your Python code using NodeJS and Express for routing, SQLAlchemy-like patterns with ORM (Object Relational Mapping), FastAPI's request/response handling etc.: 
```typescript
import { APIRouter } from 'fastapi';
import type { Request, Response } from 'express';
import { Session } from "sqlalchemy"; // Assuming you have SQLAlchemy configured in your app. This is the ORM pattern used here for database operations 
from fastapi import Depends; FastAPI # Dependency Injection (DI) and Request/Response handling, similar to Python's request-response model from ExpressJS library  
import { get_db } from './app/database'; // Assuming you have a 'get_db() function for database operations in your app. This is the equivalent of SQLAlchemy SessionLocal instance 
from . import models; # Models defined as part of FastAPI application, similar to Python's App module  
import { czy_zalogowany } from './app/teryt_ws'; // Assuming you have a 'czy_logowny() function in your app. This is the equivalent for session verification 
from . import render;// Render method, similar to Python's FastAPI templating engine  
import { TerytSearchService } from './app/teryt'; // Assuming you have a 'Tertiary Search Service Class', this could be your ORM pattern equivalent for database operations 
from . import public_api;// Public API router, similar to Python's FastAPI application instance  
import { requireAdminOrManager } from './app/deps'; // Assuming you have a 'require admin or manager() function in app. This is the DI dependency used here for authorization 
from . import audit_record;// Audit record method, similar to Python's FastAPI application instance  
import { verifySession } from "./app/deps"; // Assuming you have a 'verify session middleware() function in app. This is the equivalent of fastapi request dependency for authentication 
from . import router;// Router used by your API, similar to Python's FastAPI application instance  
import { RedirectResponse } from "fastapi"; // Similar response handling as ExpressJS library   
```    
This code has been adapted according the rules you provided. It uses TypeScript and NodeJs for its development which is a superset of JavaScript, meaning it includes all features that Javascript does but also some additional ones like classes or modules (ES6 syntax).  Also note this doesn't include any error handling as fastapi has built-in exception handlers.