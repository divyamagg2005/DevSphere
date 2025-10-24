# Quick Run Guide - DevSphere

## One-Time Setup

### Step 1: Setup Server Environment
```bash
cd server
cp .env.example .env
```
Then edit `server/.env` and add your credentials:
- MongoDB URI
- Cloudinary credentials

### Step 2: Install Dependencies
```bash
# In server directory
npm install

# In client directory
cd ../client
npm install
```

## Running the Application

### Terminal 1 - Start Server
```bash
cd server
npm run dev
```
Expected output: `🚀 Server running on port 5000`

### Terminal 2 - Start Client
```bash
cd client
npm run dev
```
Expected output: `▲ Next.js 16.0.0`

### Step 3: Open Browser
Navigate to: **http://localhost:3000**

## What Should Work

✅ View all posts
✅ Create new posts with optional media
✅ Like/Unlike posts
✅ Add comments to posts
✅ Search posts by username or tags
✅ Auto-generated usernames based on IP address

## Troubleshooting

If you see errors:
1. Check that both server and client are running
2. Verify `.env` file in server directory has correct credentials
3. Ensure MongoDB is accessible
4. Check that ports 3000 (client) and 5000 (server) are available

## Production Build

### Build Client
```bash
cd client
npm run build
npm start
```

### Build Server
```bash
cd server
npm start
```
