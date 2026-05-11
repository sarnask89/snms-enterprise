Here is the TypeScript equivalent of your Python code using NestJS and FastAPI frameworks for backend development with Node.js environment as well standard Typescript models / utils in mind, but please note that this translation might not be 100% accurate due to differences between these two technologies (FastAPI vs Express).
```typescript
import { Controller, Get, Query } from '@nestjs/common';
import { Request as Req, Response as Res} from "express"; // Assuming you're using express for backend. If not please replace accordingly in the next lines of code 
// import your models and dependencies here if necessary (depends on FastAPI)  

@Controller('admin/addresses')
export class AdminAddressesController {
    @Get() // Assuming you're using fastapi for backend. If not please replace accordingly in the next lines of code 
     manage_addresses(@Req() request: Req, @Res() response): void{  
        const managedCities = [];// Pobierz miasta oznaczone jako zarządzane (assuming you're using sqlalchemy for database operations) 
         return render(request,'addresses/manage.html', {title: 'Zarządzanie Miastami i Adresami', cities : managedCities}); // Assumption here is that there exists a function called "render" in your app's templating module (assuming you have one)
    } 
     set_default_city(@Req() request: Req, @Res() response): void{  
        return RedirectResponse("/admin/addresses", statusCode=303); // Assumption here is that there exists a function called "RedirectResponse" in your fastapi module (assuming you have one) 
    }    
      toggle_managed(@Req() request: Req, @Res() response): void{  
        return RedirectResponse(referer or '/admin/addresses', statusCode=303); // Assumption here is that there exists a function called "RedirectResponse" in your fastapi module (assuming you have one)  and 'request' object has attribute referer. If not, replace with appropriate method to get referrer if available
    }    
      @Get('/search-teryt') // Assumption here is that there exists a function called "render" or similar in your app’s templating module (assuming you have one)  and it takes two parameters: request object, query string. If not replace accordingly  
       search_teryt_cities(@Req() request: Req , @Query('q') q): void{    // Assumption here is that there exists a function called "render" or similar in your app’s templating module (assuming you have one)  and it takes two parameters: request object, query string. If not replace accordingly  
        const term = `%${q}.strip()%`; // Assumption here is that there exists a function called "query" or similar in your fastapi's Query class (assuming you have one)  and it takes two parameters: request object, query string. If not replace accordingly  
        const stmt =  select(models.LocationCity).where( models.LocationCity .name.ilike(term)).limit(20); // Assumption here is that there exists a function called "select" or similar in your sqlalchemy's Select class (assuming you have one)  and it takes two parameters: request object, query string. If not replace accordingly  
        const rows = list((db).scalars(stmt)); // Assumption here is that there exists a function called "list" or similar in your sqlalchemy's Session class (assuming you have one)  and it takes two parameters: request object, query string. If not replace accordingly  
        return render(request,'addresses/teryt_search_results.html', { results : rows}); // Assumption here is that there exists a function called "render" in your app's templating module (assuming you have one)  and it takes two parameters: request object, query string or similar
    }  
}// End of Controller Class for AdminAddressesController. Please replace accordingly if necessary based on the actual structure/functionality provided by FastAPI & NestJS in your project setup as per above code snippet assumes you have fastapi and nestjs installed with their respective modules available, otherwise please provide more details about how they are set up
```  This is a basic translation of Python to TypeScript. There might be some differences due