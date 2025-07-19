# 🏥 MedVault - Advanced Patient Record Management System

> **Created by Asish Bindhani**  
> 📧 **Email:** asishbindhani@gmail.com  
> 📱 **Phone:** +919337256379  
> 💼 **Work:** Healthcare Technology Solutions  
> 🔗 [GitHub](https://github.com/asish372) | [LinkedIn](https://linkedin.com/in/asish372)

A comprehensive, secure, and modern healthcare management platform built with the MERN stack, featuring role-based access control, real-time updates, and an intuitive user interface designed for hospitals, clinics, and healthcare providers.

## ✨ Key Features

### 🔐 **Security & Compliance**
- **HIPAA-compliant** security architecture
- **JWT-based authentication** with bcrypt password hashing
- **Role-based access control** (Admin, Doctor, Patient)
- **End-to-end encryption** for sensitive data
- **Audit logging** for all user actions
- **Rate limiting** and security middleware

### 🎨 **Modern User Experience**
- **Responsive design** that works on all devices
- **Dark/Light mode toggle** with system preference detection
- **Smooth animations** powered by Framer Motion
- **Beautiful UI components** with Tailwind CSS
- **Real-time notifications** and toast messages
- **Advanced search functionality**

### 👥 **Role-Based Dashboards**

#### 🔴 **Admin Dashboard**
- User management and role assignments
- System analytics and reporting
- Hospital-wide statistics
- Audit log monitoring
- System configuration

#### 🟢 **Doctor Dashboard**
- Patient record management
- Appointment scheduling
- Medical history tracking
- Prescription management
- Lab result reviews

#### 🔵 **Patient Dashboard**
- Personal medical records
- Appointment history
- Prescription tracking
- Health summary
- Document uploads

### 🛠️ **Advanced Features**
- **Profile Settings** with comprehensive user management
- **File upload system** for medical documents and images
- **Real-time synchronization** across all devices
- **Comprehensive API** with full CRUD operations
- **Email notifications** and appointment reminders
- **Multi-language support** (English, Spanish, French, German)
- **Time zone management**

## 🚀 Technology Stack

### **Frontend**
- **React 18** with Vite for fast development
- **Tailwind CSS** for modern styling
- **Framer Motion** for smooth animations
- **React Router DOM** for navigation
- **React Hook Form** for form management
- **Axios** for API communication
- **React Hot Toast** for notifications

### **Backend**
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Multer** for file uploads
- **Nodemailer** for email services
- **Express Rate Limit** for security

### **Development Tools**
- **ESLint** for code quality
- **Prettier** for code formatting
- **Nodemon** for development server
- **CORS** for cross-origin requests

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/asish372/medvault.git
cd medvault
```

### 2. Install Dependencies

**Backend Setup:**
```bash
cd server
npm install
```

**Frontend Setup:**
```bash
cd ../client
npm install
```

### 3. Environment Configuration

Create a `.env` file in the server directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/medvault
# For production, use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medvault

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Frontend URL (for CORS and email links)
FRONTEND_URL=http://localhost:3000

# Email Configuration (for password reset, verification, etc.)
EMAIL_FROM=noreply@medvault.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# File Upload Configuration
MAX_FILE_SIZE=10485760
MAX_FILES_PER_REQUEST=5
UPLOAD_PATH=./uploads

# Security Configuration
BCRYPT_SALT_ROUNDS=12
MAX_LOGIN_ATTEMPTS=5
LOCK_TIME=30

# Third-party Services (Optional)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-phone

# AWS S3 Configuration (Optional)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET_NAME=your-s3-bucket

# Redis Configuration (Optional)
REDIS_URL=redis://localhost:6379
```

### 4. Database Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB locally and start the service
mongod
```

**Option B: MongoDB Atlas**
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update the `MONGODB_URI` in your `.env` file

### 5. Run the Application

**Start Backend Server:**
```bash
cd server
npm run dev
```

**Start Frontend Development Server:**
```bash
cd client
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## 🧪 Demo Accounts

For testing purposes, use these demo accounts:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | admin@medvault.com | admin123 | Full system access |
| **Doctor** | doctor@medvault.com | doctor123 | Patient management |
| **Patient** | patient@medvault.com | patient123 | Personal records |

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/register     - User registration
POST /api/auth/login        - User login
POST /api/auth/logout       - User logout
POST /api/auth/refresh      - Refresh JWT token
POST /api/auth/forgot       - Password reset request
POST /api/auth/reset        - Password reset confirmation
```

### User Management
```
GET    /api/users           - Get all users (Admin only)
GET    /api/users/:id       - Get user by ID
PUT    /api/users/:id       - Update user profile
DELETE /api/users/:id       - Delete user (Admin only)
POST   /api/users/role      - Update user role (Admin only)
```

### Patient Management
```
GET    /api/patients        - Get all patients
POST   /api/patients        - Create new patient
GET    /api/patients/:id    - Get patient by ID
PUT    /api/patients/:id    - Update patient
DELETE /api/patients/:id    - Delete patient
POST   /api/patients/:id/assign - Assign doctor to patient
```

### Medical Records
```
GET    /api/records         - Get medical records
POST   /api/records         - Create new record
GET    /api/records/:id     - Get record by ID
PUT    /api/records/:id     - Update record
DELETE /api/records/:id     - Delete record
POST   /api/records/:id/share - Share record with doctor
```

### File Upload
```
POST   /api/upload/profile  - Upload profile picture
POST   /api/upload/document - Upload medical document
POST   /api/upload/multiple - Upload multiple files
GET    /api/upload/:filename - Get uploaded file
```

## 🎨 UI Components & Features

### **Enhanced Login/Registration**
- Beautiful gradient backgrounds
- Smooth animations and transitions
- Form validation with real-time feedback
- Demo account quick access
- Password strength indicators
- Remember me functionality

### **Advanced Profile Settings**
- **Profile Tab:** Personal information management
- **Security Tab:** Password change and security settings
- **Preferences Tab:** Notification and privacy settings
- **Appearance Tab:** Theme toggle and language selection

### **Responsive Navigation**
- Adaptive navbar with role-based menus
- Advanced search functionality
- Real-time notifications
- Theme toggle integration
- Mobile-optimized dropdown menus

### **Dashboard Analytics**
- Real-time statistics and charts
- Role-specific quick actions
- Recent activity feeds
- Health metrics visualization
- Appointment scheduling integration

## 🌐 Deployment

### **Frontend Deployment (Vercel)**

1. **Build the frontend:**
```bash
cd client
npm run build
```

2. **Deploy to Vercel:**
```bash
npm install -g vercel
vercel --prod
```

3. **Environment Variables:**
```
VITE_API_URL=https://your-backend-url.com
```

### **Backend Deployment (Render)**

1. **Create a Render account** and connect your GitHub repository

2. **Set environment variables** in Render dashboard

3. **Deploy configuration:**
```yaml
# render.yaml
services:
  - type: web
    name: medvault-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        fromDatabase:
          name: medvault-db
          property: connectionString
```

### **Database Deployment (MongoDB Atlas)**

1. **Create MongoDB Atlas cluster**
2. **Configure network access** and database users
3. **Get connection string** and update environment variables
4. **Set up database indexes** for optimal performance

## 🧪 Testing

### **Manual Testing Checklist**

#### **Authentication Flow**
- [ ] User registration with all roles
- [ ] Login with demo accounts
- [ ] Password reset functionality
- [ ] JWT token refresh
- [ ] Logout and session management

#### **Role-Based Access**
- [ ] Admin dashboard access and features
- [ ] Doctor patient management
- [ ] Patient record viewing
- [ ] Unauthorized access prevention

#### **Core Features**
- [ ] Profile settings and updates
- [ ] Theme toggle functionality
- [ ] File upload and download
- [ ] Search functionality
- [ ] Real-time notifications

#### **Responsive Design**
- [ ] Mobile navigation
- [ ] Tablet layout optimization
- [ ] Desktop full features
- [ ] Cross-browser compatibility

### **API Testing**
```bash
# Install testing dependencies
npm install --save-dev jest supertest

# Run tests
npm test
```

## 🔧 Development

### **Project Structure**
```
medvault/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React contexts
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   ├── package.json
│   └── vite.config.js
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── uploads/          # File uploads
│   ├── package.json
│   └── server.js
├── .env                  # Environment variables
└── README.md
```

### **Code Style Guidelines**
- Use **ESLint** and **Prettier** for consistent formatting
- Follow **React best practices** and hooks patterns
- Implement **error boundaries** for robust error handling
- Use **TypeScript** for type safety (optional enhancement)
- Write **comprehensive comments** for complex logic

### **Performance Optimization**
- **Code splitting** with React.lazy()
- **Image optimization** and lazy loading
- **API response caching** with Redis
- **Database indexing** for faster queries
- **CDN integration** for static assets

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit your changes:** `git commit -m 'Add amazing feature'`
4. **Push to the branch:** `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### **Contribution Guidelines**
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **MongoDB** for the flexible database solution
- **Framer Motion** for smooth animations
- **Healthcare community** for inspiration and requirements

## 📞 Support & Contact

**Created with ❤️ by Asish Bindhani**

- 📧 **Email:** asishbindhani@gmail.com
- 📱 **Phone:** +919337256379
- 💼 **Work:** Healthcare Technology Solutions
- 🔗 **GitHub:** [github.com/asish372](https://github.com/asish372)
- 💼 **LinkedIn:** [linkedin.com/in/asish372](https://linkedin.com/in/asish372)

For support, feature requests, or collaboration opportunities, feel free to reach out!

---

**MedVault** - Transforming Healthcare Management, One Record at a Time 🏥✨
