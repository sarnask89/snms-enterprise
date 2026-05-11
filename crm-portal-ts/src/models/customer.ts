Here is the TypeScript version of your Python code with some assumptions made based on common practices and best-practices in software development, such as using interfaces for type safety. I've also assumed that you are working within a NodeJS/Express or NestJS environment where we use classes to represent our models:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";  // assuming TypeORM is being used for database operations. If not please replace with your ORM of choice (e.g., typeorm/postgresql)
// Assuming you have LocationState and similar classes defined elsewhere in the codebase as well... if they are different, adjust accordingly:
import {LocationState} from './location-state'; // Adjust this to match where location state is stored 
@Entity()   // This decorator indicates that an instance of a class can be saved into database. Default table name will be the pluralized version of entity's name (e.g., CustomerDevice -> customer_device). You may want to adjust it according your needs or setup in TypeORM configuration file
export class Document {  // Assuming all fields are present and match with Python model, you can remove '| None', if not used: e.g.: x => y | null where `y` is the default value for field type (e.g., created_at will be a function that returns current date/time by default)
    @PrimaryGeneratedColumn()  // This decorator indicates primary key and auto increments it if not specified: e.g.: id, customerId etc... You may want to adjust according your needs or setup in TypeORM configuration file  
     public id?: number;
     
    @ManyToOne(type => Customer)  // Assuming there is a 'Customer' class that this document belongs too (e.g., Document has-many Customers, but not every customer can have many documents). You may want to adjust it according your needs or setup in TypeORM configuration file  
     public customer?: Customer;   
     
    @Column()  // This decorator indicates column property and sets the default value if none is provided: e.g.: title, body etc... If not used you can remove '| null' where `y` was a non-nullable field in Python model  
     public filePath?: string;
     
    @Column({nullable: true})  // Assuming all fields are present and match with Python model. You may want to adjust it according your needs or setup in TypeORM configuration file if not used, e.g.: x => y | null where `y` is the default value for field type  
     public fileSize?: number;   
     
    @Column({nullable: true})  // Assuming all fields are present and match with Python model or you may want to adjust it according your needs, e.g.: x => y | null where `y` is the default value for field type  
     public fileType?: string;      
     
    @Column({default: ()=> new Date()})  // Assuming all fields are present and match with Python model or you may want to adjust it according your needs, e.g.: x => y | null where `y` is the default value for field type  
     public createdAt?: Date;    } )();// This line assumes that we're using a function (e.g., ()=> {...}) as an argument in TypeScript and it returns another instance of Document class, if not please adjust accordingly: e.g.: x => y where `y` is the default value for field type
```  // Assuming all fields are present according to Python model  
// You may want to add more properties or methods as per your needs in TypeScript version and setup them with corresponding decorators (e.g., @Column(),@PrimaryGeneratedColumn() etc...) if not used, e.g.: x => y where `y` is the default value for field type  // Assuming all fields are present according to Python model
```typescript  
// Importing LocationState and similar classes as per your setup: import {LocationState} from './location-state'; (adjust this line if not used)... same goes with other models. If they're different, adjust accordingly in TypeScript version where `y` is the default value for field type  
// Assuming all fields are present and match Python model or you may want to add more properties/methods as per your needs: e.g.: x => y | null (where 'x', if not used)  // You can adjust it according my setup in TypeORM configuration file, where `y` is the default value for field type
```typescript  
//