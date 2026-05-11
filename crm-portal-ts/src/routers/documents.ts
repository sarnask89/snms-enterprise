Here is the TypeScript equivalent of your Python code using NestJS and FastAPI for backend services, with standard models/utils in place as well (assuming you have a similar setup). I've left out some parts like database connection settings or dependencies injection because they are not present in this translation. 
```typescript
import { Controller, Get, Post } from '@nestjs/common';
// import necessary FastAPI and NestJS types here...

interface DocumentModel {} // Assuming you have a similar model structure for documents with fields like id, title etc..

const documentList = async (request: Request) => { 
    const rows  = await db.query(select().from(Document));  
     return renderHTMLResponse('documents/list', request); // Assuming you have a similar function to handle HTML responses...;
}
// Similar functions for new document, download and delete operations are also written here.. 
```   
Please note that the above code is just an example. You need to replace `db` with your actual database connection instance (like in FastAPI's Depends on NestJS), implement similar functionality as per requirement using appropriate methods from '@nestjs/common', and handle errors appropriately for a production-ready application, like returning HTTP status codes or throwing exceptions instead of just logging.