# ⚡ Quick Start - DevSphere

## Prerequisites
- Node.js installed
- MongoDB Atlas account with connection string
- Cloudinary account with credentials

## 1️⃣ Configure Backend

Edit `server/.env`:
```env
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/devsphere?retryWrites=true&w=majority
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
```

## 2️⃣ Configure Frontend

Create `client/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 3️⃣ Install & Run

**Backend:**
```bash
cd server
npm install
npm start
```

**Frontend (new terminal):**
```bash
cd client
npm install
npm run dev
```

## 4️⃣ Open Browser
Navigate to `http://localhost:3000`

## ✅ You're Done!
Start creating posts and exploring MongoDB's NoSQL flexibility! 🎉

---

For detailed setup instructions, see `SETUP_GUIDE.md`
For project overview, see `README.md`
