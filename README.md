# ProjectPulse Server

**ProjectPulse Server** is the backend service for the ProjectPulse application, handling user authentication, project management, task tracking, and real-time chat functionalities. This server is built using Express and is designed to be scalable and secure, leveraging various technologies to ensure data integrity, secure authentication, and real-time communication.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Socket.IO Integration](#socketio-integration)
- [Acknowledgements](#acknowledgements)

## Features

- **User Authentication**: Secure token-based authentication with middleware checks for all protected routes.
- **Project and Task Management**: Create and manage projects and their respective task lists and tasks.
- **Real-Time Chat**: Integrated Socket.IO for real-time messaging between users.
- **Image Handling**: Upload and manage images securely using Cloudinary.
- **Analytics**: Track and display analytics for project progress and user activity.

## Technology Stack

- **Express**: Web framework for building the server.
- **MongoDB**: NoSQL database for storing all application data with Mongoose schemas.
- **TypeScript**: Ensures type safety across the entire codebase.
- **Cloudinary**: Handles image uploads and management.
- **Socket.IO**: Enables real-time communication for chat features.
- **jsonwebtoken**: Provides secure token-based authentication for users.
- **bcrypt**: Secures passwords through hashing before storing them in the database.
- **Axios**: Used for making HTTP requests from the client-side.
- **Nodemon**: Development tool that automatically restarts the server on code changes.

## Getting Started

To get started with the ProjectPulse Server, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Qinastha/ProjectPulseServer.git
   ```
2. **Navigate to the project directory**:
   ```bash
   cd ProjectPulseServer
   ```
3. **Install the dependencies**:
   ```bash
   npm install
   ```
4. **Set up environment variables**: Create a `.env` file in the root directory and define the necessary environment variables (see [Environment Variables](#environment-variables)).
5. **Start the server**:
   ```bash
   npm run dev
   ```
   The server will start on [http://localhost:4000](http://localhost:4000) by default.

## Environment Variables

The server relies on several environment variables that need to be configured in a `.env` file:

- `MONGO_URI`: MongoDB connection string
- `PORT`: Port number for the server
- `JWT_SECRET`: Secret key for JSON Web Token authentication
- `CLOUNDINARY_API_CLOUD_NAME`: Cloudinary cloud name for image storage
- `CLOUNDINARY_API_KEY`: Cloudinary API key
- `CLOUNDINARY_API_SECRET`: Cloudinary API secret

Example `.env` file:

```
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/mydatabase?retryWrites=true&w=majority
PORT=4000
JWT_SECRET=your_jwt_secret
CLOUNDINARY_API_CLOUD_NAME=your_cloud_name
CLOUNDINARY_API_KEY=your_api_key
CLOUNDINARY_API_SECRET=your_api_secret
```

## API Endpoints

The server exposes several API routes for different functionalities:

- **Authentication**: `/api/auth`
- **User Management**: `/api/user`
- **Profile Management**: `/api/profile`
- **Project Management**: `/api/project`
- **Task Management**: `/api/project/:projectId/taskList`
- **Core Data**: `/api/core`
- **Analytics**: `/api/analytics`
- **Chat**: `/api/chat`
- **Messages**: `/api/chat/:chatId/messages`

## Socket.IO Integration

The server uses Socket.IO to provide real-time chat functionality. The integration ensures that users can send and receive messages instantly across the application, with the server managing the communication channels and broadcasting events to connected clients.

## Acknowledgements

- **MongoDB**: For providing a flexible, scalable database solution.
- **Cloudinary**: For simplifying image handling in a secure and scalable way.
- **jsonwebtoken**: For providing a robust solution for token-based authentication.
- **bcrypt**: For ensuring that user passwords are stored securely.
- **Socket.IO**: For enabling real-time communication in the chat feature.
- **Nodemon**: For enhancing the development experience by automatically restarting the server on code changes.
