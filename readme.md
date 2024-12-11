# Express Dynamic REST API & Swagger doc

This project is a Node.js application built with Express.js that dynamically generates Swagger documentation based on database models or predefined schemas. It includes features like session management, MSSQL integration, auto-generating models from database tables, and dynamic CRUD API creation.

## Features

- **Dynamic Swagger Documentation**: Automatically generates API docs for all models and endpoints.
- **CRUD API Endpoints**: Supports Create, Read, Update, and Delete operations.
- **Auto-Generate Models**: Extracts table schemas from the database to define models dynamically.
- **Session Management**: Handles JWT-based authentication and stores tokens in an MSSQL database.
- **MSSQL Integration**: Connects to an MSSQL database to read schema information and generate API endpoints.
- **Modular Structure**: Well-organized codebase for scalability and maintenance.

## Requirements

- Node.js (>=14.x)
- MSSQL Server
- Git
## Package used
```bash
    "bcryptjs": "^2.4.3",
    "body-parser": "^1.20.3",
    "express": "^4.21.2",
    "jsonwebtoken": "^9.0.2",
    "mssql": "^11.0.1",
    "sequelize": "^6.37.5",
    "sequelize-auto": "^0.8.8",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.1",
    "tedious": "^18.6.1"
```

## Installation

1. Clone the repository:
   ```bash
   https://github.com/mldmix/express-dynamic-REST-API-and-swagger.git
   cd express-dynamic-REST-API-and-swagger


## Usage
Install dependencies:
```bash
npm install
```
# Customization
## Firstly you must create models files from MSSQL database by executing this command
### NOTE:
In this project we use MSSQL database, you must install **tedious** package globally before: 
```bash
npm install -g tedious
```

### Generate models from MSSQL database

```bash
sequelize-auto -o "./models" -d database_name -h host -u username -p port -x password -e dialect

-o: Output directory for the generated models.
-d: Database name.
-h: Database host.
-u: Database username.
-p: Port (e.g., 3306 for MySQL, 5432 for PostgreSQL).
-x: Password.
-e: Database dialect (e.g., mysql, postgres, sqlite).

This command generates Sequelize model files for all tables in the database.
```
```bash
./config/db.js                   # Add connection configuration to Database
./Models/index.js & ./app.js     # Add relationships with tables if exist (after the comment /*PUT YOUR RELATIONSHIPS TABLES*/)
```
### Add tabe User & Sessions
```sql
CREATE TABLE Users (
    id INT PRIMARY KEY,
    username NVARCHAR(50),
    email NVARCHAR(255)
);

CREATE TABLE Sessions (
    id INT IDENTITY PRIMARY KEY,
    userId INT NOT NULL,
    token NVARCHAR(MAX) NOT NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    expiresAt DATETIME
);
```

## Generate Models and Endpoints from Database
This project supports automatically generating models and CRUD endpoints based on the schema of your MSSQL database tables.

- Run the model generation script: The application dynamically reads table names and their columns from the database and creates corresponding models.

- Generated endpoints: Each table gets its own CRUD API endpoints:

```bash
GET /<table>: Fetch all records from the table.
GET /<table>/:id: Fetch a single record by ID.
POST /<table>: Create a new record in the table.
PUT /<table>/:id: Update an existing record by ID.
DELETE /<table>/:id: Delete a record by ID.
```
- Example: If your database has a table named Users, the following endpoints will be automatically available:

```bash
GET /users
GET /users/:id
POST /users
PUT /users/:id
DELETE /users/:id
```
## Project Structure
```bash
.
├── routes/                 # API route handlers
├── utils/                  # Helper utilities
├── config/                 # Database and other configuration files
├── app.js                  # Main application entry point
├── swagger.js              # Swagger configuration
├── README.md               # Project documentation
└── package.json            # Project dependencies
```

## License

[MIT](https://choosealicense.com/licenses/mit/)