# 🔧 Troubleshooting Guide

## Error: "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

This error means the frontend is receiving HTML instead of JSON from the backend.

### Causes & Solutions

#### 1. Backend is Not Running
**Check:** Is the backend server running on port 5000?

**Fix:**
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

#### 2. MongoDB Connection Failed
**Check:** Look at backend console for MongoDB errors

**Error:** `❌ MongoDB Connection Error: querySrv ENOTFOUND`

**Fix:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click your cluster → Network Access
3. Add your IP address to whitelist
4. Restart backend: `npm start`

#### 3. Wrong API URL in Frontend
**Check:** Is `NEXT_PUBLIC_API_URL` set correctly?

**Fix:**
Create `client/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Then restart frontend:
```bash
cd client
npm run dev
```

#### 4. Port Already in Use
**Error:** `EADDRINUSE: address already in use :::5000`

**Fix:**
Either:
- Kill the process using port 5000
- Or change port in `server/.env`:
```env
PORT=5001
```

Then update frontend `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

#### 5. Cloudinary Credentials Missing
**Check:** Are Cloudinary credentials in `server/.env`?

**Fix:**
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Common Issues

### Issue: "Failed to fetch"
**Cause:** Backend not running or wrong URL

**Solution:**
1. Check backend is running: `npm start` in server folder
2. Check frontend `.env.local` has correct API URL
3. Check browser console for exact error

### Issue: "MongoDB Connection Error"
**Cause:** MongoDB Atlas IP whitelist or connection string wrong

**Solution:**
1. Verify connection string in `server/.env`
2. Add your IP to MongoDB Atlas Network Access
3. Check username/password don't have special characters

### Issue: "Image upload fails"
**Cause:** Cloudinary credentials wrong or invalid

**Solution:**
1. Verify credentials in `server/.env`
2. Check Cloudinary account is active
3. Check API key and secret are correct

### Issue: "Username not loading"
**Cause:** Backend `/api/username` endpoint failing

**Solution:**
1. Check backend is running
2. Check MongoDB User collection exists
3. Restart backend: `npm start`

## Debugging Steps

### 1. Check Backend Status
```bash
# Terminal 1
cd server
npm start

# Look for:
# ✅ MongoDB Connected Successfully
# 🚀 Server running on port 5000
```

### 2. Test Backend Manually
```bash
# Terminal 2
curl http://localhost:5000/

# Should return:
# {"message":"🚀 DevSphere API is running",...}
```

### 3. Check Frontend Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Check Network tab for failed requests

### 4. Check Environment Variables
**Backend:**
```bash
cd server
cat .env
```

Should have:
- MONGO_URI
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- PORT

**Frontend:**
```bash
cd client
cat .env.local
```

Should have:
- NEXT_PUBLIC_API_URL=http://localhost:5000

### 5. Restart Everything
```bash
# Kill all processes
# Terminal 1
cd server
npm start

# Terminal 2 (new terminal)
cd client
npm run dev
```

## Quick Checklist

- [ ] Backend running on port 5000
- [ ] MongoDB connected (check console)
- [ ] Cloudinary credentials in `.env`
- [ ] Frontend `.env.local` has correct API URL
- [ ] No port conflicts (5000, 3000)
- [ ] Browser console shows no errors
- [ ] Network tab shows successful API calls

## Still Having Issues?

1. **Check all error messages** - Read them carefully
2. **Check browser console** - F12 → Console tab
3. **Check backend console** - Look for error logs
4. **Restart everything** - Kill and restart all processes
5. **Check .env files** - Verify all credentials are correct
6. **Check MongoDB Atlas** - Verify IP whitelist and connection string

## Getting Help

When asking for help, provide:
1. Full error message from browser console
2. Full error message from backend console
3. Your `.env` file (without passwords)
4. Steps to reproduce the issue
