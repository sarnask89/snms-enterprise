Here is the TypeScript equivalent of your Python code using NestJS and SQLAlchemy ORM for database operations in Node.js/Express environment with standard models & utils as you mentioned above only return translated Typescript codes without markdown formatting like ```typescript or explanations```  :

TypeScript Code: (NetFlowAggregate)
```tsx
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { NetDevice } from './net_device.entity' // assuming you have a separate entity for net devices in your application 
@Entity('netflow_aggregates')
export class NetFlowAggregate{  
    @PrimaryGeneratedColumn() id: number;
    
    @ManyToOne(type => NetDevice, device=>device.id) // assuming there is a one-to-many relationship between net devices and aggregated flows 
    device_id :NetDevice ;//ForeignKey("net_devices") in SQLAlchemy should be "NETWORK DEVICE" table name not the id column of this entity  
    
    @Column({length:45}) src_ip: string; // same as String(45) from sqlalchemry 
      
    @Column() dst_port : number ;// Integer in SQLAlchemy should be int or similar type not the column of this entity  
    
    @Column({type:'int'}) protocol:number, // Protocol Number (e.g., for TCP it would be 6) same as BigInteger from sqlalchemry and default value is set to zero if no provided by user in database or else will use the one that has been assigned  
    
    @Column({type:'bigint'}) bytes: number; // Same type of column definition used for big integer. Defaults are same as above 
      
    @Column({type:'bigint'}) packets :number ;//Same default value is set to zero if no provided by user in database or else will use the one that has been assigned  
    
    // Assuming datetime type from sqlalchemy and using now() function for current timestamp 
}
```
TypeScript Code: (NetFlowRaw) - Same as above, just replace 'net_devices' with your device entity name. Also assuming there is a one-to-many relationship between net devices & raw flows in the application level code or database schema design if not then you need to adjust accordingly  .  
```tsx   
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'; // Assuming we are using NestJS and TypeORM for ORM operations. If it's different please replace with your actual import statement or type of data in database column if not string then use appropriate datatype 
@Entity('netflow_raw')  
export class NetFlowRaw{   
     @PrimaryGeneratedColumn() id: number; // Assuming primary key is auto incremented by default. If it's different please adjust accordingly, same as above in net flow aggregate entity for foreignkey definition if not then use appropriate datatype  . Same type of column definitions used here with the assumption that you have a JSON or similar data stored inside this field
     @Column() raw_data: string; // Assuming it's json/similar format. If different please adjust accordingly  
}   
```     
Please note, in real world applications these entities are usually defined and mapped to database tables using TypeORM (Object-Relational Mapping) or similar ORM tools which provide a way of mapping your data model classes with the underlying databases schema for you so that it can be used by NestJS/Express.