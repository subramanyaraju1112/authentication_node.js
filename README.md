# Authentication API

A production-ready Authentication API built using **Node.js**, **Express.js**, **TypeScript**, **MongoDB**, **Redis**, **Docker**, **Docker Compose**, **NGINX**, and deployed on **AWS EC2**.

> **API Base URL**
>
> `https://api.subramanyaraju.com`

![CI](https://github.com/<your-username>/authentication_node.js/actions/workflows/ci.yml/badge.svg)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [CI/CD](#cicd)
- [Authentication Flow](#authentication-flow)
- [OTP Verification Flow](#otp-verification-flow)
- [Signin Flow](#signin-flow)
- [Refresh Token Flow](#refresh-token-flow)
- [Logout Flow](#logout-flow)
- [Database Collections](#database-collections)
- [JWT Strategy](#jwt-strategy)
- [Dockerization](#dockerization)
- [AWS EC2 Deployment](#aws-ec2-deployment)
- [NGINX Reverse Proxy](#nginx-reverse-proxy)
- [Security Group Configuration](#security-group-configuration)
- [Deployment Architecture](#deployment-architecture)
- [Updating the Application](#updating-the-application)
- [Useful Commands](#useful-commands)
- [API Endpoints](#api-endpoints)
- [Future Improvements](#future-improvements)
- [License](#license)
- [Author](#author)

---

## Features

- User Signup
- User Signin
- Email OTP Verification
- Resend OTP
- JWT Authentication
- Access Token & Refresh Token Strategy
- Refresh Token Rotation
- Logout
- Protected Routes
- Password Hashing using bcrypt
- Dockerized Application
- MongoDB & Redis Containers
- NGINX Reverse Proxy
- Production-style Deployment on AWS EC2

---

## Tech Stack

### Backend
- Node.js
- Express.js
- TypeScript

### Database
- MongoDB
- Mongoose
- Redis

### Authentication
- JWT (Access Token)
- JWT (Refresh Token)
- bcryptjs

### Email
- Nodemailer

### DevOps
- Docker
- Docker Compose
- NGINX
- AWS EC2
- Ubuntu Linux
- Let's Encrypt (Certbot)

---

## Project Structure

```text
src
├── config
│   ├── db.ts
│   └── redis.ts
├── constants
├── controllers
├── middleware
├── models
├── routes
├── services
│   ├── auth.service.ts
│   └── rateLimiter.service.ts
├── utils
│   ├── redisKeys.ts
│   ├── generateOtp.ts
│   ├── hashPassword.ts
│   └── sendEmail.ts
├── app.ts
└── server.ts
```

---

## Getting Started

### Prerequisites

- Node.js 22+
- Docker & Docker Compose
- MongoDB (local or containerized)
- Redis (local or containerized)

### Local Setup

```bash
# Clone the repository
git clone <repository-url>
cd authentication_node.js

# Install dependencies
npm install

# Copy environment variables and fill in your values
cp .env.example .env

# Run in development mode
npm run dev
```

### Run with Docker

```bash
docker compose up -d --build
```

---

## Environment Variables

Create a `.env` file in the project root with the following keys:

```env
PORT=3000
MONGODB_URI=mongodb://mongodb:27017/auth
REDIS_URL=redis://redis:6379

JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

> Keep `.env` out of version control. Use `.env.example` as a template for required keys.

---

## CI/CD

Continuous Integration is handled with **GitHub Actions**.

### Workflow: `.github/workflows/ci.yml`

Triggered on every push and pull request to `main`:

```text
Push / Pull Request
        │
        ▼
Checkout Code
        │
        ▼
Install Dependencies
        │
        ▼
Build Application (npm run build)
```

This workflow validates that the project compiles successfully before changes are merged. It currently does **not** run automated tests or deploy — deployment to EC2 is still performed manually (see [Updating the Application](#updating-the-application)).

Automated testing and deployment are tracked under [Future Improvements](#future-improvements).

---

## Authentication Flow

```text
Signup
  ↓
Check Existing User
  ↓
Hash Password
  ↓
Generate OTP
  ↓
Store OTP in Redis (10 min TTL)
  ↓
Store User
  ↓
Send OTP Email
```

---

## OTP Verification Flow

```text
Receive OTP
  ↓
Read OTP from Redis
  ↓
Validate OTP
  ↓
Verify User
  ↓
Delete OTP
```

---

## Signin Flow

```text
Signin Request
      │
      ▼
Check Login Attempts (Redis)
      │
      ▼
Find User
      │
      ▼
Verify Email
      │
      ▼
Compare Password
      │
      ▼
Success?
  │           │
 No          Yes
  │           │
  ▼           ▼
Increment   Reset Attempts
Attempts      │
  │           ▼
  └────► Generate Tokens
             │
             ▼
      Store Refresh Token
```

### Rate Limiting

- Maximum Attempts: **5**
- Lock Time: **15 Minutes**
- Redis Key:

```text
login_attempts:<email>:<ip>
```

---

## Refresh Token Flow

```text
Receive Refresh Token
        │
        ▼
Verify JWT
        │
        ▼
Find Refresh Token
        │
        ▼
Check Expiry
        │
        ▼
Generate New Access Token
        │
        ▼
Generate New Refresh Token
        │
        ▼
Replace Existing Refresh Token
        │
        ▼
Return New Tokens
```

---

## Logout Flow

```text
Receive Refresh Token
        │
        ▼
Find Refresh Token
        │
        ▼
Delete Refresh Token
        │
        ▼
Logout Successful
```

---

## Database Collections

### users

```text
_id
username
email
password
otp
otpExpiry
isVerified
createdAt
updatedAt
```

### refresh_tokens

```text
_id
userId
token
expiresAt
revoked
createdAt
updatedAt
```

---

## JWT Strategy

### Access Token
- Short-lived Token
- Sent with every protected request
- Stored on client-side
- Used for Authentication

### Refresh Token
- Long-lived Token
- Stored in MongoDB
- Rotated after every refresh
- Used to generate new Access Tokens

---

## Dockerization

### Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Docker Compose

The project runs three Docker containers.

```text
authentication-api
        │
   ┌────┴────┐
   ▼         ▼
mongodb    redis
```

Start containers

```bash
docker compose up -d
```

Build and start

```bash
docker compose up -d --build
```

Stop containers

```bash
docker compose down
```

### Docker Networking

Docker Compose automatically creates an internal network.

The Authentication API communicates with MongoDB and Redis using their Docker service names.

```text
mongodb://mongodb:27017/auth
redis://redis:6379
```

> **Important**
>
> `mongodb` and `redis` are Docker service names.
>
> They are **NOT** `localhost`.

---

## AWS EC2 Deployment

The application is deployed on an **Ubuntu EC2 Instance**.

Deployment Steps

```bash
git clone <repository-url>

cd authentication_node.js

docker compose up -d --build
```

---

## NGINX Reverse Proxy

NGINX is installed on the EC2 host machine.

Instead of exposing the Node.js application directly to the internet, NGINX acts as a Reverse Proxy.

Incoming requests:

```text
Internet
      │
      ▼
NGINX (Port 80)
      │
      ▼
localhost:3000
      │
      ▼
Authentication API
```

### Benefits

- Hides internal application port
- Single public entry point
- Easier HTTPS configuration
- Better Security
- Production-ready Architecture

### NGINX Configuration

```nginx
server {

    listen 80;

    server_name _;

    location / {

        proxy_pass http://localhost:3000;

        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;

        proxy_set_header Connection "upgrade";

        proxy_set_header Host $host;

        proxy_cache_bypass $http_upgrade;
    }
}
```

Validate configuration

```bash
sudo nginx -t
```

Reload NGINX

```bash
sudo systemctl reload nginx
```

---

## Security Group Configuration

| Port | Purpose |
| ---- | ------- |
| 22   | SSH     |
| 80   | HTTP    |
| 443  | HTTPS   |

> During development, **Port 3000** was temporarily opened to test the Node.js application directly.
>
> After configuring the NGINX Reverse Proxy, the application is accessed only through **Port 80**, making Port **3000** private.

---

## Deployment Architecture

```text
Internet
    │
    ▼
https://api.subramanyaraju.com
    │
    ▼
NGINX
    │
    ▼
Authentication API (Docker)
    │
 ┌──┴────────┐
 ▼           ▼
MongoDB    Redis
```

### Request Flow

```text
Client
   │
   ▼
NGINX
   │
   ▼
Authentication API
   │
   ▼
MongoDB
```

---

## Updating the Application

Whenever changes are pushed to GitHub:

```bash
git pull origin main

docker compose up -d --build
```

No need to restart the EC2 instance.

---

## Useful Commands

### Docker

```bash
docker ps                  # Running containers
docker ps -a                # All containers
docker images                # Docker images
docker compose logs -f       # Application logs
docker compose down          # Stop containers
docker compose up -d         # Start containers
docker compose up -d --build # Rebuild containers
docker image prune           # Remove unused images
```

### Redis

```bash
docker exec -it redis redis-cli
```

```redis
PING
KEYS *
GET <key>
TTL <key>
DEL <key>
```

### Linux / EC2

```bash
pwd                                          # Current directory
ls                                           # List files
ssh -i ~/.ssh/<key-name>.pem ubuntu@<EC2_PUBLIC_IP>  # SSH into EC2
sudo systemctl status nginx                  # NGINX status
sudo systemctl restart nginx                 # Restart NGINX
sudo systemctl reload nginx                  # Reload NGINX
sudo nginx -t                                # Test NGINX config
```

---

## API Endpoints

### Public Routes

| Method | Endpoint               |
| ------ | ----------------------- |
| POST   | `/api/auth/signup`     |
| POST   | `/api/auth/signin`     |
| POST   | `/api/auth/verify-otp` |
| POST   | `/api/auth/resend-otp` |

### Protected Routes

| Method | Endpoint           |
| ------ | ------------------- |
| POST   | `/api/auth/logout` |
| GET    | `/api/profile`     |

---

## Future Improvements

- Automated Testing in CI
- Automatic Docker Deployment (CD to EC2)
- Health Checks
- AWS CloudWatch Monitoring
- Docker Image Registry
- Amazon ECS Deployment
- Kubernetes
- Load Balancer
- Logging & Monitoring

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Author

**Subramanya Raju S**

Backend Developer

Built with **Node.js**, **TypeScript**, **Redis**, **MongoDB**, **Docker**, **NGINX** and **AWS EC2**.
