# Semantixo Project 

This project is a text SEO analysis application with a complete frontend/backend architecture including user authentication and MongoDB database.

## 🚀 Features

- **Homepage** with "Hello World" message
- **Interactive API tests** from the frontend
- **Modern and responsive interface** with navigation
- **User authentication** (registration/login)
- **Text SEO analysis** with database storage
- **Complete REST API** with JWT
- **MongoDB database** with Mongoose

## 🛠️ Architecture

### Backend - Node.js (Express + MongoDB)

The backend provides a complete REST API with authentication:

#### 🔐 **Authentication Routes** (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - User login
- `GET /me` - Get user profile (protected)
- `PUT /me` - Update user profile (protected)

#### 📊 **SEO Analysis Routes** (`/api/analysis`)
- `POST /` - Create a new SEO analysis (protected)
- `GET /` - Get user analyses (protected)
- `GET /:id` - Get specific analysis (protected)
- `DELETE /:id` - Delete analysis (protected)

#### 👨‍💼 **Admin Routes** (`/api/admin`) - Admin only
- `GET /users` - Get all users
- `GET /users/:id` - Get specific user
- `PUT /users/:id/role` - Update user role
- `DELETE /users/:id` - Delete user
- `GET /stats` - Get user statistics

#### 🧪 **Test Routes**
- `GET /` - API information
- `GET /api/test` - API test
- `GET /api/hello/:name` - Test with parameter

#### Installation and startup

```bash
cd backend 
npm install
node index.js
```

The API will be available at: http://localhost:3000

### Frontend - Vue.js

Modern user interface with:
- **Fixed navigation** with menu and authentication
- **Homepage** with API tests
- **SEO analysis page** with analysis form
- **Integrated authentication**
- **Responsive and modern design**

#### Installation and startup

```bash
cd frontend
npm install
npm run serve
```

The application will be available at: http://localhost:8081/

## 🗄️ MongoDB Database

### Configuration
- **Local database**: `mongodb://localhost:27017/semantixo`
- **Models**: User, Analysis
- **ODM**: Mongoose

### Data Models

#### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'member' | 'admin' (default: 'member'),
  subscription: 'free' | 'premium',
  analysesCount: Number,
  lastLogin: Date,
  timestamps
}
```

#### Analysis
```javascript
{
  userId: ObjectId,
  text: String,
  seoScore: Number,
  metrics: {
    wordCount: Number,
    characterCount: Number,
    keywordDensity: Number,
    readabilityScore: Number
  },
  keywords: Array,
  suggestions: Array,
  status: 'pending' | 'completed' | 'failed',
  processingTime: Number,
  timestamps
}
```

## 🔐 Authentication & Authorization

- **JWT** (JSON Web Tokens) for authentication
- **Bcrypt** for password hashing
- **Role-based access control** (Member/Admin)
- **Protection middleware** for private routes
- **Complete error handling**

## 📁 Project Structure

```
Semantixo/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication controller
│   │   └── analysisController.js # Analysis controller
│   ├── middleware/
│   │   └── auth.js              # JWT middleware
│   ├── models/
│   │   ├── User.js              # User model
│   │   └── Analysis.js          # Analysis model
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   └── analysis.js          # Analysis routes
│   ├── config.env               # Environment variables
│   ├── index.js                 # Main server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.vue         # Homepage
│   │   │   ├── Navbar.vue       # Navigation
│   │   │   └── VerifyText.vue   # Analysis page
│   │   ├── router/
│   │   │   └── index.js         # Vue Router configuration
│   │   ├── App.vue              # Main component
│   │   └── main.js              # Entry point
│   └── package.json
└── README.md
```

## 🔧 Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin request handling

### Frontend
- **Vue.js 3** - JavaScript framework
- **Vue Router** - Client-side routing
- **Fetch API** - HTTP requests
- **CSS3** - Styling with gradients and animations

## 🚀 Quick Start

1. **Install MongoDB** locally or use MongoDB Atlas
2. **Configure environment variables** in `backend/config.env`
3. **Create admin user**: `cd backend && node scripts/createAdmin.js`
4. **Start the backend**: `cd backend && node index.js`
5. **Start the frontend**: `cd frontend && npm run serve`
6. **Access the application**: http://localhost:8081/

## 🚀 Quick Start with Docker (recommended)

1. **Install Docker Desktop**: https://www.docker.com/products/docker-desktop
2. Open a terminal in the project folder
3. Run the command:

```bash
docker-compose up -d
docker-compose up -d --build
```

- The frontend will be accessible at: http://localhost:8081
- The backend API at: http://localhost:3000
- MongoDB at: localhost:27017

To stop all services:

```bash
docker-compose down
```

## 📝 Development Notes

- Free users are limited to 10 analyses
- SEO analysis includes: word count, keyword density, readability score
- All analysis routes require authentication
- Passwords are hashed with bcrypt (salt: 12)
