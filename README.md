# Worknoon Chat - Backend

A real-time chat system built with Node.js, Express, MongoDB, and Socket.IO.  
Supports multiple user roles and scalable conversation architecture for eCommerce support systems.

---

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.IO
- JWT Authentication
- bcryptjs

---

## Features

- User authentication (Register / Login)
- JWT-based secure auth
- Role-based access control:
  - admin
  - agent
  - customer
  - designer
  - merchant
- Real-time messaging with Socket.IO
- Conversations system (multi-user support)
- Message read/unread tracking
- Typing indicators
- Online user tracking

---

## Project Structure

```

src/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── sockets/
├── utils/
└── server.js

````

---

## Setup Instructions

### 1. Install dependencies

```bash
npm install
````

### 2. Create `.env`

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

### 3. Run server

```bash
npm run dev
```

---

## 🔌 API Endpoints

### Auth

* POST `/api/auth/register`
* POST `/api/auth/login`
* GET `/api/auth/users`

### Conversations

* POST `/api/conversations`
* GET `/api/conversations`

### Messages

* POST `/api/messages`
* GET `/api/messages/:conversationId`
* PUT `/api/messages/read`

---

## ⚡ Socket Events

* `setup` → initialize user
* `joinConversation`
* `sendMessage`
* `typing`
* `stopTyping`
* `onlineUsers`
* `newMessage`

---

## Challenges Solved

* Real-time synchronization using Socket.IO rooms
* Role-based access control middleware
* Scalable conversation model design
* Handling online/offline presence tracking

---

## 🎥 Demo


---

## 📌 Notes

This backend is designed to support integration with:

* React / Next.js frontend
* WordPress plugin via iframe embedding
