# Project Installation & Configuration Checklist

## ✅ Pre-Installation Requirements

- [ ] Node.js (v14+) installed
- [ ] npm (v6+) installed
- [ ] MongoDB (v4.4+) installed and running
- [ ] Angular CLI installed: `npm install -g @angular/cli`
- [ ] Git installed (for version control)
- [ ] Code editor (VS Code recommended)

**Verify installations:**
```bash
node --version
npm --version
ng version
mongod --version
```

---

## ✅ MongoDB Setup

### Start MongoDB Service

**Windows:**
```cmd
mongod
# Or if installed as service: net start MongoDB
```

**Mac:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### Verify MongoDB is Running

```bash
# Open another terminal
mongosh
# Should connect successfully

# Create database and collection
use FashionData
db.createCollection("Fashion")
```

---

## ✅ Installation Steps

### Step 1: Install Backend Dependencies

```bash
cd exercises/my-server-mongodb
npm install
```

**Expected packages:**
- express
- mongodb
- body-parser
- cors
- morgan
- nodemon

### Step 2: Install Frontend Dependencies

```bash
cd exercises/my-app
npm install
```

**Expected packages:**
- @angular/core
- @angular/common
- @angular/forms
- rxjs

### Step 3: Exercise 58 Server Setup

```bash
cd exercises/ex58/server-fashion
npm install
```

### Step 4: Exercise 58 Admin Setup

```bash
cd exercises/ex58/admin-fashion
npm install
```

### Step 5: Exercise 58 Client Setup

```bash
cd exercises/ex58/client-fashion
npm install
```

---

## ✅ Configuration Verification

### Check Port Availability

**Windows:**
```cmd
netstat -ano | findstr :3002
netstat -ano | findstr :4000
netstat -ano | findstr :4200
```

**Mac/Linux:**
```bash
lsof -i :3002
lsof -i :4000
lsof -i :4200
```

### Verify Configuration Files

- [ ] `my-app/proxy.conf.json` exists and contains /fashions endpoint
- [ ] `ex58/admin-fashion/proxy.conf.json` exists
- [ ] `ex58/client-fashion/proxy.conf.json` exists
- [ ] All `package.json` files have correct scripts

### Check Angular Configuration

**my-app/angular.json:**
- [ ] Port 4200 configured
- [ ] proxy.conf.json configured

**ex58/admin-fashion/package.json:**
- [ ] start script: `ng serve --port 4201 --proxy-config proxy.conf.json`

**ex58/client-fashion/package.json:**
- [ ] start script: `ng serve --port 4202 --proxy-config proxy.conf.json`

---

## ✅ Starting Applications

### Terminal 1: MongoDB (Keep Running)
```bash
mongod
```

### Terminal 2: Backend API (my-server-mongodb)
```bash
cd exercises/my-server-mongodb
npm start
# Should see: "My Server listening on port 3002"
```

### Terminal 3: Frontend (my-app)
```bash
cd exercises/my-app
npm start
# Should see: "Compiled successfully"
# Access at http://localhost:4200
```

### Terminal 4: Server-Fashion API
```bash
cd exercises/ex58/server-fashion
npm start
# Should see: "Fashion Server listening on port 4000"
```

### Terminal 5: Admin Dashboard
```bash
cd exercises/ex58/admin-fashion
npm start
# Should see: "✔ Compiled successfully"
# Access at http://localhost:4201
```

### Terminal 6: Client Website
```bash
cd exercises/ex58/client-fashion
npm start
# Should see: "✔ Compiled successfully"
# Access at http://localhost:4202
```

---

## ✅ Application Access

| Application | URL | Port |
|-------------|-----|------|
| Frontend (My-App) | http://localhost:4200 | 4200 |
| Backend API | http://localhost:3002 | 3002 |
| Admin Dashboard | http://localhost:4201 | 4201 |
| Public Website | http://localhost:4202 | 4202 |
| Fashion API | http://localhost:4000 | 4000 |

---

## ✅ Testing APIs

### Using Curl (Command Line)

**Test my-server-mongodb:**
```bash
# Get all fashions
curl http://localhost:3002/fashions

# Create a fashion
curl -X POST http://localhost:3002/fashions \
  -H "Content-Type: application/json" \
  -d '{"style":"Casual","fashion_subject":"Test","fashion_detail":"Test details"}'
```

