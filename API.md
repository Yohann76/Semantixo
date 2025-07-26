## API

The backend provides a complete REST API with authentication and a **modular architecture**:

#### 🔐 **Authentication Routes** (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - User login
- `GET /me` - Get user profile (protected)
- `PUT /me` - Update user profile (protected)

#### 📊 **Modular Analysis Routes**

##### **Text SEO Analysis** (`/api/analysis-text-seo`)
- `POST /` - Create a new text SEO analysis (protected)
- `GET /` - Get user text analyses (protected)
- `GET /:id` - Get specific text analysis (protected)
- `DELETE /:id` - Delete text analysis (protected)
- `GET /stats` - Get text analysis statistics (protected)

##### **Page SEO Analysis** (`/api/analysis-page-seo`)
- `POST /` - Create a new page SEO analysis (protected)
- `GET /` - Get user page analyses (protected)
- `GET /:id` - Get specific page analysis (protected)
- `DELETE /:id` - Delete page analysis (protected)
- `GET /stats` - Get page analysis statistics (protected)

##### **Internal Link Analysis** (`/api/analysis-internal-link`)
- `POST /` - Create a new internal link analysis (protected)
- `GET /` - Get user internal link analyses (protected)
- `GET /:id` - Get specific internal link analysis (protected)
- `DELETE /:id` - Delete internal link analysis (protected)
- `GET /stats` - Get internal link analysis statistics (protected)

##### **Domain Analysis** (`/api/analysis-domain`)
- `POST /` - Create a new domain analysis (protected)
- `GET /` - Get user domain analyses (protected)
- `GET /:id` - Get specific domain analysis (protected)
- `DELETE /:id` - Delete domain analysis (protected)
- `GET /stats` - Get domain analysis statistics (protected)

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