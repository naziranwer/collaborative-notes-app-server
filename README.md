# Collaborative Notes App - Server

This is the backend server for the Collaborative Notes App. It is built with Node.js, Express, and MongoDB. The server handles user authentication, note management, and real-time updates.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Architecture

The Collaborative Notes App follows a modern web application architecture with a clear separation of concerns between the frontend and backend. Here is a brief overview of the architecture:

### Backend

- **Node.js and Express**: The backend server is built using Node.js and Express, providing a robust and scalable environment for handling HTTP requests and managing application logic.
- **MongoDB**: MongoDB is used as the database to store user information, notes, and version history. It provides a flexible schema design and powerful querying capabilities.
- **Mongoose**: Mongoose is used as an ODM (Object Data Modeling) library to interact with MongoDB, providing a straightforward way to define schemas and models.
- **Authentication**: User authentication is handled using JWT (JSON Web Tokens), ensuring secure access to protected routes and resources.
- **Real-time Updates**: Real-time updates are managed using WebSockets, allowing users to see changes to notes in real-time.

### Frontend

- **React and Vite**: The frontend client is built using React and Vite, providing a fast and responsive user interface.
- **React Router**: React Router is used for client-side routing, enabling seamless navigation between different pages and components.
- **Tailwind CSS**: Tailwind CSS is used for styling, providing a utility-first approach to design and ensuring a consistent look and feel across the application.

### Communication

- **RESTful API**: The backend exposes a RESTful API for the frontend to interact with. This includes endpoints for user registration, login, note management, and collaborator management.
- **WebSockets**: WebSockets are used for real-time communication between the client and server, allowing users to see updates to notes as they happen.

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Setup

1. Clone the repository:

   ```sh
   git clone https://github.com/naziranwer/collaborative-notes-app-server.git
   cd collaborative-notes-app/server
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the `server` directory and add the following variables:

   ```env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:

   ```sh
   npm start
   ```

## Environment Variables

The following environment variables need to be set in the `.env` file:

- `MONGODB_URI`: The connection string for your MongoDB database.
- `JWT_SECRET`: The secret key used for signing JSON Web Tokens.

## API Endpoints

### Authentication

- `POST /api/auth/register`

  - Description: Register a new user.
  - Request Body: `{ "name": "string", "email": "string", "password": "string" }`
  - Response: `{ "token": "string", "user": { "id": "string", "name": "string", "email": "string" } }`

- `POST /api/auth/login`
  - Description: Log in an existing user.
  - Request Body: `{ "email": "string", "password": "string" }`
  - Response: `{ "token": "string", "user": { "id": "string", "name": "string", "email": "string" } }`

### Notes

- `GET /api/notes`

  - Description: Get all notes.
  - Response: `[ { "id": "string", "title": "string", "content": "string", "createdAt": "date", "updatedAt": "date" } ]`

- `POST /api/notes`

  - Description: Create a new note.
  - Request Body: `{ "title": "string", "content": "string" }`
  - Response: `{ "id": "string", "title": "string", "content": "string", "createdAt": "date", "updatedAt": "date" }`

- `GET /api/notes/:id`

  - Description: Get a specific note.
  - Response: `{ "id": "string", "title": "string", "content": "string", "createdAt": "date", "updatedAt": "date" }`

- `PUT /api/notes/:id`

  - Description: Update a specific note.
  - Request Body: `{ "title": "string", "content": "string" }`
  - Response: `{ "id": "string", "title": "string", "content": "string", "createdAt": "date", "updatedAt": "date" }`

- `DELETE /api/notes/:id`
  - Description: Delete a specific note.
  - Response: `{ "message": "Note deleted successfully" }`

### Collaborators

- `POST /api/notes/:id/collaborators`

  - Description: Add a collaborator to a note.
  - Request Body: `{ "collaboratorId": "string", "permission": "string" }`
  - Response: `{ "message": "Collaborator added successfully" }`

- `DELETE /api/notes/:id/collaborators/:collaboratorId`
  - Description: Remove a collaborator from a note.
  - Response: `{ "message": "Collaborator removed successfully" }`

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.
