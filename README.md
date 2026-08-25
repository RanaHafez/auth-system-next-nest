# Auth System

Full-stack authentication system built with **NestJS** (backend) and **Next.js** (frontend), using **PostgreSQL** as the database and **JWT** for authentication.

## Features

- User registration
- User login
- JWT authentication
- Protected Home page
- Authentication persistence across page refreshes
- Logout
- Forgot password
- Reset password
- Protected user profile
- PostgreSQL database integration
- Password hashing
- API error and success handling

## Tech Stack

| Layer    | Technology |
| -------- | ---------- |
| Backend  | NestJS     |
| Frontend | Next.js    |
| Database | PostgreSQL |
| Auth     | JWT        |

## Project Structure

```
auth-system/
├── backend/          # NestJS API
└── frontend/         # Next.js application
```

## Prerequisites

- Node.js (v18 or higher recommended)
- PostgreSQL (running locally)
- npm or yarn

---

## Setup

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd auth-system
```

---

## Backend Setup

### 2. Navigate to the Backend

```bash
cd backend
```

### 3. Install Backend Dependencies

```bash
npm install
```

### 4. Create the PostgreSQL Database

Make sure PostgreSQL is running, then create a database for the application.

**Example:**

| Setting  | Value         |
| -------- | ------------- |
| Database | `auth_system` |
| Host     | `localhost`   |
| Port     | `5432`        |

> You can use any database name, but it **must match** the `DB_NAME` value in the `.env` file.

### 5. Configure Backend Environment Variables

Inside the `backend` folder, create a file named `.env` using `.env.example` as a template:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=YOUR_POSTGRES_USERNAME
DB_PASSWORD=YOUR_POSTGRES_PASSWORD
DB_NAME=YOUR_DATABASE_NAME
JWT_SECRET=YOUR_JWT_SECRET
```

**Example:**

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=auth_system
JWT_SECRET=your_secret_key
```

> **Important:**
>
> - Do **not** use the example values as actual credentials.
> - The `.env` file is intentionally excluded from GitHub.
> - Never commit your `.env` file or real credentials.

### 6. Start the Backend

```bash
npm run start:dev
```

The NestJS backend should now be running at:

```
http://localhost:3001
```

Keep this terminal running.

---

## Frontend Setup

### 7. Open a New Terminal

```bash
cd auth-system
cd frontend
```

### 8. Install Frontend Dependencies

```bash
npm install
```

### 9. Start the Frontend

```bash
npm run dev
```

The Next.js frontend should now be running at:

```
http://localhost:3000
```

---

## Running the Application

You should have **two terminals** running at the same time:

| Terminal | Command                           | URL                   |
| -------- | --------------------------------- | --------------------- |
| 1        | `cd backend && npm run start:dev` | http://localhost:3001 |
| 2        | `cd frontend && npm run dev`      | http://localhost:3000 |

Open the application in your browser:

```
http://localhost:3000
```

---

## Authentication Flow

### Registration

1. The user creates an account using:
   - Name
   - Email
   - Password
2. The backend validates the request and securely hashes the password before storing the user in PostgreSQL.
3. After successful registration, the user is redirected to the Login page.

### Login

1. The user provides their email and password.
2. The backend validates the credentials and returns a JWT access token.
3. The frontend stores the token and uses it when accessing protected resources.

### Protected Home Page

- The Home page is only accessible to authenticated users.
- The frontend checks for an existing access token and requests the authenticated user's profile from:

  ```
  GET /user/profile
  ```

- If the token is invalid or missing, the user is redirected to the Login page.
- Authentication persists across page refreshes while the token is valid.

### Logout

When the user logs out:

- The access token is removed.
- The authentication state is cleared.
- The user is redirected to the Login page.

### Forgot Password

1. The user enters their email address on the Forgot Password page.
2. The backend generates a temporary password reset token.
3. For this project, an external email service is **not required**.
4. The reset token is logged/returned for testing purposes.

### Reset Password

1. The reset token is passed to the Reset Password page.
2. The user provides:
   - New password
   - Confirm password
3. The backend validates the reset token and updates the password.
4. After a successful password reset, the user is redirected to the Login page.
5. The user can then log in using the new password.

---

## API Endpoints

### Authentication

| Method | Endpoint                | Description            |
| ------ | ----------------------- | ---------------------- |
| POST   | `/auth/register`        | Register a new user    |
| POST   | `/auth/login`           | Login                  |
| POST   | `/auth/forgot-password` | Request password reset |
| POST   | `/auth/reset-password`  | Reset password         |

### User

| Method | Endpoint        | Description                                                     |
| ------ | --------------- | --------------------------------------------------------------- |
| GET    | `/user/profile` | Get authenticated user profile (Protected – requires valid JWT) |

---

## Environment Variables

The repository contains a `.env.example` file to show the required environment variables.

Create your own `.env` file inside the `backend` folder.

**Required variables:**

```env
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
```

> Do **not** commit your `.env` file or any real credentials to GitHub.

---

## Troubleshooting

### Backend cannot connect to PostgreSQL

Make sure:

- PostgreSQL is installed
- PostgreSQL is running
- The database exists
- The username and password in `.env` are correct
- The database name in `.env` is correct
- PostgreSQL is running on port `5432` (or the correct port is specified in `.env`)

### Frontend cannot connect to Backend

Make sure:

- The backend is running on `http://localhost:3001`
- The frontend is running on `http://localhost:3000`
- Both applications are running at the same time

---

## License

This project is for educational / portfolio purposes.

### Rana Hafez (2026)
