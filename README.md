# Authentication API

A production-ready Authentication API built using **Node.js**, **Express.js**, **TypeScript**, **MongoDB**, **Docker**, **Docker Compose**, **NGINX**, and deployed on **AWS EC2**.

---

# Features

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
- MongoDB Container
- NGINX Reverse Proxy
- Production-style Deployment on AWS EC2

---

# Tech Stack

## Backend

- Node.js
- Express.js
- TypeScript

## Database

- MongoDB
- Mongoose

## Authentication

- JWT (Access Token)
- JWT (Refresh Token)
- bcryptjs

## Email

- Nodemailer

## DevOps

- Docker
- Docker Compose
- NGINX
- AWS EC2
- Ubuntu Linux

---

# Project Structure

```text
src
│
├── config
│     └── db.ts
│
├── controllers
│
├── middlewares
│
├── models
│
├── routes
│
├── services
│
├── utils
│
├── app.ts
│
└── server.ts
```

---

# Authentication Flow

```text
Client
   │
   ▼
Signup Request
   │
   ▼
Check Existing User
   │
   ▼
Hash Password
   │
   ▼
Generate OTP
   │
   ▼
Store User
   │
   ▼
Send OTP Email
   │
   ▼
Success Response
```

---

# OTP Verification Flow

```text
Receive Email + OTP
        │
        ▼
Find User
        │
        ▼
Check OTP
        │
        ▼
Check OTP Expiry
        │
        ▼
Mark User Verified
        │
        ▼
Success Response
```

---

# Signin Flow

```text
Receive Credentials
        │
        ▼
Find User
        │
        ▼
Compare Password
        │
        ▼
Check Email Verification
        │
        ▼
Generate Access Token
        │
        ▼
Generate Refresh Token
        │
        ▼
Store Refresh Token
        │
        ▼
Return Tokens
```

---

# Refresh Token Flow

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

# Logout Flow

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

# Database Collections

## users

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

---

## refresh_tokens

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

# JWT Strategy

## Access Token

- Short-lived Token
- Sent with every protected request
- Stored on client-side
- Used for Authentication

---

## Refresh Token

- Long-lived Token
- Stored in MongoDB
- Rotated after every refresh
- Used to generate new Access Tokens

---

# Dockerization

## Dockerfile

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

---

# Docker Compose

The project runs two Docker containers.

```text
authentication-api
        │
        ▼
mongodb
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

---

# Docker Networking

Docker Compose automatically creates an internal network.

The Authentication API communicates with MongoDB using the Docker service name.

```text
mongodb://mongodb:27017/auth
```

> **Important**
>
> `mongodb` is the Docker service name.
>
> It is **NOT** `localhost`.

---

# AWS EC2 Deployment

The application is deployed on an **Ubuntu EC2 Instance**.

Deployment Steps

```bash
git clone <repository-url>

cd authentication_node.js

docker compose up -d --build
```

---

# NGINX Reverse Proxy

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

Benefits

- Hides internal application port
- Single public entry point
- Easier HTTPS configuration
- Better Security
- Production-ready Architecture

---

# NGINX Configuration

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

# Security Group Configuration

| Port | Purpose |
|------|----------|
| 22 | SSH |
| 80 | HTTP |
| 443 | HTTPS |

> During development, **Port 3000** was temporarily opened to test the Node.js application directly.
>
> After configuring the NGINX Reverse Proxy, the application is accessed only through **Port 80**, making Port **3000** private.

---

# Deployment Architecture

```text
                     Internet
                          │
                          ▼
                  Port 80 (HTTP)
                          │
                          ▼
                 NGINX Reverse Proxy
                          │
                          ▼
                 localhost:3000
                          │
                          ▼
          Authentication API (Docker)
                          │
                          ▼
          MongoDB (Docker Container)
                          │
                          ▼
                 Docker Volume
```

---

# Request Flow

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

# Updating the Application

Whenever changes are pushed to GitHub

```bash
git pull origin main

docker compose up -d --build
```

No need to restart the EC2 instance.

---

# Useful Docker Commands

Running Containers

```bash
docker ps
```

All Containers

```bash
docker ps -a
```

Docker Images

```bash
docker images
```

Application Logs

```bash
docker compose logs -f
```

Stop Containers

```bash
docker compose down
```

Start Containers

```bash
docker compose up -d
```

Rebuild Containers

```bash
docker compose up -d --build
```

Remove Unused Images

```bash
docker image prune
```

---

# Useful Linux Commands

Check Current Directory

```bash
pwd
```

List Files

```bash
ls
```

SSH into EC2

```bash
ssh -i ~/.ssh/<key-name>.pem ubuntu@<EC2_PUBLIC_IP>
```

NGINX Status

```bash
sudo systemctl status nginx
```

Restart NGINX

```bash
sudo systemctl restart nginx
```

Reload NGINX

```bash
sudo systemctl reload nginx
```

Test NGINX Configuration

```bash
sudo nginx -t
```

---

# API Endpoints

## Public Routes

| Method | Endpoint |
|----------|-----------------------------|
| POST | `/api/auth/signup` |
| POST | `/api/auth/signin` |
| POST | `/api/auth/verify-otp` |
| POST | `/api/auth/resend-otp` |

---

## Protected Routes

| Method | Endpoint |
|----------|-----------------------------|
| POST | `/api/auth/logout` |
| GET | `/api/profile` |

---

# Future Improvements

- HTTPS using Let's Encrypt
- Custom Domain
- GitHub Actions CI/CD
- Automatic Docker Deployment
- Health Checks
- AWS CloudWatch Monitoring
- Docker Image Registry
- Amazon ECS Deployment
- Kubernetes
- Load Balancer
- Redis for Token Caching
- API Rate Limiting
- Logging & Monitoring

---

# Author

**Subramanya Raju S**

Backend Developer

Built with BOLD using **Node.js**, **TypeScript**, **Docker**, **NGINX**, **MongoDB**, and **AWS EC2**.