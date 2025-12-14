# Udaan Flight Booking - Deployment Guide (Render + Vercel)

## 📋 Prerequisites

Before you start, you'll need:
- GitHub account (https://github.com)
- Render account (https://render.com)
- Vercel account (https://vercel.com)
- MongoDB Atlas account (https://mongodb.com/cloud/atlas)

---

## 🗄️ STEP 1: Set Up MongoDB Atlas (Database)

### 1.1 Create MongoDB Cluster
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or log in
3. Click **"Create"** → **"Create Deployment"**
4. Choose **Free M0** tier
5. Select your region (closest to your users)
6. Click **"Create Deployment"**

### 1.2 Create Database User
1. Go to **Database Access** → **Add New Database User**
2. Create username: `udaan_user`
3. Create password: `YourStrongPassword123!` (save this!)
4. Click **"Add User"**

### 1.3 Get Connection String
1. Go to **Databases** → Click **"Connect"** on your cluster
2. Select **"Drivers"** → **Node.js**
3. Copy the connection string:
   ```
   mongodb+srv://udaan_user:YourStrongPassword123!@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Replace `database` with `airplane_mgmt`
6. **Final URL**: 
   ```
   mongodb+srv://udaan_user:YourStrongPassword123!@cluster0.xxxxx.mongodb.net/airplane_mgmt
   ```

### 1.4 Configure Network Access
1. Go to **Network Access** → **Add IP Address**
2. Click **"Allow Access from Anywhere"** (for now)
3. Confirm

---

## 📤 STEP 2: Push Code to GitHub

### 2.1 Initialize Git Repository
```powershell
cd c:\Users\Acer\Downloads\Udaan-codebase
git init
git add .
git commit -m "Initial commit: Udaan flight booking application"
```

### 2.2 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `udaan-flight-booking`
3. Description: `Flight booking application with Render + Vercel`
4. Choose **Public** (so Render/Vercel can access)
5. Click **"Create repository"**

### 2.3 Push to GitHub
```powershell
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/udaan-flight-booking.git
git push -u origin main
```

---

## 🖥️ STEP 3: Deploy Backend to Render

### 3.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (easier!)
3. Authorize Render to access your GitHub repos

### 3.2 Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Select your `udaan-flight-booking` repository
3. Configure:
   - **Name**: `udaan-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node backend/server.js`
   - **Region**: Same as your MongoDB region (or closest)
4. Click **"Create Web Service"**

### 3.3 Add Environment Variables
While the deployment is starting, add these:

1. In Render dashboard, go to your service → **Environment**
2. Add variables:
   ```
   MONGO_URI=mongodb+srv://udaan_user:YourStrongPassword123!@cluster0.xxxxx.mongodb.net/airplane_mgmt
   JWT_SECRET=your_super_secret_key_12345_change_this
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

### 3.4 Wait for Deployment
- Render will build and deploy automatically
- Check **Logs** for any errors
- Once deployed, you'll get a URL like: `https://udaan-backend.onrender.com`
- **Copy this URL - you'll need it for the frontend!**

---

## 🌐 STEP 4: Deploy Frontend to Vercel

### 4.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel to access your GitHub repos

### 4.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. Select your `udaan-flight-booking` repository
3. Vercel will detect Vite automatically

### 4.3 Configure Project
1. **Framework Preset**: Vite
2. **Root Directory**: `frontend` (important!)
3. **Build Command**: `npm run build`
4. **Output Directory**: Leave as default

### 4.4 Add Environment Variables
1. Click **"Environment Variables"**
2. Add:
   ```
   Name: VITE_API_URL
   Value: https://udaan-backend.onrender.com/api
   ```
3. Click **"Add"**
4. Click **"Deploy"**

### 4.5 Wait for Deployment
- Vercel will build and deploy automatically
- Once done, you'll get a URL like: `https://udaan-flight-booking.vercel.app`
- Click to visit your live app!

---

## 🔄 STEP 5: Update Backend with Frontend URL

After Frontend is deployed:

1. Go back to **Render** → **udaan-backend**
2. Go to **Environment**
3. Update **FRONTEND_URL** to your Vercel URL:
   ```
   FRONTEND_URL=https://udaan-flight-booking.vercel.app
   ```
4. Redeploy (Render will auto-redeploy when you update env vars)

---

## ✅ Testing Your Deployment

### Test Backend
```
https://udaan-backend.onrender.com/api/flights
```
Should return JSON with flights

### Test Frontend
```
https://udaan-flight-booking.vercel.app
```
Should load your app with working search and bookings

---

## 🐛 Troubleshooting

### Issue: Frontend shows blank page
- Check browser console (F12 → Console tab)
- Verify `VITE_API_URL` is set correctly
- Verify backend URL is correct

### Issue: API calls fail
- Check Render logs for errors
- Verify MongoDB connection string is correct
- Make sure MongoDB IP whitelist is updated

### Issue: CORS errors
- Verify `FRONTEND_URL` matches your Vercel domain exactly
- Check backend CORS configuration

### Issue: Render app sleeps after 15 mins of inactivity
- This is normal on free tier
- Upgrade to **Render Pro** ($7/month) for always-on

---

## 💡 Pro Tips

1. **Auto-deploy**: Every git push will auto-deploy both services
2. **Monitor logs**: Check Render/Vercel logs if something breaks
3. **Update database**: Seed data and run migrations in MongoDB Atlas
4. **Custom domain**: Upgrade to add your own domain (udaan.com, etc.)

---

## 📝 Summary of URLs

After deployment, you'll have:

| Component | URL | Details |
|-----------|-----|---------|
| Backend API | `https://udaan-backend.onrender.com` | Your Express server |
| Frontend App | `https://udaan-flight-booking.vercel.app` | Your React app |
| Database | MongoDB Atlas cloud | No direct URL needed |

---

## 🚀 Next Steps

1. ✅ Set up MongoDB Atlas
2. ✅ Push to GitHub
3. ✅ Deploy backend to Render
4. ✅ Deploy frontend to Vercel
5. ✅ Test everything
6. 🎉 Share with friends!

Good luck! 🎊
