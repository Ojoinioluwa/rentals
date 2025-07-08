# Starter Backend API

A reusable starter template for backend APIs built with Node.js, Express, and JWT authentication.

---

## How to Use This Template for New Projects

To start a new project based on this template, follow these steps:

1. **Clone this repository:**

```bash
   git clone git@github.com:Ojoinioluwa/starter-backend-api.git your-new-project
   cd your-new-project
```

```bash
   rm -rf .git
   git init
```

```bash
   git remote add origin <your-new-repo-url>
```

```bash
   git add .
   git commit -m "Initial commit from starter-backend-api"
   git push -u origin main
```
2. ## Features Included
- JWT authentication middleware (isAuthenticated)

- Environment variable support with process.env

- Basic Express server setup

- Structured folder setup for scalability

3. Setup
1. **Install dependencies**
```bash
npm install
```

2. **Create a .env file with the following variables:**
```bash
    JWT_SECRET=your_jwt_secret_key
    PORT=your_desired_port (default is 8000)
    MONGODB_URI=
    AUTH_EMAIL=
    AUTH_PASSWORD=
    EMAIL_SERVICE=
```
3. **Start the server**

```bash
node --watch server
```

## Contribution
Feel free to open issues or submit pull requests if you want to improve this starter!





