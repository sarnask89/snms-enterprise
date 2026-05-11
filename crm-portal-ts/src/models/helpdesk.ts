Here is the TypeScript version of your Python code. I've assumed that you have already set up a connection to an SQL database using `TypeORM` and also imported necessary models for this example (you may need additional setup based on actual project structure). 
```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { TicketStatus } from './common'; // assuming you have a common module with enums and classes. You might want to adjust this import statement according your setup.
// Assuming the models are in separate files for better organization of code 
@Entity('helpdesk_queues')  
export class HelpdeskQueue {   
 @PrimaryGeneratedColumn()     id: number;     
 @Column({ length:64, unique: true }) name: string ;      
 @Column("text",{nullable:true}) description :string | null;  // Assuming the common module has a definition for this.  
 @Column('int', {default:0}) sort_order: number   
 categories: HelpdeskCategory[];     tickets: SupportTicket[]     
}      
@Entity('helpdesk_categories')       
export class HelpdeskCategory{  // Assuming the common module has a definition for this.  
 @PrimaryGeneratedColumn() id :number;   
 @ManyToOne(type => HelpdeskQueue, queue=>queue.id)     queue:HelpdeskQueue ;     
 @Column('varchar', {length:64}) name  :string;      
 @Column("text",{nullable:true}) description : string | null    // Assuming the common module has a definition for this  
 tickets: SupportTicket[];     queue_id: number ;      }       
@Entity('support_tickets')        
export class SupportTicket {  @PrimaryGeneratedColumn() id:number;      
 @ManyToOne(type => HelpdeskQueue,queue=>queue.id)    queue_ref :HelpdeskQueue   // Assuming the common module has a definition for this    
 @ManyToOne(type =>  Customer , customer=>  customer .id )  customer_:Customer ;     
 @Column('varchar', {length:255}) title :string;      
 @Column("text") body : string    status:@Column({enum:TicketStatus, default:'open' })   // Assuming the common module has a definition for this.     created_at and updated at are handled by TypeORM automatically  .      }       
```        
Please note that you need to adjust import statements according your project setup (like `common` model in case of using an external library). Also, I've assumed some types based on common knowledge about the models. You may want to adapt this code as per actual requirements and structure of entities/models used by yours application.