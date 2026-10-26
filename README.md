# WorkFlow API

A RESTful backend API for managing projects and tasks, built with Node.js, Express, TypeScript, and PostgreSQL. It provides secure authentication, project management, task tracking, and filtering capabilities.

## Features

* **User Authentication:** Register and log in securely.
* **Password Security:** Hash passwords using bcrypt.
* **JWT Authentication:** Protect private API endpoints with JSON Web Tokens.
* **Project Management:** Create, retrieve, update, and delete projects.
* **Task Management:** Create, retrieve, update, and delete tasks.
* **Task Filtering:** Filter tasks by status and priority.
* **Input Validation:** Validate request data using Zod.
* **Database Integration:** Store data in PostgreSQL using parameterized queries.
* **Layered Architecture:** Separate routes, controllers, services, repositories, and validators.
* **Automated Testing:** Test API behavior using Vitest and Supertest.

## Technology Stack

* Node.js
* TypeScript
* Express
* PostgreSQL
* JSON Web Tokens (JWT)
* bcrypt
* Zod
* Vitest
* Supertest

## Prerequisites

Install the following:

* Node.js and npm
* PostgreSQL
* Git

## Getting Started

### 1. Clone the repository

```bash
git clone <https://github.com/harshithaSG07/workflow-api.git>
cd workflow-api
```


### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/workflow_db
JWT_SECRET=replace_with_a_long_random_secret
```

Replace `YOUR_PASSWORD` with your PostgreSQL password and set a strong, unique JWT secret.

**Never commit your `.env` file to GitHub.**

### 4. Create the database

Create a PostgreSQL database named `workflow_db`.

Run the SQL migration in:

`migrations/001_create_tables.sql`

This creates the users, projects, and tasks tables, including their relationships and constraints.

### 5. Run the application

Start the development server:

```bash
npm run dev
```

The API runs at:

`http://localhost:3000`

### 6. Build the project

```bash
npm run build
```

### 7. Run automated tests

```bash
npm test
```

## API Endpoints

All endpoints use the base URL:

`http://localhost:3000`

### Health Checks

| Method | Endpoint     | Description                 |
| ------ | ------------ | --------------------------- |
| GET    | `/`          | Check API availability      |
| GET    | `/health/db` | Check database connectivity |

### Authentication

| Method | Endpoint             | Description                 |
| ------ | -------------------- | --------------------------- |
| POST   | `/api/auth/register` | Register a new user         |
| POST   | `/api/auth/login`    | Log in and receive a JWT    |
| GET    | `/api/auth/me`       | Verify authenticated access |

### Projects

All project endpoints require a valid JWT.

| Method | Endpoint            | Description        |
| ------ | ------------------- | ------------------ |
| POST   | `/api/projects`     | Create a project   |
| GET    | `/api/projects`     | List your projects |
| GET    | `/api/projects/:id` | Retrieve a project |
| PUT    | `/api/projects/:id` | Update a project   |
| DELETE | `/api/projects/:id` | Delete a project   |

### Tasks

All task endpoints require a valid JWT.

| Method | Endpoint                         | Description             |
| ------ | -------------------------------- | ----------------------- |
| POST   | `/api/projects/:projectId/tasks` | Create a task           |
| GET    | `/api/projects/:projectId/tasks` | List tasks in a project |
| GET    | `/api/tasks/:id`                 | Retrieve a task         |
| PUT    | `/api/tasks/:id`                 | Update a task           |
| DELETE | `/api/tasks/:id`                 | Delete a task           |

### Task Statuses

* `pending`
* `in_progress`
* `completed`

### Task Priorities

* `low`
* `medium`
* `high`

### Filtering Tasks

Filter tasks by status:

```http
GET /api/projects/1/tasks?status=pending
```

Filter tasks by priority:

```http
GET /api/projects/1/tasks?priority=high
```

Combine both filters:

```http
GET /api/projects/1/tasks?status=pending&priority=high
```

For protected endpoints, send the token in the request header:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Project Structure

```text
src/
├── config/        # Database configuration
├── controllers/   # Request and response handling
├── middleware/    # Authentication middleware
├── repositories/  # Database queries
├── routes/        # API route definitions
├── services/      # Application logic
├── validators/    # Input validation schemas
├── tests/         # Automated tests
├── app.ts         # Express application
└── server.ts      # Server startup

migrations/        # Database schema
```

## Security

* Passwords are hashed before storage.
* JWT authentication protects private endpoints.
* Parameterized SQL queries help prevent SQL injection.
* Zod validates incoming request data.
* Project and task queries enforce ownership checks.
* Environment variables are used for database credentials and JWT secrets.

## Future Enhancements

* API documentation with Swagger/OpenAPI
* Pagination and sorting
* Team collaboration and task assignments
* Continuous integration for automated tests
* Cloud deployment

## Author

Developed as a backend portfolio project to demonstrate REST API development, authentication, database integration, input validation, and automated testing.
