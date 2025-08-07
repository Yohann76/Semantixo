## List of API endpoint 

The backend provides a complete REST API with authentication and a **modular architecture**:

#### 🔐 **Authentication Routes** (`/api/auth`)
- `POST /register` - Register a new user (TODO: testing)
- `POST /login` - User login (TODO: testing)
- `GET /me` - Get user profile (protected)(TODO: testing)
- `PUT /me` - Update user profile (protected)(TODO: testing)

#### 📊 **Modular Analysis Routes**

##### **Text SEO Analysis** (`/api/analysis-text-seo`)
- `POST /` - Create a new text SEO analysis (protected)(TODO: testing)
- `GET /` - Get user text analyses (protected)(TODO: testing)
- `GET /:id` - Get specific text analysis (protected)(TODO: testing)
- `DELETE /:id` - Delete text analysis (protected)(TODO: testing)
- `GET /stats` - Get text analysis statistics (protected)(TODO: testing)
- `GET /api/analysis-text-seo/bareme/config` - Get Barem


##### **Page SEO Analysis** (`/api/analysis-page-seo`)
- `POST /` - Create a new page SEO analysis (protected)(TODO: testing)
- `GET /` - Get user page analyses (protected)(TODO: testing)
- `GET /:id` - Get specific page analysis (protected)(TODO: testing)
- `DELETE /:id` - Delete page analysis (protected)(TODO: testing)
- `GET /stats` - Get page analysis statistics (protected)(TODO: testing)

##### **Internal Link Analysis** (`/api/analysis-internal-link`)
- `POST /` - Create a new internal link analysis (protected)(TODO: testing)
- `GET /` - Get user internal link analyses (protected)(TODO: testing)
- `GET /:id` - Get specific internal link analysis (protected)(TODO: testing)
- `DELETE /:id` - Delete internal link analysis (protected)(TODO: testing)
- `GET /stats` - Get internal link analysis statistics (protected)(TODO: testing)

##### **Domain Analysis** (`/api/analysis-domain`)
- `POST /` - Create a new domain analysis (protected)(TODO: testing)
- `GET /` - Get user domain analyses (protected)(TODO: testing)
- `GET /:id` - Get specific domain analysis (protected)(TODO: testing)
- `DELETE /:id` - Delete domain analysis (protected)(TODO: testing)
- `GET /stats` - Get domain analysis statistics (protected)(TODO: testing)

#### 👨‍💼 **Admin Routes** (`/api/admin`) - Admin only
- `GET /users` - Get all users (TODO: testing)
- `GET /users/:id` - Get specific user (TODO: testing)
- `PUT /users/:id/role` - Update user role (TODO: testing)
- `DELETE /users/:id` - Delete user (TODO: testing)
- `GET /stats` - Get user statistics (TODO: testing)

#### 🧪 **Test Routes**
- `GET /` - API information (TODO: testing)
- `GET /api/test` - API test (TODO: testing)
- `GET /api/hello/:name` - Test with parameter (TODO: testing)

#### 🧪 **Config Routes**
- `GET /api/blacklist` (???)(TODO: testing)
