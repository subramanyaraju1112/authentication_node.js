# Authentication API

A production-ready Authentication API built using **Node.js**, **Express.js**, **TypeScript**, **MongoDB**, **Docker**, **Docker Compose**, and deployed on **AWS EC2**.

---

# Features

- User Signup
- User Login
- Email OTP Verification
- Resend OTP
- JWT Authentication
- Access Token
- Refresh Token Rotation
- Logout
- Protected Routes
- Password Hashing using bcrypt
- Dockerized Application
- MongoDB Container
- AWS EC2 Deployment

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

- JWT
- bcryptjs

## Email

- Nodemailer

## DevOps

- Docker
- Docker Compose
- AWS EC2
- Ubuntu

---

# Project Structure

```
src
│
├── config
│     db.ts
│
├── controllers
│
├── middleware
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

```
Signup
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
```

---

# OTP Verification

```
Receive Email + OTP
        │
        ▼
Find User
        │
        ▼
Check OTP
        │
        ▼
Check Expiry
        │
        ▼
Mark User Verified
```

---

# Signin Flow

```
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

```
Receive Refresh Token
        │
        ▼
Verify JWT
        │
        ▼
Find Token in Database
        │
        ▼
Check Revoked
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
Replace Old Refresh Token
        │
        ▼
Return Tokens
```

---

# Logout Flow

```
Receive Refresh Token
        │
        ▼
Find Token
        │
        ▼
Delete Refresh Token
        │
        ▼
User Logged Out
```

---

# Database Collections

## users

```
_id
username
email
password
isVerified
otp
otpExpiry
createdAt
updatedAt
```

---

## refresh_tokens

```
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

- Short-lived
- Used for protected APIs

---

## Refresh Token

- Long-lived
- Stored in MongoDB
- Rotated after every refresh

---

# Dockerization

## Dockerfile

```
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm","start"]
```

---

# Docker Compose

Two containers are created.

```
authentication-api
        │
        ▼
mongodb
```

---

# Docker Network

Docker Compose automatically creates an internal network.

Node.js connects using

```
mongodb://mongodb:27017/auth
```

Notice:

```
mongodb
```

is the service name,
NOT localhost.

---

# AWS Deployment

EC2 Instance

```
Ubuntu 26.04 LTS
```

Docker installed

```
sudo apt install docker.io
```

Docker Compose

```
docker compose
```

Repository cloned

```
git clone
```

Project started

```
docker compose up -d --build
```

---

# Security Group Configuration

Allowed Ports

| Port | Purpose |
|------|----------|
|22|SSH|
|80|HTTP|
|443|HTTPS|
|3000|Node API (Development)|

---

# Deployment Architecture

```
                Internet
                     │
                     ▼
        EC2 Ubuntu Server
                     │
              Docker Compose
                     │
     ┌───────────────┴───────────────┐
     │                               │
     ▼                               ▼
Authentication API               MongoDB
(Node.js)                     (Docker Container)
```

---

# Updating the Application

Whenever code changes

```
git pull origin main

docker compose up -d --build
```

No need to restart EC2.

---

# Stopping Containers

```
docker compose down
```

---

# Starting Containers

```
docker compose up -d
```

---

# Useful Docker Commands

Show running containers

```
docker ps
```

Show all containers

```
docker ps -a
```

Show images

```
docker images
```

Show logs

```
docker compose logs -f
```

Remove unused images

```
docker image prune
```

---

# Future Improvements

- Reverse Proxy using NGINX
- HTTPS using Let's Encrypt
- Custom Domain
- GitHub Actions CI/CD
- AWS CloudWatch Monitoring
- Load Balancer
- ECS Deployment
- Kubernetes

---

# Author

Subramanya Raju S

Backend Developer

Built with "Bold" using Node.js, TypeScript, Docker and AWS.
