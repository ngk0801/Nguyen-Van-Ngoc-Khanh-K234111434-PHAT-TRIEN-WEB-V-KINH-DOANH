# Fashion Web Development Project - Exercises 52-58

This project implements a complete Fashion Management System with MongoDB backend, Node.js REST API, and Angular frontend applications.

## Project Structure

```
exercises/
├── my-server-mongodb/          # Express API for Exercises 52-57 (Port 3002)
├── my-app/                     # Angular Frontend for Exercises 52-57
└── ex58/
    ├── server-fashion/         # Fashion REST API (Port 4000)
    ├── admin-fashion/          # Admin Panel for Fashion Management (Port 4201)
    └── client-fashion/         # Public Fashion Store (Port 4202)
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (v4.4 or higher) running on localhost:27017
- Angular CLI (v15 or higher)

## Installation & Setup

### 1. MongoDB Setup

Before running any applications, ensure MongoDB is installed and running:

```bash
# Windows - Start MongoDB service
mongod

# Or if MongoDB is installed as a service, verify it's running
```

### 2. Exercises 52-57: My-Server-MongoDB + My-App

#### 2.1 Backend Setup (my-server-mongodb)

```bash
cd exercises/my-server-mongodb
npm install
npm start
```

The server will run on **http://localhost:3002**

**Available APIs:**
- `GET /fashions` - Get all fashions
- `GET /fashions/:id` - Get a single fashion by ID
- `POST /fashions` - Create a new fashion
- `PUT /fashions` - Update a fashion
- `DELETE /fashions/:id` - Delete a fashion

#### 2.2 Frontend Setup (my-app)

```bash
cd exercises/my-app
npm install
npm start
```

The application will run on **http://localhost:4200**

**Proxy Configuration:** The app proxies API calls to localhost:3002 via proxy.conf.json

### 3. Exercise 58: Fashion Management System

#### 3.1 Server-Fashion (REST API) - Port 4000

```bash
cd exercises/ex58/server-fashion
npm install
npm start
```

**Available APIs:**
- `GET /api/fashions` - Get all fashions (sorted by creation date, descending)
- `GET /api/fashions/:id` - Get a fashion by ID
- `GET /api/fashions/filter/:style` - Filter fashions by style
- `GET /api/styles` - Get all available styles
- `POST /api/fashions` - Create a new fashion
- `PUT /api/fashions` - Update a fashion
- `DELETE /api/fashions/:id` - Delete a fashion

#### 3.2 Admin-Fashion (Admin Panel) - Port 4201

```bash
cd exercises/ex58/admin-fashion
npm install
npm start
```

**Features:**
- View all fashions in a table format
- Add new fashions
- Edit existing fashions
- Delete fashions (with confirmation)
- Filter fashions by style
- Image upload for fashion thumbnails

#### 3.3 Client-Fashion (Public Website) - Port 4202

```bash
cd exercises/ex58/client-fashion
npm install
npm start
```

**Features:**
- Browse fashions grouped by style
- View fashion details in a modal
- Filter fashions by style from dropdown
- Responsive design
- Beautiful gradient UI

## MongoDB Database Setup

### Create Sample Data

Open MongoDB shell and run:

```javascript
// Switch to FashionData database
use FashionData

// Create Fashion collection with sample data
db.Fashion.insertMany([
  {
    title: "Summer T-Shirt",
    style: "Casual",
    detail: "Comfortable cotton t-shirt perfect for summer",
    thumbnail: "data:image/jpeg;base64,...",  // Base64 encoded image
    createdDate: new Date()
  },
  {
    title: "Formal Blazer",
    style: "Formal",
    detail: "Professional blazer for business meetings",
    thumbnail: "data:image/jpeg;base64,...",
    createdDate: new Date()
  },
  {
    title: "Sports Jersey",
    style: "Sports",
    detail: "Breathable sports wear for active lifestyle",
    thumbnail: "data:image/jpeg;base64,...",
    createdDate: new Date()
  }
  // Add more items as needed
])
```

## Testing with Postman

### 1. Test my-server-mongodb APIs

```
GET http://localhost:3002/fashions
POST http://localhost:3002/fashions
Body (JSON):
{
  "style": "Casual",
  "fashion_subject": "Summer Dress",
  "fashion_detail": "Light and breathable",
  "fashion_image": "base64_encoded_image_string"
}

GET http://localhost:3002/fashions/{id}
PUT http://localhost:3002/fashions
DELETE http://localhost:3002/fashions/{id}
```

### 2. Test server-fashion APIs

```
GET http://localhost:4000/api/fashions
GET http://localhost:4000/api/fashions/{id}
GET http://localhost:4000/api/fashions/filter/Casual
GET http://localhost:4000/api/styles
POST http://localhost:4000/api/fashions
PUT http://localhost:4000/api/fashions
DELETE http://localhost:4000/api/fashions/{id}
```

## Running All Services Simultaneously

Create a script to run all services in separate terminals (or use a tool like concurrently):

**start-all.sh (Mac/Linux):**
```bash
#!/bin/bash
cd exercises/my-server-mongodb && npm start &
cd exercises/my-app && npm start &
cd exercises/ex58/server-fashion && npm start &
cd exercises/ex58/admin-fashion && npm start &
cd exercises/ex58/client-fashion && npm start &
```

## Features Summary

### My-Server-MongoDB & My-App (Exercises 52-57)
- Basic CRUD operations for fashions
- RESTful API with Express
- Angular components for list, detail, create, and edit
- File upload with base64 image conversion

### Server-Fashion (Exercise 58 Backend)
- Advanced filtering by style
- Sorting by creation date
- Get all distinct styles
- Enhanced error handling
- Sorted responses

### Admin-Fashion (Exercise 58 Admin)
- Complete admin interface
- Modal-based form for add/edit
- Style filtering dropdown
- Delete confirmation dialog
- Responsive table layout
- Image preview

### Client-Fashion (Exercise 58 Public)
- Grid layout for fashion cards
- Fashions grouped by style
- Modal detail view
- Style-based filtering
- Responsive design
- Beautiful gradient UI

## Troubleshooting

### Port Already in Use
If ports are already in use, modify the port numbers in:
- `my-server-mongodb/index.js` - Change port 3002
- `ex58/server-fashion/index.js` - Change port 4000
- `my-app/angular.json` - Change serve port
- `ex58/admin-fashion/angular.json` - Change serve port
- `ex58/client-fashion/angular.json` - Change serve port

### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod`
- Check connection string in index.js files
- Replace `localhost` with `127.0.0.1` if needed

### Angular Build Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
ng serve --port 4200
```

### CORS Issues
CORS is configured in all Express servers. If issues persist:
- Check proxy configuration in Angular apps
- Verify API URLs in service files

## Learning Objectives

- **Express.js:** REST API development with Node.js
- **MongoDB:** Database design and CRUD operations
- **Angular:** Frontend development with components, services, routing
- **HTTP Communication:** RESTful API calls with HttpClient
- **Forms:** Reactive and template-driven forms
- **Image Handling:** Base64 encoding/decoding for images
- **UI/UX:** Responsive design and user interface design

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Angular Documentation](https://angular.io/docs)
- [RESTful API Best Practices](https://restfulapi.net/)

## Author

Course: Advanced Business Web Development
Created for: Tran Duy Thanh Course

## License

ISC