**Test server-fashion:**
```bash
# Get all fashions
curl http://localhost:4000/api/fashions

# Filter by style
curl http://localhost:4000/api/fashions/filter/Casual

# Get all styles
curl http://localhost:4000/api/styles
```

### Using Postman

1. Download [Postman](https://www.postman.com/)
2. Create a new request
3. Set method to GET
4. Enter URL: `http://localhost:3002/fashions`
5. Click Send
6. Should see JSON response

---

## ✅ Troubleshooting

### Port Already in Use

**If port 3002 is busy:**
```bash
# Edit exercises/my-server-mongodb/index.js
# Change: const port = 3002;
# To: const port = 3003;

# Update proxy.conf.json in my-app
# Change target to http://localhost:3003
```

### MongoDB Connection Failed

**Error: "connect ECONNREFUSED"**
```bash
# Start MongoDB
mongod

# Or if already running, check connection
mongosh
db.adminCommand('ping')
```

### Angular Compilation Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### API Calls Return 404

- [ ] Backend server is running
- [ ] Check proxy.conf.json configuration
- [ ] Verify API endpoints match
- [ ] Check browser console for errors (F12)

### CORS Errors

- [ ] CORS is enabled in all Express servers
- [ ] Check proxy.conf.json
- [ ] Restart all servers
- [ ] Clear browser cache (Ctrl+Shift+Delete)

---

## ✅ Sample Data Setup

### Insert Sample Data via MongoDB Shell

```bash
mongosh
use FashionData

db.Fashion.insertMany([
  {
    title: "Summer Dress",
    style: "Casual",
    detail: "Light and comfortable summer dress",
    thumbnail: null,
    createdDate: new Date()
  },
  {
    title: "Business Suit",
    style: "Formal",
    detail: "Professional business suit for meetings",
    thumbnail: null,
    createdDate: new Date()
  },
  {
    title: "Sports Shorts",
    style: "Sports",
    detail: "Breathable shorts for athletic activities",
    thumbnail: null,
    createdDate: new Date()
  }
])

# Verify insertion
db.Fashion.find()
```

---

## ✅ Health Check

Run this checklist to verify everything is set up correctly:

```bash
# 1. Check Node.js
node --version
# Expected: v14.0.0 or higher

# 2. Check npm
npm --version
# Expected: v6.0.0 or higher

# 3. Check MongoDB connection
mongosh
# Should connect successfully

# 4. Check backend server
curl http://localhost:3002/
# Expected: "This Web server is processed for MongoDB"

# 5. Check API call
curl http://localhost:3002/fashions
# Expected: JSON array (may be empty if no data)

# 6. Check frontend
# Open browser to http://localhost:4200
# Should see Fashion app loaded
```

---

## ✅ Performance Optimization

### For Development:

1. **Use Chrome DevTools** for debugging (F12)
2. **Enable Source Maps** for easier debugging
3. **Use Angular DevTools** browser extension
4. **Monitor Network Tab** for API calls

### For Production:

```bash
# Build optimized production bundle
ng build --prod

# Or for specific projects
cd exercises/my-app
ng build --prod
# Creates dist/ folder with optimized files
```

---

## ✅ Useful Commands Reference

| Command | Purpose |
|---------|---------|
| `npm start` | Start backend/frontend with nodemon/ng serve |
| `npm install` | Install dependencies |
| `ng serve` | Start Angular dev server |
| `ng build` | Build Angular production bundle |
| `mongod` | Start MongoDB server |
| `mongosh` | Open MongoDB shell |
| `npm list` | List installed packages |
| `clear` | Clear terminal |

---

## ✅ Next Steps After Setup

1. ✅ Verify all services are running
2. ✅ Add sample data to MongoDB
3. ✅ Test all API endpoints
4. ✅ Access web applications
5. ✅ Add fashion items through the UI
6. ✅ Test filtering and search features
7. ✅ Explore admin and client interfaces

---

## 📞 Support & Help

If you encounter issues:

1. **Check console logs** for error messages
2. **Verify all ports are available** (netstat)
3. **Ensure MongoDB is running** (mongosh)
4. **Check internet connection** for CDN resources
5. **Clear browser cache** (Ctrl+Shift+Delete)
6. **Reinstall node_modules** if nothing works

---

**Setup Complete! Happy Coding! 🚀**
