# ⌨️ KeyForge - Mechanical Keyboard Marketplace

A full-stack B2C e-commerce platform built with **Spring Boot** and **React**, specialized for mechanical keyboard enthusiasts. Shop for keycaps, switches, keyboard mods, and tech accessories.

---

## 📖 About The Project

**KeyForge** is a niche B2C marketplace dedicated to the mechanical keyboard community. The platform offers a curated shopping experience for keyboard enthusiasts looking for premium keycaps, switches, stabilizers, lubricants, and other keyboard modifications. Built with a modern tech stack, KeyForge provides a seamless experience for both buyers and verified sellers.

---

## ✨ Main Features

### 🔐 Authentication & Authorization
- **JWT-based Authentication** with access and refresh tokens
- **Role-based Access Control** (User, Seller, Admin)
- User registration and login
- Secure password encryption

### ⌨️ Product Management
- Specialized for keyboard components:
  - **Keycaps** (profiles, materials, colorways)
  - **Switches** (linear, tactile, clicky)
  - **Stabilizers** & Mods
  - **Lubricants** & Tools
  - **Tech Accessories**
- Multi-step product creation workflow (Draft → Inventory → Logistics → Active)
- Product media upload with **Cloudinary** integration
- Advanced filtering by product attributes
- Product status management (DRAFT, ACTIVE, INACTIVE, OUT_OF_STOCK)

### 🛒 Shopping Cart
- Add/remove products to cart
- Update product quantities
- Cart persistence across sessions
- Real-time cart total calculation

### 👤 User Management
- User profile management
- Customer and seller profiles
- Role assignment and management

### 🏪 Seller Dashboard
- Seller registration and verification
- Product listing management
- Inventory and stock management
- Shipping and logistics configuration

### 📋 Order Management
- Order creation and processing
- Order status tracking
- Order history

### 💳 Payment Integration
- **VNPay Integration** *(Coming Soon)*

---

## 🛠️ Tech Stack

### Backend
| Technology | Description |
|------------|-------------|
| **Java 21** | Programming Language |
| **Spring Boot 3.5.3** | Application Framework |
| **Spring Security** | Authentication & Authorization |
| **Spring Data JPA** | Database ORM |
| **PostgreSQL** | Relational Database |
| **JWT (jjwt 0.12.6)** | Token-based Authentication |
| **Cloudinary** | Media/Image Storage |
| **Lombok** | Boilerplate Code Reduction |
| **SpringDoc OpenAPI** | API Documentation (Swagger) |
| **Maven** | Build Tool |

### Frontend
| Technology | Description |
|------------|-------------|
| **React 19** | UI Library |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Build Tool & Dev Server |
| **Material-UI (MUI) v7** | UI Component Library |
| **Redux Toolkit** | State Management |
| **React Query (TanStack)** | Server State Management |
| **React Router v7** | Client-side Routing |
| **React Hook Form** | Form Handling |
| **Axios** | HTTP Client |
| **Tailwind CSS** | Utility-first CSS Framework |
| **Zod / Yup** | Schema Validation |

---

## 📁 Project Structure

```
KeyForge/
├── backend/                    # Spring Boot Backend
│   ├── src/main/java/
│   │   ├── config/            # Security, CORS, Cloudinary config
│   │   ├── exception/         # Custom exception handlers
│   │   ├── feature/           # Feature modules
│   │   │   ├── User/          # User, Auth, Seller modules
│   │   │   ├── Product/       # Product, Media modules
│   │   │   ├── Order/         # Order management
│   │   │   └── _common/       # Shared utilities
│   │   └── util/              # Helper utilities
│   └── src/main/resources/
│       └── application.yml    # Application configuration
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── features/          # Feature modules (Auth, Cart, Product, etc.)
│   │   ├── hooks/             # Custom React hooks
│   │   ├── layouts/           # Page layouts
│   │   ├── redux/             # Redux store & slices
│   │   ├── services/          # API service layer
│   │   └── theme/             # MUI theme customization
│   └── package.json
│
├── Dockerfile                  # Multi-stage Docker build
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Java 21** or higher
- **Node.js 20** or higher
- **Maven 3.9+**
- **PostgreSQL** database
- **Cloudinary** account (for image uploads)

### Environment Variables

Create a `.env.properties` file in the `backend/src/main/resources/` directory:

```properties
# Database Configuration
DB_URL=jdbc:postgresql://localhost:5432/keyforge_db
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password

# JWT Configuration
JWT_SECRET=your_super_secret_key_here_minimum_256_bits
JWT_ACCESS_EXPIRATION=3600000
JWT_REFRESH_EXPIRATION=604800000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server Configuration
PORT=8080
```

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies and build:**
   ```bash
   mvn clean install
   ```

3. **Run the application:**
   ```bash
   mvn spring-boot:run
   ```

   The backend will start at `http://localhost:8080/api/v1`

4. **Access API Documentation:**
   
   Open `http://localhost:8080/api/v1/swagger-ui.html` in your browser

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   The frontend will start at `http://localhost:5173`

### Docker Setup (Optional)

Build and run the entire stack using Docker:

```bash
# Build the Docker image
docker build -t keyforge .

# Run the container
docker run -p 8080:8080 \
  -e DB_URL=your_db_url \
  -e DB_USERNAME=your_username \
  -e DB_PASSWORD=your_password \
  -e JWT_SECRET=your_jwt_secret \
  keyforge
```

---

## 📡 API Endpoints

All API endpoints are prefixed with `/api/v1`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | User registration |
| `/auth/login` | POST | User login |
| `/auth/refresh` | POST | Refresh access token |
| `/products` | GET | Get all products |
| `/products/{id}` | GET | Get product by ID |
| `/products` | POST | Create new product (Seller) |
| `/users/profile` | GET | Get user profile |
| `/orders` | POST | Create order |
| `/orders/{id}` | GET | Get order details |

For complete API documentation, visit the Swagger UI at `/api/v1/swagger-ui.html`

---

## 🔮 Roadmap

- [x] User Authentication & Authorization
- [x] Product Management System
- [x] Shopping Cart
- [x] Seller Dashboard
- [x] Order Management
- [ ] **VNPay Payment Integration**
- [ ] Product Reviews & Ratings
- [ ] Wishlist/Favorites
- [ ] Product Attribute Filtering (Switch Type, Keycap Profile, etc.)
- [ ] Email Notifications
- [ ] Admin Dashboard
- [ ] Analytics & Reporting

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 📧 Contact

For questions or support, please open an issue in the repository.
