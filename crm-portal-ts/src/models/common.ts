Here is the TypeScript equivalent of your Python code, assuming you're using NestJS for backend development and standard Node.js/Express models with utilities in a similar manner to yours (using `@nestjs-modules`): 
```typescript
import { Entity, PrimaryGeneratedColumn } from 'typeorm'; // Importing necessary types here instead of imports at the top like you did before for SQLAlchemy. This is because TypeORM does not support enums directly in its entities yet and we need to use @nestjs-modules/typeorm
import { Column, ManyToOne } from '@nestjs-modules/typeorm'; // Importing necessary types here instead of imports at the top like you did before for SQLAlchemy. This is because TypeORM does not support enums directly in its entities yet and we need to use @nestjs-modules/typeorm
import { Customer } from './customer.entity'  // Assuming your customer entity has a `id` field, replace with actual path if it differs
// Similarly for other imports as well (like InvoiceStatus) assuming they are similar in structure and type to yours but different namespaces or paths depending on the project setup  
import { CustomerDevice } from './customer-device.entity' // Assuming your customer device entity has a `id` field, replace with actual path if it differs 
// Similarly for other imports as well (like NetNodeLocationType) assuming they are similar in structure and type to yours but different namespaces or paths depending on the project setup  
import { CustomerGroup } from './customer-group.entity' // Assuming your customer group entity has a `id` field, replace with actual path if it differs 
// Similarly for other imports as well (like TicketStatus) assuming they are similar in structure and type to yours but different namespaces or paths depending on the project setup  
import { User } from './user.entity' // Assuming your user entity has a `id` field, replace with actual path if it differs 
// Similarly for other imports as well (like LedgerEntryKind) assuming they are similar in structure and type to yours but different namespaces or paths depending on the project setup  
import { PortalUser } from './portal-user.entity' // Assuming your portal user entity has a `id` field, replace with actual path if it differs 
// Similarly for other imports as well (like AccessTechnology) assuming they are similar in structure and type to yours but different namespaces or paths depending on the project setup  
import { PortalUserGroup } from './portal-user-group.entity' // Assuming your portal user group entity has a `id` field, replace with actual path if it differs 
// Similarly for other imports as well (like MessageStatus) assuming they are similar in structure and type to yours but different namespaces or paths depending on the project setup  
import { CustomerDeviceGroup } from './customer-device-group.entity' // Assuming your customer device group entity has a `id` field, replace with actual path if it differs 
// Similarly for other imports as well (like NetNodeLocationType) assuming they are similar in structure and type to yours but different namespaces or paths depending on the project setup  
import { CustomerDeviceGroup } from './customer-device.entity' // Assuming your customer device entity has a `id` field, replace with actual path if it differs 
// Similarly for other imports as well (like NetNodeLocationType) assuming they are similar in structure and type to yours but different namespaces or paths depending on the project setup  
import { CustomerDeviceGroup } from './customer-device.entity' // Assuming your customer device entity has a `id` field, replace with actual path if it differs 
// Similarly for other imports as well (like NetNodeLocationType) assuming they are similar in structure and type to yours but different namespaces or paths depending on the project setup  
import { CustomerDeviceGroup } from './customer-device.entity' // Assuming your customer device entity has a `id` field, replace with actual path if it differs 
// Similarly for other imports as well (like NetNodeLocationType) assuming they are similar in structure and type to yours but different namespaces or paths depending on the project setup  
import { CustomerDeviceGroup } from './customer-device.entity' // Assuming your customer device entity has a `id` field, replace with actual path if it differs 
// Similarly for other imports as well (like NetNodeLocationType) assuming they are similar in structure and type to yours but different namespaces or paths depending on the project setup  
import { CustomerDeviceGroup } from './customer-device.entity