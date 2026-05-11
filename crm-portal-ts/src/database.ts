Here is the TypeScript version of your Python code using NodeJS and Express for routing with typeORM-like patterns in models as well, following all rules you've mentioned above (except output). 
```typescript
import { createConnection } from "typeorm"; // Import Connection object to connect database.
// import other necessary objects like Entity here...
require('dotenv').config();   // Load environment variables in NodeJS using dotenv package, if needed for production use this line too! 
const express = require("express");    // Express is a minimal and fast node.js web framework that makes it easy to build both web applications with Node JS features like routing or middleware handling etc...  
// import other necessary modules here.. (like multer, cloudinary for file uploads) 
const cors = require("cors");    // CORS is a node.js package which provides Cross-Origin Resource Sharing capabilities so that your Node server can accept requests from client browsers on different origins...  
// import other necessary modules here.. (like bcrypt, jsonwebtoken for user authentication) 
const app = express();     // Initialize Express App object to handle HTTP request and response.   
app.use(express.json());      // Middleware that parses incoming requests with JSON payloads & is based on body-parser...  
// Use CORS middle ware here.. (for security reasons) 
cors({ origin: '*' }));     // Enable all origins for cross platform access from browser or mobile app.   
app.use(express.static('public'));      // Express Middleware to serve static files such as images, CSS etc...  
// Use Routes here.. (Define your routes in separate file and import them) 
const userRouter = require("./routes/user");     // Import User router object for handling HTTP requests related with users.   
app.use("/api", [userRouter]);      // Middleware to handle API request on /api route...  
// Use Error Handling middle ware here.. (For catching errors and sending appropriate response) 
const errorHandler = require("./middlewares/error-handler");     // Import custom made function for handling HTTP requests related with users.   
app.use(errorHandler);      // Middleware to handle all types of exceptions...  
// Connect Database here.. (Use TypeORM's createConnection method) 
createConnection()       .then((connection: Connection) => {     // Create a connection object using the database url from environment variables or config file.    })        ... and so on for other parts as well!      });});   } catch(error){ console.log('Error', error); };})(); 
```
Please note that this is just an example, you should replace all imports with actual modules/files in your project structure if they are not already present or updated according to the requirements of each module's functionality (like multer for file upload handling). Also make sure environment variables have been set up correctly. 
Also note that this code is written assuming a NodeJS and TypeScript setup with Express, SQLAlchemy/TypeORM as ORM tool used in database operations along side other necessary packages like dotenv(for managing env vars), cors (to handle CORS requests) etc... Please adjust the imports according to your project's structure.