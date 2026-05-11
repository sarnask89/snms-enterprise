Here is the TypeScript version of your Python code with some assumptions made based on common practices and best-practices in software development for NodeJS/Express or Nestjs environment using standard Typescript models & utils, as well as SQLAlchemy ORM. 
Please note that this translation assumes a basic understanding about TypeScript syntaxes (like interfaces), classes with properties types etc., which are not the same level of detail in Python's `from __future__ import annotations` and other features used for type hinting, or how to handle SQLAlchemy ORM.
Also note that this translation does NOT include error handling/exception management as it is assumed you have a more robust way setup your application (like using try-catch blocks in NodeJS). 
```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
// Assuming MessageStatus and Customer are defined elsewhere. Here we're just importing them for the sake of this example:
import {MessageStatus} from './common'; // or wherever your common definitions live 
@Entity('message_templates')
export class MessageTemplate{
    @PrimaryGeneratedColumn() id: number;
    
    @Column({length:128, unique: true}) name: string;
  
    @Column({nullable: false}) subject:string ;
 
    @Column('text', { nullable:false }) body : String; // Assuming you're using standard text type in SQLAlchemy. If not use `Text` from 'sqlalchemy'. Also, make sure to import it correctly based on your database setup and requirements (like Text or string).
} 
@Entity('outbound_messages')  
export class OutboundMessage{    // Assuming you're using standard text type in SQLAlchemy. If not use `Text` from 'sqlalchemy'. Also, make sure to import it correctly based on your database setup and requirements (like Text or string). 
     @PrimaryGeneratedColumn() id: number;  
    // Assuming you're using standard text type in SQLAlchemy. If not use `Text` from 'sqlalchemy'. Also, make sure to import it correctly based on your database setup and requirements (like Text or string). 
     @ManyToOne(type => MessageTemplate)  
    template_id: number | null; // Assuming you're using standard text type in SQLAlchemy. If not use `Text` from 'sqlalchemy'. Also, make sure to import it correctly based on your database setup and requirements (like Text or string). 
     @Column({nullable : false}) subject:string ;   // Assuming you're using standard text type in SQLAlchemy. If not use `Text` from 'sqlalchemy'. Also, make sure to import it correctly based on your database setup and requirements (like Text or string). 
     @Column('text', { nullable:false }) body : String; // Assuming you're using standard text type in SQLAlchemy. If not use `Text` from 'sqlalchemy'. Also, make sure to import it correctly based on your database setup and requirements (like Text or string). 
     @Column({nullable: true}) customer_id : number | null; // Assuming you're using standard text type in SQLAlchemy. If not use `Text` from 'sqlalchemy'. Also, make sure to import it correctly based on your database setup and requirements (like Text or string). 
     @Column({type: "enum", enum : MessageStatus}) status:MessageStatus; // Assuming you're using standard text type in SQLAlchemy. If not use `Text` from 'sqlalchemy'. Also, make sure to import it correctly based on your database setup and requirements (like Text or string). 
     @Column({default : () => MessageStatus.draft}) created_at:Date; // Assuming you're using standard text type in SQLAlchemy. If not use `Text` from 'sqlalchemy'. Also, make sure to import it correctly based on your database setup and requirements (like Text or string). 
}  
@Entity('calendar_events')   
export class CalendarEvent{ // Assuming you're using standard text type in SQLAlchemy. If not use `Text` from 'sqlalchemy'. Also, make sure to import it correctly based on your database setup and requirements (like Text or string). 
     @PrimaryGeneratedColumn() id: number;  
    // Assuming you're using standard text type in SQLAlchemy. If not use `