# Quick Reference Guide - Exercises 52-58

## Project Structure at a Glance

```
exercises/
├── my-server-mongodb/      ← Exercises 52-57 Backend (Port 3002)
├── my-app/                 ← Exercises 52-57 Frontend (Port 4200)
└── ex58/
    ├── server-fashion/     ← Exercise 58 API (Port 4000)
    ├── admin-fashion/      ← Exercise 58 Admin Panel (Port 4201)
    └── client-fashion/     ← Exercise 58 Public Website (Port 4202)
```

## Quick Start (Copy & Paste)

### Terminal 1: MongoDB
```bash
mongod
```

### Terminal 2: Backend (52-57)
```bash
cd exercises/my-server-mongodb
npm install
npm start
```

### Terminal 3: Frontend (52-57)
```bash
cd exercises/my-app
npm install
npm start
```

### Terminal 4: Server-Fashion API
```bash
cd exercises/ex58/server-fashion
npm install
npm start
```

### Terminal 5: Admin Dashboard
```bash
cd exercises/ex58/admin-fashion
npm install
npm start
```

### Terminal 6: Public Website
```bash
cd exercises/ex58/client-fashion
npm install
npm start
```

## Access URLs

| Application | URL |
|-------------|-----|
| My-App | http://localhost:4200 |
| Admin Panel | http://localhost:4201 |
| Public Website | http://localhost:4202 |

## Test APIs with Curl

```bash
# Get all fashions
curl http://localhost:3002/fashions
curl http://localhost:4000/api/fashions

# Create fashion
curl -X POST http://localhost:3002/fashions \
  -H "Content-Type: application/json" \
  -d '{"style":"Casual","fashion_subject":"Test","fashion_detail":"Test"}'

# Get one
curl http://localhost:3002/fashions/[ID]

# Update
curl -X PUT http://localhost:3002/fashions \
  -H "Content-Type: application/json" \
  -d '{"_id":"[ID]","style":"Updated"}'

# Delete
curl -X DELETE http://localhost:3002/fashions/[ID]
```

## MongoDB Commands

```bash
# Connect
mongosh

# Select database
use FashionData

# View fashions
db.Fashion.find()

# Insert sample
db.Fashion.insertOne({
  title: "Sample",
  style: "Casual",
  detail: "Sample fashion",
  thumbnail: null,
  createdDate: new Date()
})

# Count documents
db.Fashion.countDocuments()

# Delete all
db.Fashion.deleteMany({})
```

## File Locations

### Backend Files
- my-server-mongodb/index.js (Exercises 52-57 APIs)
- ex58/server-fashion/index.js (Advanced APIs)

### Frontend Service Files
- my-app/src/app/fashion-api.service.ts
- ex58/admin-fashion/src/app/services/fashion.service.ts
- ex58/client-fashion/src/app/services/fashion.service.ts

### Component Files
- my-app/src/app/components/ (fashion, fashion-detail, fashion-new, fashion-edit)
- ex58/admin-fashion/src/app/components/ (fashion-list, fashion-form)
- ex58/client-fashion/src/app/components/ (fashion-browse, fashion-detail)

## Important Ports

| Service | Port |
|---------|------|
| MongoDB | 27017 |
| my-server-mongodb | 3002 |
| my-app (Angular) | 4200 |
| server-fashion | 4000 |
| admin-fashion (Angular) | 4201 |
| client-fashion (Angular) | 4202 |

## Key Files to Understand

1. **Backend Logic**: `my-server-mongodb/index.js` - All CRUD APIs
2. **Frontend Service**: `my-app/src/app/fashion-api.service.ts` - HTTP calls
3. **Admin Interface**: `ex58/admin-fashion/src/app/components/fashion-list/`
4. **Public Interface**: `ex58/client-fashion/src/app/components/fashion-browse/`

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Port already in use | Change port in index.js or angular.json |
| MongoDB connection failed | Run `mongod` in another terminal |
| Module not found | Run `npm install` in the project directory |
| CORS error | Check proxy.conf.json configuration |
| Angular build error | Delete node_modules and run `npm install` again |

## Documentation Files

- **README.md** - Complete project overview
- **SETUP.md** - Step-by-step setup guide
- **SETUP_CHECKLIST.md** - Detailed checklist with troubleshooting
- **IMPLEMENTATION_SUMMARY.md** - What was created and why

## API Endpoints Summary

### my-server-mongodb (Port 3002)
```
GET  /fashions
GET  /fashions/:id
POST /fashions
PUT  /fashions
DELETE /fashions/:id
```

### server-fashion (Port 4000)
```
GET  /api/fashions
GET  /api/fashions/:id
GET  /api/fashions/filter/:style
GET  /api/styles
POST /api/fashions
PUT  /api/fashions
DELETE /api/fashions/:id
```

## Angular Routes (if implemented)

- /fashions - List view
- /fashions/:id - Detail view
- /fashions/new - Create form
- /fashions/:id/edit - Edit form

## Database Schema

```javascript
{
  _id: ObjectId,        // Auto-generated
  title: String,        // Fashion name
  style: String,        // Style category
  detail: String,       // Description
  thumbnail: String,    // Base64 image
  createdDate: Date,    // Creation timestamp
  updatedDate: Date     // Optional update timestamp
}
```

## ENV/Config Files

| File | Purpose |
|------|---------|
| proxy.conf.json | Routes API calls to backend |
| package.json | Dependencies and scripts |
| angular.json | Angular configuration |
| tsconfig.json | TypeScript configuration |

## Installation Commands Cheat Sheet

```bash
# Install all projects at once
for dir in my-server-mongodb my-app ex58/server-fashion ex58/admin-fashion ex58/client-fashion; do
  cd exercises/$dir
  npm install
  cd ../..
done
```

## Build for Production

```bash
# Build my-app
cd exercises/my-app
ng build --prod
# Creates dist/my-app/ folder

# Build admin-fashion
cd exercises/ex58/admin-fashion
ng build --prod

# Build client-fashion
cd exercises/ex58/client-fashion
ng build --prod
```

## Useful npm Commands

```bash
npm start          # Start with nodemon (backend) or ng serve (frontend)
npm install        # Install dependencies
npm list           # List installed packages
npm update         # Update packages
npm prune          # Remove unused packages
npm cache clean    # Clear cache
npm dedupe         # Deduplicate packages
```

## Next Steps After Setup

1. ✅ Access http://localhost:4200 (my-app)
2. ✅ Add sample fashions through "Add Fashion" button
3. ✅ Explore list, detail, edit, delete features
4. ✅ Access http://localhost:4201 (admin panel)
5. ✅ Test admin CRUD operations
6. ✅ Access http://localhost:4202 (public website)
7. ✅ Browse fashions by style
8. ✅ View fashion details in modal

## Additional Resources

- MongoDB Docs: https://docs.mongodb.com/
- Express Docs: https://expressjs.com/
- Angular Docs: https://angular.io/
- RESTful API: https://restfulapi.net/

## Version Info

- Node.js: v14+ recommended
- npm: v6+ recommended
- Angular: 15.2.0
- MongoDB: 4.4+
- Express: 4.18.2

## Quick Debugging

```bash
# Check if port is in use
netstat -tuln | grep LISTEN

# Check MongoDB
mongosh ping

# Check Node version
node --version

# Clear Angular cache
ng cache clean
rm -rf node_modules package-lock.json
npm install
```

---

**Remember:** Always start MongoDB first, then backends, then frontends in separate terminals!

For detailed information, see the documentation files in the exercises/ folder.
