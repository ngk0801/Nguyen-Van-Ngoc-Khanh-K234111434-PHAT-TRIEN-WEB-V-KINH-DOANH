# Exercise 52-58: Fashion Web Development - Setup Guide

## Quick Start

### Prerequisites
- Node.js installed
- MongoDB running on localhost:27017
- Angular CLI installed

### Installation Steps

#### 1. Exercises 52-57 (Backend + Frontend)

```bash
# Terminal 1: Backend Server
cd exercises/my-server-mongodb
npm install
npm start
# Server runs on http://localhost:3002

# Terminal 2: Frontend App
cd exercises/my-app
npm install
npm start
# App runs on http://localhost:4200
```

#### 2. Exercise 58 (3 Applications)

```bash
# Terminal 1: REST API Server
cd exercises/ex58/server-fashion
npm install
npm start
# API runs on http://localhost:4000

# Terminal 2: Admin Dashboard
cd exercises/ex58/admin-fashion
npm install
npm start
# Admin runs on http://localhost:4201

# Terminal 3: Public Website
cd exercises/ex58/client-fashion
npm install
npm start
# Client runs on http://localhost:4202
```

## Exercise Overview

### Exercise 52: MongoDB Installation and Connection
- Install dependencies (express, mongodb, body-parser, cors, etc.)
- Create Express server with MongoDB connection
- Configure nodemon for auto-reload

### Exercise 53: Get All Fashions (HTTP GET)
- Create GET /fashions API
- Fetch all fashions from MongoDB
- Display results in Angular component with table

### Exercise 54: Get One Fashion (HTTP GET with ID)
- Create GET /fashions/:id API
- Fetch single fashion by ObjectId
- Display details in Angular detail component

### Exercise 55: Create Fashion (HTTP POST)
- Create POST /fashions API
- Handle Base64 image uploads
- Create Angular form for adding new fashions

### Exercise 56: Update Fashion (HTTP PUT)
- Create PUT /fashions API
- Update fashion fields in MongoDB
- Create edit form in Angular

### Exercise 57: Delete Fashion (HTTP DELETE)
- Create DELETE /fashions/:id API
- Remove fashion from database
- Add delete button with confirmation in Angular

### Exercise 58: Complete Fashion Management System
- **3 Separate Projects** for different purposes
- **server-fashion:** Advanced API with filtering and sorting
- **admin-fashion:** Complete admin panel for CRUD operations
- **client-fashion:** Public website with style-based browsing

## API Endpoints

### my-server-mongodb (Port 3002)
- `GET /` - Server status
- `GET /fashions` - List all
- `GET /fashions/:id` - Get one
- `POST /fashions` - Create
- `PUT /fashions` - Update
- `DELETE /fashions/:id` - Delete

### server-fashion (Port 4000)
- `GET /api/fashions` - List all (sorted)
- `GET /api/fashions/:id` - Get one
- `GET /api/fashions/filter/:style` - Filter by style
- `GET /api/styles` - Get all styles
- `POST /api/fashions` - Create
- `PUT /api/fashions` - Update
- `DELETE /api/fashions/:id` - Delete

## Database Schema

```javascript
{
  _id: ObjectId,
  title: String,
  style: String,
  detail: String,
  thumbnail: String (Base64),
  createdDate: Date,
  updatedDate: Date (optional)
}
```

## Important Notes

1. **Images:** Stored as Base64 strings in database
2. **Proxy:** Configure proxy.conf.json to forward requests
3. **MongoDB:** Must be running before starting servers
4. **Ports:** Change ports in package.json/index.js if conflicts occur
5. **CORS:** Enabled on all servers for cross-origin requests

## Useful Commands

```bash
# Create sample MongoDB data
mongosh
use FashionData
db.Fashion.insertMany([...])

# Test APIs with curl
curl http://localhost:3002/fashions
curl -X POST http://localhost:3002/fashions -H "Content-Type: application/json" -d '{...}'

# Check what's running on ports
netstat -tuln | grep LISTEN
```

## File Structure

```
exercises/
├── README.md                    # Main documentation
├── SETUP.md                     # This file
├── my-server-mongodb/
│   ├── package.json
│   ├── index.js                 # All APIs (52-57)
│   └── node_modules/
├── my-app/
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.module.ts
│   │   │   ├── app.component.*
│   │   │   ├── fashion-api.service.ts
│   │   │   ├── models/Fashion.ts
│   │   │   └── components/
│   │   │       ├── fashion/
│   │   │       ├── fashion-detail/
│   │   │       ├── fashion-new/
│   │   │       └── fashion-edit/
│   │   └── assets/
│   ├── proxy.conf.json
│   ├── package.json
│   └── angular.json
└── ex58/
    ├── server-fashion/
    │   ├── index.js             # Advanced APIs
    │   └── package.json
    ├── admin-fashion/
    │   ├── src/app/
    │   │   ├── services/
    │   │   ├── models/
    │   │   └── components/
    │   └── proxy.conf.json
    └── client-fashion/
        └── src/app/
```

## Next Steps

1. **Install all dependencies:** `npm install` in each project
2. **Start MongoDB:** Ensure it's running
3. **Run backend servers:** Follow Quick Start above
4. **Access applications:**
   - My-App: http://localhost:4200
   - Admin: http://localhost:4201
   - Store: http://localhost:4202
5. **Add sample data:** Insert fashions via APIs or MongoDB shell

## Debugging

- **Check MongoDB:** `mongosh` → `use FashionData` → `db.Fashion.find()`
- **Check ports:** `netstat -tuln | grep LISTEN` (Linux/Mac)
- **Check logs:** Look at terminal output for errors
- **Browser console:** F12 → Console tab for Angular errors
- **Network tab:** F12 → Network tab to inspect API calls

Happy Learning! 🎨
