# 🧪 Testing Guide - DevSphere

## Prerequisites
- Backend running on port 5000
- Frontend running on port 3000
- MongoDB connected
- Cloudinary configured

## Step 1: Clear Database

Clear all existing data to start fresh:

```bash
cd server
npm run clear-db
```

Expected output:
```
🔗 Connecting to MongoDB...
✅ Connected to MongoDB
🗑️  Clearing database...
✅ Deleted X posts
✅ Deleted X users
✨ Database cleared successfully!
```

## Step 2: Start Backend & Frontend

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

Expected output:
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

Expected output:
```
▲ Next.js 16.0.0
- Local:        http://localhost:3000
```

## Step 3: Test Features

### 3.1 Test Username Assignment

**What to test:**
- First visit should assign a unique username
- Refresh page should show same username
- Username should be displayed in post form

**Steps:**
1. Open `http://localhost:3000`
2. Check browser console for: `✨ New user created with username: ...`
3. Note the username (e.g., `SwiftPanda42`)
4. Refresh page (F5)
5. Check console for: `👋 Welcome back, SwiftPanda42`
6. Verify same username shown in post form

✅ **Pass:** Same username persists across refreshes

### 3.2 Test Post Creation with Media

**What to test:**
- Create post with image
- Create post with video
- Create post with GIF
- Create post without media

**Steps for Image:**
1. Fill caption: "Testing image upload"
2. Add tags: "test,image"
3. Select an image file (JPG, PNG, WebP)
4. Preview should show image
5. Click "Create Post"
6. Post should appear in feed with image displayed

**Steps for Video:**
1. Fill caption: "Testing video upload"
2. Add tags: "test,video"
3. Select a video file (MP4, WebM)
4. Preview should show video player
5. Click "Create Post"
6. Post should appear with video player (with controls)

**Steps for GIF:**
1. Fill caption: "Testing GIF upload"
2. Add tags: "test,gif"
3. Select a GIF file
4. Preview should show GIF
5. Click "Create Post"
6. Post should appear with GIF badge showing "GIF"

**Steps for Text Only:**
1. Fill caption: "Just text, no media"
2. Add tags: "test,text"
3. Don't select any file
4. Click "Create Post"
5. Post should appear without media section

✅ **Pass:** All media types display correctly with appropriate players

### 3.3 Test One-Like-Per-User

**What to test:**
- Can like a post once
- Heart fills red when liked
- Can unlike by clicking again
- Like count updates correctly
- Different users can like same post

**Steps:**
1. Create a post (any type)
2. Click heart icon on the post
3. Heart should fill red
4. Like count should increase by 1
5. Click heart again
6. Heart should unfill (outline)
7. Like count should decrease by 1
8. Try clicking multiple times - should toggle like/unlike

**Test with Different User:**
1. Open browser DevTools (F12)
2. Go to Application → Local Storage
3. Delete `userIP` entry
4. Refresh page
5. New username should be assigned
6. Like the same post again
7. Like count should increase
8. Both users' likes should be tracked

✅ **Pass:** Each user can like once, like count updates correctly

### 3.4 Test Comments

**What to test:**
- Can add comments to posts
- Comments display with username and timestamp
- Multiple comments show in order

**Steps:**
1. Click comment icon on a post
2. Enter your username (auto-filled from post form)
3. Enter comment text
4. Click "Post Comment"
5. Comment should appear below post
6. Add another comment
7. Both comments should be visible

✅ **Pass:** Comments display correctly

### 3.5 Test Media Display

**What to test:**
- Images display correctly
- Videos show player with controls
- GIFs display as images
- Media type badge shows correct type

**Steps:**
1. Look at each post in feed
2. Check image posts show images
3. Check video posts show video player
4. Check GIF posts show animated GIF
5. Check media type badge (top-right corner)
   - Should show "IMAGE", "VIDEO", or "GIF"

✅ **Pass:** All media displays with correct type badge

## Step 4: Verify Database

Check MongoDB to verify data structure:

```bash
# In MongoDB Atlas:
# 1. Go to Collections
# 2. Check "posts" collection
#    - Should have documents with mediaUrl, mediaType, likedBy
# 3. Check "users" collection
#    - Should have documents with ipAddress, username
```

Expected Post Document:
```json
{
  "_id": ObjectId("..."),
  "username": "SwiftPanda42",
  "caption": "Test post",
  "mediaUrl": "https://res.cloudinary.com/...",
  "mediaType": "image",
  "tags": ["test"],
  "likes": 2,
  "likedBy": ["127.0.0.1", "192.168.1.100"],
  "comments": [...],
  "createdAt": ISODate("2024-01-15T10:00:00Z")
}
```

Expected User Document:
```json
{
  "_id": ObjectId("..."),
  "ipAddress": "127.0.0.1",
  "username": "SwiftPanda42",
  "createdAt": ISODate("2024-01-15T10:00:00Z")
}
```

## Testing Checklist

- [ ] Database cleared successfully
- [ ] Backend running and connected to MongoDB
- [ ] Frontend running and connected to backend
- [ ] Username assigned on first visit
- [ ] Username persists on refresh
- [ ] Can create post with image
- [ ] Can create post with video
- [ ] Can create post with GIF
- [ ] Can create text-only post
- [ ] Image displays correctly
- [ ] Video player shows with controls
- [ ] GIF displays and animates
- [ ] Media type badge shows correct type
- [ ] Can like post (heart fills red)
- [ ] Can unlike post (heart unfills)
- [ ] Like count updates correctly
- [ ] Each user can only like once
- [ ] Can add comments to posts
- [ ] Comments display with username
- [ ] Multiple comments show in order
- [ ] MongoDB documents have correct structure
- [ ] likedBy array tracks IP addresses
- [ ] No console errors

## Troubleshooting

### Issue: Database not clearing
```bash
# Make sure MongoDB is connected
# Check .env has correct MONGO_URI
npm run clear-db
```

### Issue: Posts not showing media
1. Check Cloudinary credentials in `.env`
2. Check browser console for upload errors
3. Check post document in MongoDB has mediaUrl

### Issue: Like not working
1. Check browser console for errors
2. Verify IP address is being sent
3. Check post document has likedBy array

### Issue: Username not persisting
1. Check localStorage in browser (F12 → Application)
2. Verify User collection in MongoDB
3. Restart backend and frontend

## Next Steps After Testing

If all tests pass:
1. ✅ Commit changes to git
2. ✅ Deploy to production
3. ✅ Monitor for errors
4. ✅ Gather user feedback

If any tests fail:
1. ❌ Check error messages
2. ❌ Review TROUBLESHOOTING.md
3. ❌ Check console logs
4. ❌ Review code changes
