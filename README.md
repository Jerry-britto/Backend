# Node.js and Express.js YouTube Backend

## Overview

This project is a backend implementation for a YouTube clone built using Node.js and Express.js. It includes authentication using JWT, password encryption using bcrypt, and file handling with Cloudinary. Users can upload videos, change their password, log out, and view their subscribers and subscribed channels.

## Features

- **Authentication**: Users can sign up, log in, and log out securely using JWT.
- **Password Encryption**: User passwords are encrypted using bcrypt for security.
- **Video Upload**: Users can upload videos, which are stored in Cloudinary.
- **Change Password**: Users can change their passwords securely.
- **View Subscribers**: Users can see the number of subscribers to their channel.
- **View Subscribed Channels**: Users can see the number of channels they are subscribed to.

## Technologies Used

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB (database)
- **Authentication**:
  - JSON Web Tokens (JWT)
  - bcrypt.js (password hashing)
- **File Handling**:
  - Cloudinary (for storing uploaded videos)

## Future Work

- Implement additional functionalities such as video playback, commenting, likes/dislikes, and channel subscriptions.
- Enhance security measures such as input validation and error handling.
- Optimize performance and scalability of the backend.

## Getting Started

1. Clone the repository:
    git clone https://github.com/your-username/youtube-clone-backend.git

2. Install dependencies:
   cd backend
   npm install
   
3. Set up environment variables:

   - Create a `.env` file in the root directory.
   - Define the following environment variables:
     ```
     PORT=3000
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_API_SECRET=your_cloudinary_api_secret
     ```

4. Run the server:
npm run dev

5. Access the API at `http://localhost:3000`.




