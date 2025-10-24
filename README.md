# 🌐 DevSphere - MongoDB NoSQL Social Platform

DevSphere is a full-stack social media application that demonstrates **MongoDB's flexible NoSQL schema design** and its advantages for modern web applications.

## 🎯 Project Purpose

This project showcases how MongoDB's schema-less architecture enables:
- **Flexible data modeling** - Posts can have varying structures
- **Nested documents** - Comments stored as subdocuments within posts
- **Array fields** - Tags stored as dynamic arrays
- **Easy schema evolution** - Add new fields without migrations
- **Dynamic updates** - Increment likes, push comments without complex queries

## 🏗️ Architecture

### Backend (Node.js + Express + MongoDB)
```
server/
├── config/
│   ├── db.js              # MongoDB connection
│   └── cloudinary.js      # Cloudinary configuration
├── models/
│   └── Post.js            # Flexible Post schema with nested comments
├── controllers/
│   └── postController.js  # Business logic for posts
├── routes/
│   └── postRoutes.js      # API endpoints
├── index.js               # Express server entry point
├── .env                   # Environment variables (create from .env.example)
└── package.json
```

### Frontend (Next.js + TailwindCSS)
```
client/
├── src/
│   ├── components/
│   │   ├── PostForm.js    # Create new posts with image upload
│   │   ├── PostCard.js    # Display post with likes/comments
│   │   └── Comment.js     # Individual comment component
│   └── pages/
│       └── index.js       # Main feed page
├── .env.local             # Frontend environment (create from env.example)
└── package.json
```

## 📊 MongoDB Schema Design

### Post Document Structure
```javascript
{
  _id: ObjectId("..."),
  username: "john_doe",
  caption: "Learning MongoDB is awesome!",
  imageUrl: "https://cloudinary.com/...",
  tags: ["mongodb", "nodejs", "webdev"],
  likes: 42,
  comments: [
    {
      _id: ObjectId("..."),
      username: "jane_smith",
      text: "Great post!",
      createdAt: ISODate("2024-01-15T10:30:00Z")
    }
  ],
  createdAt: ISODate("2024-01-15T09:00:00Z")
}
```

### Key NoSQL Features Demonstrated

1. **Embedded Documents (Comments)**
   - Comments are nested within posts
   - No separate collection needed
   - Atomic updates with `$push` operator

2. **Array Fields (Tags)**
   - Dynamic array of strings
   - No fixed schema for tags
   - Easy to add/remove tags

3. **Flexible Schema**
   - Optional fields (imageUrl can be empty)
   - Easy to add new fields without migrations
   - Each document can have different structure

4. **Atomic Operations**
   - `$inc` for incrementing likes
   - `$push` for adding comments
   - No complex transactions needed

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for image uploads)

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Backend Environment

Create `server/.env` file:
```env
# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/devsphere?retryWrites=true&w=majority

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server Port
PORT=5000
```

**Get MongoDB URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string and replace `<password>` with your password

**Get Cloudinary Credentials:**
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Find credentials in your dashboard

### 3. Configure Frontend Environment

Create `client/.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Run the Application

**Terminal 1 - Start Backend:**
```bash
cd server
npm start
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```
Frontend will run on `http://localhost:3000`

### 5. Open in Browser

Navigate to `http://localhost:3000` and start creating posts!

## 🎨 Features

### ✨ Create Posts
- Add username and caption
- Upload images via Cloudinary
- Add multiple tags (comma-separated)
- Real-time preview of images

### ❤️ Like Posts
- Click the heart icon to like
- Likes increment instantly
- Stored in MongoDB with atomic `$inc` operation

### 💬 Comment on Posts
- Add username and comment text
- Comments stored as nested documents
- Displayed with timestamps

### 🎯 Responsive Design
- Dark theme with TailwindCSS
- Smooth transitions and hover effects
- Mobile-friendly layout
- Gradient backgrounds and modern UI

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Fetch all posts (sorted by newest) |
| POST | `/api/posts` | Create a new post (with optional image) |
| POST | `/api/posts/:id/like` | Increment likes on a post |
| POST | `/api/posts/:id/comment` | Add a comment to a post |

## 📝 Example API Usage

### Create a Post
```bash
curl -X POST http://localhost:5000/api/posts \
  -F "username=john_doe" \
  -F "caption=My first post!" \
  -F "tags=mongodb,nodejs" \
  -F "image=@/path/to/image.jpg"
```

### Like a Post
```bash
curl -X POST http://localhost:5000/api/posts/507f1f77bcf86cd799439011/like
```

### Add a Comment
```bash
curl -X POST http://localhost:5000/api/posts/507f1f77bcf86cd799439011/comment \
  -H "Content-Type: application/json" \
  -d '{"username":"jane_smith","text":"Great post!"}'
```

## 🎓 MongoDB Concepts Demonstrated

### 1. Schema Flexibility
Unlike SQL databases, MongoDB doesn't require a predefined schema. Posts can have different fields:
```javascript
// Post with image
{ username: "user1", caption: "Hello", imageUrl: "...", tags: ["tech"] }

// Post without image
{ username: "user2", caption: "World", tags: [] }
```

### 2. Embedded Documents
Comments are embedded within posts, avoiding JOIN operations:
```javascript
// One query to get post with all comments
db.posts.findOne({ _id: postId })

// In SQL, you'd need:
// SELECT * FROM posts WHERE id = ?
// SELECT * FROM comments WHERE post_id = ?
```

### 3. Atomic Operations
MongoDB provides atomic operators for common operations:
```javascript
// Increment likes atomically
db.posts.updateOne({ _id: postId }, { $inc: { likes: 1 } })

// Push comment to array atomically
db.posts.updateOne({ _id: postId }, { $push: { comments: newComment } })
```

### 4. No Migrations
Adding new fields doesn't require schema migrations:
```javascript
// Just start using new fields
const post = new Post({
  username: "user",
  caption: "text",
  newField: "value"  // No migration needed!
})
```

## 🛠️ Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Cloudinary** - Image hosting
- **CORS** - Cross-origin resource sharing

### Frontend
- **Next.js** - React framework
- **React** - UI library
- **TailwindCSS** - Utility-first CSS
- **Fetch API** - HTTP requests

## 🌟 Why MongoDB for Social Platforms?

1. **Flexible Data Models** - User profiles, posts, and comments can have varying structures
2. **Horizontal Scaling** - Easy to scale across multiple servers
3. **Fast Reads** - Embedded documents reduce query complexity
4. **JSON-like Documents** - Natural fit for JavaScript applications
5. **Rich Query Language** - Powerful aggregation and filtering
6. **No Schema Migrations** - Evolve your data model as needed

## 📚 Learning Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)
- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

Feel free to fork this project and experiment with:
- Adding user authentication
- Implementing post deletion
- Adding image galleries
- Creating user profiles
- Adding real-time updates with Socket.io

## 📄 License

MIT License - Feel free to use this project for learning and development.

---

**Built with ❤️ to demonstrate MongoDB's powerful NoSQL capabilities**
