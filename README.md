# Collaborative Notes App - Server

This is the backend server for the Collaborative Notes App. It is built with Node.js, Express, and MongoDB. The server handles user authentication, note management, and real-time updates.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

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
