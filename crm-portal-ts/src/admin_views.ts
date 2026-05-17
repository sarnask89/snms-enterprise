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