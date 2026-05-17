import os from "os";
import path from "path";
import * as log from "winston"; // Importing logger using winston library. You can use any other logging module if you prefer, but this is the most common one for NodeJS applications in production environments. 

const BASE_DIR = path.resolve(__dirname).parent;
// Detect Environment similar to Python code above with os and env variables replaced by TypeScript's built-in ones (os: OS module of node, process environment variable)
let ENV  = "development"; // default value is set as 'dev'. You can change it based on your needs. 
const IS_PROD = false;// Set to true when in production mode similar functionality provided by Python's os and env variables above with same logic applied here, but replaced using TypeScript built-in ones (os: boolean).  
try { // Similar try/catch block as used for python code. 
    import('./.env'); // Importing .dotenv file if exists similar functionality provided by Python's dotenv module in above line with same logic applied here, but replaced using TypeScript built-in ones (import()).    
} catch(e) { }