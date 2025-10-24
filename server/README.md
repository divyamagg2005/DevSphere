# DevSphere Backend API

Backend server for DevSphere - MongoDB NoSQL demonstration platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with your credentials:
```env
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
```

3. Start the server:
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a new post
- `POST /api/posts/:id/like` - Like a post
- `POST /api/posts/:id/comment` - Add a comment

## MongoDB Schema

The Post model demonstrates MongoDB's flexible schema with:
- Nested comments array
- Dynamic tags array
- Optional image field
- Atomic operations for likes and comments
