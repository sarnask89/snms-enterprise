Here is the TypeScript version of your Python code. I've assumed that you are using NestJS for Node.js and SQLite as a database, but it can be adapted to other databases if needed (like PostgreSQL or MySQL). 

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
// Assuming the LocationState is defined in another file here. You may need imports for that as well based on your project structure and setup of TypeORM entities/models etc... 
@Entity('location_states') // This assumes you have a location state entity, adjust accordingly if not using SQLite or similar database system like PostgreSQL / MySQL with NestJS ORM.  
export class LocationState {
    @PrimaryGeneratedColumn() id: number;
    
    @Column({ length: 128 }) name: string; // Assuming the column names are correct, adjust as needed if not using SQLite or similar database system like PostgreSQL / MySQL with NestJS ORM.  
     
    @Column({ nullable: true , unique :true}) teryt_code: string | null ; 
    
    @Column() isActive: boolean; // Assuming the column names are correct, adjust as needed if not using SQLite or similar database system like PostgreSQL / MySQL with NestJS ORM.  
     
}
// Similarly define LocationDistrict and other entities... assuming they have same structure 
```
Please note that TypeORM is a tool for working with TypeScript/JavaScript in Nodejs, which means you can use it to interact directly with your database using the classes defined above (LocationState etc). You would need setup of NestJS ORM and also make sure all necessary imports are done. 
Also note that this code assumes a basic structure for each entity as per provided Python script's data types, you may have different requirements or additional columns in your models so adjust accordingly if needed (like foreign keys etc). Also please replace the 'LocationState', and other entities with actual location state classes from where they are defined.