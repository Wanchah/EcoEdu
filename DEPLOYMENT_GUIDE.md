# 🚀 Deployment Guide - EcoEdu

## Step-by-Step Deployment Instructions

### Prerequisites
- GitHub account
- Render account (for backend)
- Vercel account (for frontend)
- MongoDB Atlas account (or use Render's MongoDB)

---

## 📦 Part 1: Prepare for GitHub

### 1. Initialize Git (if not already done)
```bash
cd ecoedu
git init
```

### 2. Add All Files
```bash
git add .
```

### 3. Create Initial Commit
```bash
git commit -m "Initial commit: EcoEdu MERN application with gamification features"
```

### 4. Create GitHub Repository
1. Go to GitHub.com
2. Click "New repository"
3. Name it: `ecoedu` (or your preferred name)
4. **Don't** initialize with README (we already have one)
5. Click "Create repository"

### 5. Connect and Push
```bash
git remote add origin https://github.com/YOUR_USERNAME/ecoedu.git
git branch -M main
git push -u origin main
```

---

## 🔧 Part 2: Deploy Backend to Render

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select the `ecoedu` repository

### Step 3: Configure Backend
- **Name**: `ecoedu-backend`
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free (or paid if needed)

### Step 4: Environment Variables
Add these in Render dashboard:

```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ecoedu?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
CLIENT_URL=https://your-frontend-url.vercel.app
CLOUDINARY_CLOUD_NAME=your-cloud-name (optional)
CLOUDINARY_API_KEY=your-api-key (optional)
CLOUDINARY_API_SECRET=your-api-secret (optional)
```

**Important**: 
- Generate JWT_SECRET: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- Get MONGO_URI from MongoDB Atlas
- CLIENT_URL will be your Vercel URL (add after frontend is deployed)

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Copy your backend URL (e.g., `https://ecoedu-backend.onrender.com`)

---

## 🎨 Part 3: Deploy Frontend to Vercel

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub

### Step 2: Import Project
1. Click "Add New" → "Project"
2. Import your `ecoedu` repository
3. Select the repository

### Step 3: Configure Frontend
- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 4: Environment Variables
Add in Vercel dashboard:

```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

**Important**: Use your Render backend URL from Part 2

### Step 5: Deploy
1. Click "Deploy"
2. Wait for deployment (2-3 minutes)
3. Copy your frontend URL (e.g., `https://ecoedu.vercel.app`)

### Step 6: Update Backend CORS
1. Go back to Render dashboard
2. Update `CLIENT_URL` environment variable to your Vercel URL
3. Redeploy backend (or it will auto-redeploy)

---

## 🗄️ Part 4: MongoDB Atlas Setup

### Step 1: Create Cluster
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Choose region closest to you

### Step 2: Create Database User
1. Go to "Database Access"
2. Add new user
3. Set username and password (save these!)
4. Set privileges: "Read and write to any database"

### Step 3: Whitelist IP
1. Go to "Network Access"
2. Add IP Address: `0.0.0.0/0` (allows all IPs - for Render)
3. Or add Render's IP ranges

### Step 4: Get Connection String
1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Copy connection string
4. Replace `<password>` with your database password
5. Replace `<dbname>` with `ecoedu`

### Step 5: Add to Render
1. Paste connection string in Render's `MONGO_URI` environment variable

---

## ✅ Part 5: Post-Deployment

### 1. Seed Challenges (Optional)
You can seed challenges by:
- Running locally and connecting to production DB
- Or creating a one-time script in Render

### 2. Test Your Deployment
- Visit your Vercel URL
- Try signing up
- Test all features
- Check browser console for errors

### 3. Update CORS
Make sure `CLIENT_URL` in Render matches your Vercel URL exactly.

---

## 🔍 Troubleshooting

### Backend Issues
- **Build fails**: Check Node version (should be 18+)
- **Can't connect to DB**: Verify MONGO_URI and IP whitelist
- **CORS errors**: Check CLIENT_URL matches frontend URL exactly

### Frontend Issues
- **API calls fail**: Verify VITE_API_URL is correct
- **Build fails**: Check for TypeScript errors or missing dependencies
- **Blank screen**: Check browser console for errors

### Common Fixes
1. **Clear browser cache**
2. **Check environment variables** are set correctly
3. **Verify URLs** have no trailing slashes
4. **Check Render logs** for backend errors
5. **Check Vercel logs** for frontend errors

---

## 📊 Monitoring

### Render
- View logs in Render dashboard
- Monitor uptime
- Check build logs

### Vercel
- View deployment logs
- Check function logs
- Monitor analytics

---

## 🔄 Updating Your App

### To Deploy Updates:
1. Make changes locally
2. Commit: `git add . && git commit -m "Your message"`
3. Push: `git push origin main`
4. Render and Vercel will auto-deploy!

---

## 🎉 Success!

Your app should now be live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`

Share your app with the world! 🌱✨

