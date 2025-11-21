# 🚀 Quick Start Guide - Pre-Deployment

## ⚡ Quick Setup (5 minutes)

### 1. Install New Dependencies
```bash
cd backend
npm install
```

### 2. Create Environment File
Create `backend/.env`:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecoedu
JWT_SECRET=your-secret-key-here
CLIENT_URL=http://localhost:5173
```

**Generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Test the Server
```bash
cd backend
npm run dev
```

The server should start and validate your environment variables.

## ✅ What's Been Improved

- ✅ Security headers (Helmet)
- ✅ Rate limiting (prevents brute force)
- ✅ Input validation
- ✅ Environment variable validation
- ✅ Better error handling
- ✅ JWT secret requirement

## 📋 Before Production Deployment

1. **Set Production Environment Variables**
   - `NODE_ENV=production`
   - `MONGO_URI` (MongoDB Atlas connection string)
   - `JWT_SECRET` (strong random string)
   - `CLIENT_URL` (your frontend domain)

2. **Test Everything**
   - Signup/Login
   - API endpoints
   - File uploads
   - Real-time features

3. **Review Security Settings**
   - CORS origins
   - Rate limit thresholds
   - Password requirements

## 📚 Full Documentation

- **`DEPLOYMENT_CHECKLIST.md`** - Complete deployment guide
- **`DEPLOYMENT_IMPROVEMENTS.md`** - What was changed and why

## 🆘 Troubleshooting

### "Missing required environment variables"
- Create `backend/.env` file
- Add all required variables (see above)

### "JWT_SECRET is not set"
- Add `JWT_SECRET` to your `.env` file
- Generate a secure random string

### Rate limiting too strict?
- Adjust limits in `backend/src/app.js`
- Modify `max` values in rate limiters

### Password validation failing?
- Current requirement: minimum 6 characters
- Can be strengthened in `backend/src/middleware/validate.js`

