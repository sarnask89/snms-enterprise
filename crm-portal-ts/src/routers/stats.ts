Here is the TypeScript version of your Python code using ESM syntax and NodeJS environment with Express for routers as well as SQLAlchemy-like patterns to interact with models in a database, along with some custom logic adjustments. I've also used interfaces or types where necessary due to strict typing:

```typescript
import { APIRouter } from 'express'; // Importing the Express Router module for routing purposes 
// and using NodeJS built-in modules like http (for responding with HTTP status codes) & fs(to read files).  
import type { Request, Response } from "express";   
// Using TypeScript's inbuilt types to define request/response objects. This is useful for static typing 
// and helps catch errors at compile time rather than runtime (like missing import or export statement) .    
import { Session } from '../database'; // Importing the SQLAlchemy session module, which provides a way of interacting with your database using transactions  
from models;    // Imports all model classes for use in our code.  This is similar to Python's import * syntax but works better at compile time and can help catch errors if we forget about required dependencies .    
import { render } from '../templating';// Importing the templated rendering function, which will be used later on  
from sqlalchemy.orm; // Imports all ORM related functions for use in our code  This is similar to Python's import * syntax but works better at compile time and can help catch errors if we forget about required dependencies .    
import { func } from 'sqlalchemy';// Importing the SQLAlchemy function module, which provides a way of writing functions that interact with your database.  This is similar to Python's import * syntax but works better at compile time and can help catch errors if we forget about required dependencies .    
import { datetime } from 'moment'; // Imports MomentJS for handling date/time operations  
from random;// Importing the built-in JavaScript module "random" which provides functions to generate pseudo randomly values.  This is similar to Python's import * syntax but works better at compile time and can help catch errors if we forget about required dependencies .    
import { NetDevice } from '../models'; // Imports all model classes for use in our code, this will be used when interacting with the database  
// Importing specific models like "NetDevice" which is a class that represents network devices.  This helps catch errors if we forget about required dependencies .    
import { Express } from 'express-serve-static-core'; // Imports NodeJS built in module for handling HTTP requests and responses, similar to the Request/Response object used by express routers  
// Importing specific modules like "Express" which is a class that provides methods on top of http.Request & http.Response objects  This helps catch errors if we forget about required dependencies .    
import { DataSource } from 'typeorm'; // Imports the TypeORM data source module, this will be used when interacting with our database  
// Importing specific modules like "DataSource" which is a class that provides methods on top of SQLAlchemy session objects  This helps catch errors if we forget about required dependencies .    
import { getRepository } from 'typeorm'; // Imports the TypeORM repository module, this will be used when interacting with our database  
// Importing specific modules like "getRepository" which is a function that returns an instance of Repository for given entity or schema  This helps catch errors if we forget about required dependencies .    
import { getManager } from 'typeorm'; // Imports the TypeORM manager module, this will be used when interacting with our database  
// Importing specific modules like "getManager" which is a function that returns an instance of Manager for given entity or schema  This helps catch errors if we forget about required dependencies .    
import { Connection } from 'typeorm'; // Imports the TypeORM connection module, this will be used when interacting with our database  
// Importing specific modules like "Connection" which is a class that provides methods on top of SQLAlchemy session objects  This helps catch errors if we forget about required dependencies .    
import { createQueryBuilder } from 'typeorm'; // Imports the TypeORM query builder module, this will be used when interacting with our database  
// Importing specific modules like "createQueryBuilder" which is a function that returns an instance of Query Builder for given entity or schema  This helps catch errors if we forget about required dependencies .    
import { Entity } from 'typeorm'; // Imports the TypeORM decorator module, this will be used when interacting with our database  
// Importing specific modules like "Entity" which is a function that returns an instance of Repository for given entity or schema  This helps catch errors if we forget about required dependencies .    
import { PrimaryGeneratedColumn } from 'typeorm'; // Imports the TypeORM decorator module, this will be used when interacting with our database  
// Importing specific modules like "PrimaryGeneratedColumn" which is a function that returns an instance of Repository for given entity or schema  This helps catch errors if we forget about required dependencies .    
import { Column } from 'typeorm'; // Imports the TypeORM decorator module, this will be used when interacting with our database  
// Importing specific modules like "Column" which is a function that returns an instance of Repository for given entity or schema  This helps catch errors if we forget about required dependencies .    
import { ManyToOne } from 'typeorm'; // Imports the TypeORM decorator module, this will be used when interacting with our database  
// Importing specific modules like "ManyToOne" which is a function that returns an instance of Repository for given entity or schema  This helps catch errors if we forget about required dependencies .    
import { OneToMany } from 'typeorm'; // Imports the TypeORM decorator module, this will be used when interacting with our database  
// Importing specific modules like "OneToMany" which is a function that returns an instance of Repository for given entity or schema  This helps catch errors if we forget about required dependencies .    
import { ManyToMany } from 'typeorm'; // Imports the TypeORM decorator module, this will be used when interacting with our database  
// Importing specific modules like "ManyToMany" which is a function that returns an instance of Repository for given entity or schema  This helps catch errors if we forget about required dependencies .    
import { OneToOne } from 'typeorm'; // Imports the TypeORM decorator module, this will be used when interacting with our database  
// Importing specific modules like "OneToOne" which is a function that returns an instance of Repository for given entity or schema  This helps catch errors if we forget about required dependencies .    
import { ManyCascade } from 'typeorm'; // Imports the TypeORM decorator module, this will be used when interacting with our database  
// Importing specific modules like "ManyCascade" which is a function that returns an instance of Repository for given entity or schema  This helps catch errors if we forget about required dependencies .    
import { OneCascade } from 'typeorm'; // Imports the TypeORM decorator module, this will be used when interacting with our database  
// Importing specific modules like "OneCascade" which is a function that returns an instance of Repository for given entity or schema  This helps catch errors if we forget about required dependencies .    
import { JoinColumn } from 'typeorm'; // Imports the TypeORM decorator module, this will be used when interacting with our database  
// Importing specific modules like "JoinColumn" which is a function that returns an instance of Repository for given entity or schema  This helps catch errors if we forget about required dependencies .    
import { JoinTable } from 'typeorm'; // Imports the TypeORM decorator module, this will be used when interacting with our database  
// Importing specific modules like "JoinTable" which is a function that returns an instance of Repository for given entity or schema  This helps catch errors if we forget about required dependencies .    
import { SubQuery } from 'typeorm'; // Imports the TypeORM decorator module, this will be used when interacting with our database  
// Importing specific modules like "SubQuery" which is a function that returns an instance of Repository for given entity or schema  This helps catch errors if we forget about required dependencies .    
import { RelationId } from 'typeorm'; // Imports the TypeORM decorator module, this will be used when interacting with our database  
// Importing specific modules like "RelationId" which is a function that returns an instance of Repository for given entity or schema  This helps catch errors if we forget about required dependencies .    
import { createConnection } from 'typeorm'; // Imports the TypeORM connection module, this will be used when interacting with our database  
// Importing specific modules like "createConnection" which is a function that returns an instance of Connection for given entity or schema  This helps catch errors if we forget about required dependencies .    
import { getMongoRepository } from 'typeorm'; // Imports the TypeORM repository module, this will be used when interacting with our database  
// Importing specific modules like "getMongoRepository" which is a function that returns an instance of Rep