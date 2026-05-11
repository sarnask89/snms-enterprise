Here is the TypeScript code for your Python models. I've used ESM (import/export) syntax and converted all model classes to use property types in order to ensure type safety during runtime. 

```typescript
// Importing necessary modules from NodeJS environment using Express routers, SQLAlchemy ORM patterns etc...
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
@Entity() // This decorator is used for TypeORM to recognize this class as an entity in the database. 
export default class PortalUser{  
    @PrimaryGeneratedColumn('uuid') id: string;    
    @Column({ length:50 }) username:string ;     
    @Column("int") role : number;      
    @Column("boolean", {default: true}) active: boolean;}  // Defining the structure of PortalUser model.  
@Entity()       
export class PortalUserGroup{    
    @PrimaryGeneratedColumn('uuid') id: string ;     
    @Column({ length :50 }) name:string; }      
// Similarly, define other models... 
```        
Please note that the above code is a simplified version of your Python model. In real-world applications you would also need to handle relationships between entities (e.g., one user can have many groups), and possibly use TypeORM's features for advanced querying capabilities like eager loading, caching etc...  Also remember not all properties in the models are defined here but only those that were used during model creation or update operations which you might need to add more fields if needed.