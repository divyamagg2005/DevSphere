# 🚀 DevSphere Setup Guide

## Step 1: Get MongoDB Atlas URI

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new cluster (free tier available)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Replace `devsphere` with your database name (or keep it)

Example format:
```
mongodb+srv://username:password@cluster0.mongodb.net/devsphere?retryWrites=true&w=majority
```

## Step 2: Get Cloudinary Credentials

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Go to your Dashboard
4. Find these values:
   - **Cloud Name** - Displayed at the top
   - **API Key** - In Settings → API Keys
   - **API Secret** - In Settings → API Keys (keep this secret!)

## Step 3: Update Backend .env

Edit `server/.env` and replace the placeholder values:

```env
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.mongodb.net/devsphere?retryWrites=true&w=majority
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
PORT=5000
```

## Step 4: Create Frontend .env.local

Create a new file `client/.env.local` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Step 5: Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

## Step 6: Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
📡 API available at http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

You should see:
```
▲ Next.js 16.0.0
- Local:        http://localhost:3000
```

## Step 7: Open in Browser

Navigate to `http://localhost:3000` and start creating posts!

## 🆘 Troubleshooting

### MongoDB Connection Error
- Make sure your IP is whitelisted in MongoDB Atlas (Network Access)
- Check that your connection string is correct
- Verify username and password don't have special characters (URL encode if needed)

### Cloudinary Upload Error
- Verify your Cloud Name, API Key, and API Secret are correct
- Check that your Cloudinary account is active

### CORS Error
- Make sure backend is running on port 5000
- Check that `NEXT_PUBLIC_API_URL` is set correctly in frontend

### Port Already in Use
- Backend: Change `PORT` in `server/.env`
- Frontend: Run `npm run dev -- -p 3001` for different port

## ✨ Features to Try

1. **Create a Post**
   - Add username and caption
   - Upload an image (optional)
   - Add tags (comma-separated)

2. **Like Posts**
   - Click the heart icon
   - See likes increment in real-time

3. **Comment**
   - Click the comment icon
   - Add your username and comment
   - See comments appear instantly

## 📚 Next Steps

- Explore the MongoDB documents in your database
- Try adding new fields to posts
- Experiment with different data structures
- Add user authentication
- Implement post deletion

Happy coding! 🎉
