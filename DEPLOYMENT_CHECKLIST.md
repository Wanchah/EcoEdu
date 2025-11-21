# 🚀 Deployment Checklist for EcoEdu

## 🔒 Critical Security Issues to Fix

### 1. **Environment Variables** ⚠️ CRITICAL
- [ ] **JWT_SECRET**: Currently has a fallback default. **MUST** be set in production
- [ ] **MONGO_URI**: Must use MongoDB Atlas connection string in production
- [ ] **CLIENT_URL**: Must match your frontend domain exactly
- [ ] Create `.env` file in backend with all required variables
- [ ] Never commit `.env` files to git (already in `.gitignore`)

### 2. **Rate Limiting** ⚠️ IMPORTANT
- [ ] Add rate limiting to `/api/auth/*` routes to prevent brute force attacks
- [ ] Add rate limiting to `/api/progress` and `/api/reports` routes

### 3. **Input Validation** ⚠️ IMPORTANT
- [ ] Add email validation
- [ ] Add password strength requirements
- [ ] Add input sanitization for user inputs
- [ ] Validate file uploads (type, size)

### 4. **Error Handling**
- [ ] Don't expose internal error messages to clients in production
- [ ] Add proper error logging
- [ ] Implement error tracking (e.g., Sentry)

### 5. **Security Headers**
- [ ] Add Helmet.js for security headers
- [ ] Configure CORS properly for production
- [ ] Add HTTPS enforcement

## 📋 Pre-Deployment Tasks

### Backend Setup
1. **Install Production Dependencies**
   ```bash
   cd backend
   npm install --production
   ```

2. **Set Environment Variables**
   Create `backend/.env`:
   ```env
   NODE_ENV=production
   PORT=5000
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecoedu
   JWT_SECRET=<generate-strong-random-string>
   CLIENT_URL=https://your-frontend-domain.com
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

3. **Generate JWT Secret**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

### Frontend Setup
1. **Build for Production**
   ```bash
   cd frontend
   npm run build
   ```

2. **Set Environment Variables**
   Create `frontend/.env.production`:
   ```env
   VITE_API_URL=https://your-backend-domain.com/api
   ```

3. **Test Build Locally**
   ```bash
   npm run preview
   ```

## 🗄️ Database Setup

1. **MongoDB Atlas**
   - [ ] Create production cluster
   - [ ] Set up database user with read/write permissions
   - [ ] Whitelist your server IP addresses
   - [ ] Enable backup/restore
   - [ ] Set up connection string with retryWrites

2. **Database Indexes**
   - [ ] Add indexes on frequently queried fields:
     - `User.email` (unique)
     - `Report.reporter`
     - `Progress.userId` (unique)
     - `Comments.reportId`

## 🔧 Production Optimizations

### Backend
- [ ] Enable compression (gzip)
- [ ] Set up proper logging (Winston, Pino)
- [ ] Configure request timeout
- [ ] Set up process manager (PM2)
- [ ] Configure reverse proxy (Nginx)

### Frontend
- [ ] Enable code splitting
- [ ] Optimize images
- [ ] Add service worker for caching
- [ ] Minify and compress assets
- [ ] Set up CDN for static assets

## 📊 Monitoring & Logging

- [ ] Set up application monitoring (e.g., PM2, New Relic)
- [ ] Configure error tracking (Sentry, Rollbar)
- [ ] Set up uptime monitoring
- [ ] Configure log aggregation
- [ ] Set up database monitoring

## 🧪 Testing Before Deployment

- [ ] Test all API endpoints
- [ ] Test authentication flow
- [ ] Test file uploads
- [ ] Test real-time features (Socket.io)
- [ ] Test on mobile devices
- [ ] Load testing (if expected traffic)
- [ ] Security testing (OWASP Top 10)

## 🌐 Deployment Platforms

### Backend Options
- **Heroku**: Easy setup, auto-scaling
- **Railway**: Simple deployment
- **Render**: Free tier available
- **DigitalOcean App Platform**: Good performance
- **AWS/Google Cloud/Azure**: Enterprise-grade

### Frontend Options
- **Vercel**: Excellent for React apps
- **Netlify**: Great CDN and deployment
- **Cloudflare Pages**: Fast global CDN
- **AWS S3 + CloudFront**: Scalable solution

## 📝 Post-Deployment

- [ ] Verify all environment variables are set
- [ ] Test production endpoints
- [ ] Monitor error logs
- [ ] Set up automated backups
- [ ] Configure domain and SSL certificates
- [ ] Set up redirects (HTTP → HTTPS)
- [ ] Test CORS configuration
- [ ] Verify file uploads work
- [ ] Test real-time features

## 🔐 Security Best Practices

1. **Never commit secrets** to version control
2. **Use HTTPS** everywhere
3. **Rotate JWT secrets** periodically
4. **Keep dependencies updated** (`npm audit`)
5. **Use strong passwords** for database
6. **Enable MongoDB authentication**
7. **Restrict database access** by IP
8. **Regular security audits**

## 📚 Additional Resources

- [MongoDB Atlas Security](https://www.mongodb.com/docs/atlas/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

