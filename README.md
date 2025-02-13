# MERN Chat App

A real-time chat application built using the MERN (MongoDB, Express.js, React, Node.js) stack, similar to WhatsApp. The app supports user authentication, one-to-one and group messaging, and real-time messaging using Socket.io.

## Features

- User authentication (Signup, Login, Forgot Password, Reset Password)
- One-to-one and group chat functionality
- Real-time messaging using Socket.io
- User presence and online/offline status
- Secure authentication with JWT and cookies
- Context API for global state management
- MongoDB for storing user and chat data

## Tech Stack

### Frontend

- React.js (Vite for fast development)
- Context API (for state management)
- Tailwind CSS (for styling)
- React Router DOM (for navigation)
- Axios (for API requests)

### Backend

- Node.js & Express.js (server-side framework)
- MongoDB (NoSQL database for user and chat storage)
- Mongoose (MongoDB ODM for schema modeling)
- JSON Web Token (JWT) for authentication
- bcrypt.js (for password hashing)
- Socket.io (for real-time communication)

## Installation

### Prerequisites

- Node.js installed
- MongoDB running locally or a cloud MongoDB instance

### Steps to Run the Project

#### 1. Clone the Repository

```sh
git clone https://github.com/your-username/mern-chat-app.git
cd mern-chat-app
```

#### 2. Install Dependencies

##### Frontend

```sh
cd client
npm install
```

##### Backend

```sh
cd ../server
npm install
```

#### 3. Set Up Environment Variables

Create a `.env` file in the `server` directory and add the following:

```env
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
PORT=5000
```

#### 4. Run the Application

##### Start the Backend

```sh
cd server
npm run dev
```

##### Start the Frontend

```sh
cd client
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### Chats

- `GET /api/chats` - Get all chats for a user
- `POST /api/chats` - Create a new chat
- `GET /api/chats/:id` - Get messages of a specific chat
- `POST /api/messages` - Send a message

## Folder Structure

```
mern-chat-app/
├── client/  # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── App.js
│   │   ├── main.jsx
│   │   ├── index.css
│   ├── package.json
│   ├── vite.config.js
│
├── server/  # Express backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── server.js
│   ├── config/
│   ├── package.json
│
└── README.md
```

## Future Improvements

- Voice and video calling
- Message reactions
- Push notifications
- Typing indicators

## License

This project is licensed under the MIT License.

---

Happy Coding! 🚀
