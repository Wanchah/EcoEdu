Here’s your improved **README** with the final deployment link added in a clear, professional way. I’ve placed the live site URL prominently at the top under the project title, and also referenced it again in the **Deployment** section for clarity.  

---

```markdown
# 🌱 EcoEdu - Community Environmental Education Platform  

A full-stack MERN application for community environmental education, reporting, and engagement.  

🌐 **Live Demo:** [https://eco-edu.vercel.app](https://eco-edu.vercel.app)  

## ✨ Features  

- 📝 **Environmental Reporting** - Report and track environmental issues in your community  
- 🗺️ **Interactive Maps** - View reports on an interactive map with routing  
- 📚 **Learning Hub** - Complete lessons and track your progress  
- 🏆 **Gamification** - Earn points, badges, and compete on leaderboards  
- 🎯 **Daily Tasks** - Complete daily challenges for bonus points  
- 📊 **Impact Dashboard** - See community-wide environmental impact  
- 💬 **Real-time Updates** - Socket.io for live notifications  
- 🔐 **Secure Authentication** - JWT-based auth with role-based access  

## 🚀 Tech Stack  

### Frontend  
- React 18  
- Vite  
- React Router  
- Framer Motion  
- Leaflet Maps  
- Socket.io Client  
- Axios  

### Backend  
- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- Socket.io  
- JWT Authentication  
- Multer (File uploads)  
- Cloudinary (Image hosting)  

## 📦 Installation  

### Prerequisites  
- Node.js (v18+)  
- MongoDB (local or Atlas)  
- npm or yarn  

### Setup  

1. **Clone the repository**  
```bash
git clone <your-repo-url>
cd ecoedu
```

2. **Backend Setup**  
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

3. **Frontend Setup**  
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

4. **Seed Challenges (Optional)**  
```bash
cd backend
npm run seed:challenges
```

## 🔧 Environment Variables  

### Backend (.env)  
```env
NODE_ENV=production
PORT=5000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
CLIENT_URL=https://eco-edu.vercel.app
CLOUDINARY_CLOUD_NAME=your-cloud-name (optional)
CLOUDINARY_API_KEY=your-api-key (optional)
CLOUDINARY_API_SECRET=your-api-secret (optional)
```

### Frontend (.env)  
```env
VITE_API_URL=https://your-backend-url.com/api
```

## 🌐 Deployment  

### Backend (Render)  
1. Connect your GitHub repository  
2. Set build command: `npm install`  
3. Set start command: `npm start`  
4. Add environment variables in Render dashboard  
5. Deploy!  

### Frontend (Vercel)  
1. Import your GitHub repository  
2. Set framework preset: Vite  
3. Add environment variables  
4. Deploy!  

✅ **Live Site:** [https://eco-edu.vercel.app](https://eco-edu.vercel.app)  

See `DEPLOYMENT_CHECKLIST.md` for detailed deployment instructions.  

## 📚 API Endpoints  

- `POST /api/auth/signup` - User registration  
- `POST /api/auth/login` - User login  
- `GET /api/reports` - Get all reports  
- `POST /api/reports` - Create a report  
- `GET /api/progress` - Get user progress  
- `POST /api/progress` - Save progress  
- `GET /api/stats/leaderboard` - Get leaderboard  
- `GET /api/stats/impact` - Get community impact  
- `GET /api/daily-tasks` - Get daily tasks  

## 🎯 Features in Detail  

### Points System  
- Submit report: +10 points  
- Complete lesson: +15 points  
- Post comment: +5 points  
- Report resolved: +20 points  

### Badges  
- First Steps (10+ points)  
- Eco Warrior (50+ points)  
- Green Champion (100+ points)  
- Report Master (10+ reports)  
- Knowledge Seeker (5+ lessons)  
- And more!  

## 📝 License  

MIT License  

## 👥 Contributors  

Wanchah  

## 🙏 Acknowledgments  

Built with ❤️ for environmental education and community engagement.  
```