It seems like you've posted a large amount of code, but I can only provide the snippet that contains your `app` object definition and function definitions for routes related to users. 
```python
from fastapi import FastAPI, Depends, Form, Request
from sqlalchemy.orm import Session
import models as db_models # assuming you have a 'db' module with the database model classes (PortalUser etc.) defined there too...
# ... and so on for other modules/classes in your application 
app = FastAPI()  
def get_db():    return db.SessionLocal()    
@app.get("/")      def read_root(request: Request):        request.state.portal_user         # assuming you have a way to retrieve the current user from fastapi's state (Request) object... 
# ... and so on for other routes in your application  
```   
Please provide more details if this is not what you were referring too, as I can only see that part of it. If there are specific parts or functions related to users management within the FastAPI app above please let me know which ones should be included here and why they're relevant for your application context in general terms (e.g., how these routes relate to user data).