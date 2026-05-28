# 🐕 DogVaathi - MERN Stack Application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/Dhodduraaj/DogVaathi-Mern?style=social)](https://github.com/Dhodduraaj/DogVaathi-Mern)
[![Live Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://dog-vaathi-mern.vercel.app)

A comprehensive full-stack MERN application that combines a professional portfolio showcase with an e-commerce platform for dog supplements. Features advanced AR visualization, AI chatbot integration, and a robust admin management system.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Key Features Explained](#key-features-explained)
- [Admin Panel](#admin-panel)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**DogVaathi** is a dual-purpose platform designed for professionals in the dog care/supplement industry:

1. **Portfolio Section** - Showcase your professional achievements, videos, and accomplishments
2. **E-Commerce Platform** - Sell dog supplements and products with integrated payment processing
3. **Advanced Features** - AR experiences, AI chatbot support, and comprehensive admin dashboard

The application is built with modern web technologies and provides a seamless user experience across desktop and mobile devices.

---

## ✨ Features

### 🛍️ E-Commerce
- **Product Management** - Browse and search dog supplement products
- **Shopping Cart** - Add/remove items with persistent cart state
- **Secure Checkout** - Razorpay payment integration
- **Order Tracking** - View order history and status
- **Coupon System** - Apply discount codes at checkout
- **Admin Product Management** - Create, update, delete products with image uploads

### 👤 User Management
- **Authentication** - Email/password registration and login
- **Google OAuth Integration** - Single sign-on with Google accounts
- **User Profiles** - Manage account information and preferences
- **Role-Based Access** - Admin and customer user roles
- **Secure Sessions** - JWT token-based authentication

### 🎬 Portfolio
- **Achievements Showcase** - Display professional accomplishments
- **Video Gallery** - Embedded video portfolio section
- **Admin Content Management** - Update portfolio content dynamically
- **Carousel Management** - Manage homepage carousel banners

### 🔮 Advanced Features
- **AR Experience** - 3D augmented reality visualization using Three.js and React Three Fiber
- **AR Model Management** - Admin-controlled AR model uploads and management
- **AI Chatbot** - Integrated chatbot powered by Google Generative AI and GROQ SDK
- **Email Notifications** - Order confirmations and notifications via Nodemailer

### 📊 Admin Dashboard
- **Analytics & Metrics** - View key business metrics
- **Order Management** - View and manage customer orders
- **Product Management** - Full CRUD operations for products
- **User Management** - Manage user accounts and roles
- **Content Management** - Manage portfolio, videos, achievements, carousel, and AR models
- **Coupon Management** - Create and manage discount codes

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB** | Database |
| **Mongoose** | MongoDB ODM |
| **JWT** | Authentication |
| **Bcryptjs** | Password hashing |
| **Razorpay** | Payment processing |
| **Google Generative AI** | AI chatbot |
| **GROQ SDK** | Advanced AI integration |
| **Multer** | File uploads |
| **Cloudinary** | Image storage & CDN |
| **Nodemailer** | Email sending |
| **Express Validator** | Input validation |
| **CORS** | Cross-origin resource sharing |

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI library |
| **React Router v6** | Client-side routing |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Styling |
| **Three.js** | 3D graphics |
| **React Three Fiber** | React renderer for Three.js |
| **Axios** | HTTP client |
| **React Hot Toast** | Notifications |
| **Google OAuth** | Authentication |
| **React Context API** | State management |

---

## 📁 Project Structure

```
DogVaathi-Mern/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── routes/
│   │   ├── authRoutes.js         # Authentication endpoints
│   │   ├── productRoutes.js      # Product management
│   │   ├── orderRoutes.js        # Order handling
│   │   ├── adminRoutes.js        # Admin operations
│   │   ├── paymentRoutes.js      # Payment processing
│   │   ├── cartRoutes.js         # Cart management
│   │   ├── chatbotRoutes.js      # AI chatbot
│   │   ├── arModelRoutes.js      # AR model management
│   │   ├── couponRoutes.js       # Coupon management
│   │   └── carouselRoutes.js     # Carousel management
│   ├── middleware/               # Authentication & validation
│   ├── models/                   # Mongoose schemas
│   ├── controllers/              # Route controllers
│   ├── loadEnv.js               # Environment loader
│   ├── server.js                # Express app entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Authentication state
│   │   │   ├── CartContext.jsx   # Shopping cart state
│   │   │   └── ThemeContext.jsx  # Theme management
│   │   ├── layouts/
│   │   │   ├── CustomerLayout.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   └── AuthLayout.jsx
│   │   ├── pages/
│   │   │   ├── portfolio/        # Portfolio pages
│   │   │   ├── store/            # E-commerce pages
│   │   │   ├── auth/             # Login/Register
│   │   │   ├── admin/            # Admin dashboard
│   │   │   └── ARExperience.jsx  # AR experience page
│   │   ├── components/           # Reusable components
│   │   ├── App.jsx              # Main app routing
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Tailwind styles
│   ├── vite.config.js
│   └── package.json
│
└── .gitignore
```

---

## 📋 Prerequisites

- **Node.js** (v16.0.0 or higher)
- **npm** (v7.0.0 or higher)
- **MongoDB** (v4.4 or higher) - Local or MongoDB Atlas
- **Git**

### External Services Required
- **Razorpay Account** - For payment processing
- **Google OAuth Credentials** - For Google authentication
- **Cloudinary Account** - For image storage
- **Google Generative AI API Key** - For chatbot
- **GROQ API Key** - For advanced AI features
- **Email Service** - For Nodemailer (Gmail, SendGrid, etc.)

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Dhodduraaj/DogVaathi-Mern.git
cd DogVaathi-Mern
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. Return to Root Directory

```bash
cd ..
```

---

## 🔐 Environment Variables

### Backend `.env` file

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=dogvaathi

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Service (using Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# AI APIs
GOOGLE_AI_API_KEY=your_google_generative_ai_key
GROQ_API_KEY=your_groq_api_key

# Admin Email
ADMIN_EMAIL=admin@dogvaathi.com
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory (optional - Google OAuth Client ID is in code):

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Running the Application

### Development Mode

#### Terminal 1 - Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on: `http://localhost:5000`

#### Terminal 2 - Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend will run on: `http://localhost:5173`

### Production Build

#### Frontend Build
```bash
cd frontend
npm run build
npm run preview
```

#### Backend Production
```bash
cd backend
npm start
```

### Check Backend Health
```bash
curl http://localhost:5000/api/health
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
```
POST   /auth/register           # User registration
POST   /auth/login              # User login
POST   /auth/google             # Google OAuth login
GET    /auth/logout             # Logout user
POST   /auth/refresh-token      # Refresh JWT token
```

### Products
```
GET    /products                # Get all products
GET    /products/:id            # Get product by ID
POST   /products                # Create product (admin only)
PUT    /products/:id            # Update product (admin only)
DELETE /products/:id            # Delete product (admin only)
```

### Orders
```
GET    /orders                  # Get user orders
GET    /orders/:id              # Get order details
POST   /orders                  # Create new order
PUT    /orders/:id              # Update order status (admin)
```

### Shopping Cart
```
GET    /cart                    # Get cart
POST   /cart/add                # Add to cart
PUT    /cart/update             # Update cart item
DELETE /cart/remove/:id         # Remove from cart
```

### Payments
```
POST   /payments/create         # Create payment
POST   /payments/verify         # Verify payment
```

### Admin
```
GET    /admin/dashboard         # Admin dashboard stats
GET    /admin/users             # List all users
POST   /admin/users             # Create user (admin)
PUT    /admin/users/:id         # Update user
DELETE /admin/users/:id         # Delete user
```

### AI Chatbot
```
POST   /chatbot/chat            # Send message to chatbot
```

### AR Models
```
GET    /ar-models               # Get all AR models
POST   /ar-models               # Upload AR model (admin)
DELETE /ar-models/:id           # Delete AR model (admin)
```

### Coupons
```
GET    /coupons                 # Get all coupons
POST   /coupons                 # Create coupon (admin)
DELETE /coupons/:id             # Delete coupon (admin)
POST   /coupons/validate        # Validate coupon code
```

### Carousel
```
GET    /carousel                # Get carousel items
POST   /carousel                # Create carousel item (admin)
PUT    /carousel/:id            # Update carousel item (admin)
DELETE /carousel/:id            # Delete carousel item (admin)
```

---

## 🎮 Key Features Explained

### Authentication Flow
1. Users register with email/password or Google OAuth
2. Server creates JWT token on successful login
3. Token stored in httpOnly cookie for security
4. Protected routes check token validity
5. Token refreshed automatically before expiration

### E-Commerce Flow
1. User browses products
2. Adds items to cart (stored in context state + backend)
3. Proceeds to checkout
4. Applies coupon code if available
5. Initiates Razorpay payment
6. Payment verified on backend
7. Order created and confirmed via email

### AR Experience
- Uses Three.js and React Three Fiber for 3D rendering
- Uploads models managed by admin
- Real-time 3D visualization of products
- Touch/mouse controls for rotation and zoom

### AI Chatbot
- Powered by Google Generative AI and GROQ
- Natural language processing for customer queries
- Provides product recommendations
- Handles FAQ automatically

---

## 👨‍💼 Admin Panel

### Access Admin Dashboard
1. Login as admin user (set during account creation)
2. Navigate to `/admin` route
3. Dashboard shows:
   - Total Orders & Revenue
   - Recent Orders
   - Product Analytics
   - User Statistics

### Admin Capabilities
- **Products** - Add, edit, delete products with image uploads
- **Orders** - View and manage customer orders
- **Users** - Manage user accounts and permissions
- **Portfolio** - Update achievements and videos
- **AR Models** - Upload and manage 3D models
- **Coupons** - Create and manage discount codes
- **Carousel** - Manage homepage banner content

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m 'Add feature: your-feature-name'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Live Demo**: [https://dog-vaathi-mern.vercel.app](https://dog-vaathi-mern.vercel.app)
- **GitHub Repository**: [https://github.com/Dhodduraaj/DogVaathi-Mern](https://github.com/Dhodduraaj/DogVaathi-Mern)
- **Author**: [@Dhodduraaj](https://github.com/Dhodduraaj)

---

## 📞 Support

For issues, bugs, or feature requests, please open an issue on the [GitHub Issues](https://github.com/Dhodduraaj/DogVaathi-Mern/issues) page.

---

## 🙏 Acknowledgments

- Express.js community
- MongoDB documentation
- React ecosystem
- Tailwind CSS
- Three.js for 3D graphics
- All open-source contributors

---

<div align="center">

**Made with ❤️ by [Dhodduraaj](https://github.com/Dhodduraaj)**

If you found this project helpful, please consider giving it a ⭐

</div>
