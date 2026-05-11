It seems like you've posted a large chunk of code here which is not complete or well formatted, but I can provide some context and guidance on how to proceed with it. 

The provided snippet appears to be part of an ASGI (Asynchronous Server-Sent Events) application using FastAPI framework for Python that interacts directly with a database model `NetDevice` in the models module defined earlier, which is used as ORM by SQLAlchemy library and handles CRUD operations.

Here're some steps you can follow: 
1. Ensure all necessary dependencies are installed (like FastAPI itself). If not already done so then install them using pip or conda command in your terminal/command prompt accordingly to the package manager of Python(e.g., `pip3`, for python-3 and etc.). For example if you're working with ASGI app:
```bash 
$ pip3 install fastapi uvicorn sqlalchemy passlib[bcrypt] pydantic starlette.authentication bcrypt
```  
2. Define the models in `models` module as per your database schema (like NetDevice, IpNetwork etc.). You can use SQLAlchemy ORM to interact with a PostgreSQL or MySQL DB using annotations for defining tables and relationships between them if required by you application's requirements else just define simple Python classes.
3. Define the routes in `main` module as per your API endpoints (like /net-devices, POST/PUT etc.). FastAPI uses decorators to map URL paths with handlers which are functions that respond when a client makes requests at those urls and return HTTP responses based on what they request from clients like GET or PUT.
4. Set up the database connection in `main` module using SQLAlchemy ORM (like create_engine, Table etc.). 
5. Implement business logic inside your handlers functions as per requirements of API endpoints you have defined earlier and interact with DB via this model/ORM methods if required by application's needs else just use simple Python code to perform CRUD operations on database using SQLAlchemy ORM or directly in the handler function itself.
6. Finally, run your ASGI app (like `uvicorn main:app --host 0.0.0.0 --port 80`). This will start a server and listen for requests from clients on specified host/ports provided while running this command or you can use any other tool like Postman to test the API endpoints of your application if required by tests case in future, etc..