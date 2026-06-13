# 🔌 BUILDRONICS — Full-Stack E-Commerce Platform

> A complete **MERN stack** e-commerce application for electronics components — microcontrollers, sensors, FPGA boards, communication modules, and more.
>
> **Built for:** Electronics enthusiasts, makers, and developers | **By:** EEKAI Innovations Pvt Ltd, Bengaluru

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Database Seeding](#-database-seeding)
- [API Reference](#-api-reference)
- [Demo Accounts](#-demo-accounts)
- [Project Screenshots](#-project-screenshots)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| 🛍️ **Product Catalog** | 15+ products across 4 categories with advanced search, filtering, sorting, and pagination |
| 🛒 **Shopping Cart** | Persistent cart with MongoDB storage, real-time updates, quantity management |
| 💳 **Flexible Checkout** | 2-step checkout (address entry → payment method selection) |
| 📱 **Multiple Payment Methods** | UPI/PhonePe, Razorpay, Stripe, Cash on Delivery |
| 📦 **Order Tracking** | Real-time order status tracking with visual timeline and event history |
| 👤 **User Authentication** | Secure JWT-based login/registration with protected routes |
| 🔐 **Role-Based Access** | Admin and customer roles with different access levels |
| 🔧 **Admin Dashboard** | Manage products (CRUD), orders, users, and view analytics |
| ⭐ **Product Reviews** | Star ratings and customer feedback per product |
| 📊 **Admin Analytics** | Revenue tracking, order statistics, user metrics, status breakdown |
| 📤 **File Uploads** | Product image uploads with Multer integration |
| 🎨 **Responsive Design** | Mobile-first UI with React components and CSS modules |

---

## 🛠️ Tech Stack

### **Backend**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **File Upload:** Multer
- **Payment Integration:** Razorpay, Stripe, UPI
- **CORS:** Enabled for frontend communication

### **Frontend**
- **Framework:** React 18.2
- **Build Tool:** Vite (next-gen bundler)
- **Routing:** React Router v6
- **HTTP Client:** Axios with interceptors
- **UI Notifications:** React Hot Toast
- **Icons:** React Icons
- **Styling:** CSS Modules

### **Infrastructure**
- **Version Control:** Git/GitHub
- **Package Manager:** npm

---

## 📁 Project Structure

```
buildronics/
├── backend/                          # 🔌 Express API Server
│   ├── models/                       # Mongoose schemas
│   │   ├── User.js                   # User schema (name, email, role, address, etc.)
│   │   ├── Product.js                # Product schema with reviews & ratings
│   │   ├── Cart.js                   # Shopping cart schema
│   │   └── Order.js                  # Order schema with status tracking
│   │
│   ├── routes/                       # API route handlers
│   │   ├── authRoutes.js             # Register, login, profile, JWT
│   │   ├── productRoutes.js          # Product listing, search, filters
│   │   ├── cartRoutes.js             # Cart CRUD operations
│   │   ├── orderRoutes.js            # Order creation & tracking
│   │   ├── paymentRoutes.js          # Payment processing
│   │   ├── adminRoutes.js            # Admin-only operations
│   │   └── uploadRoutes.js           # Image upload handling
│   │
│   ├── middleware/                   # Custom middleware
│   │   ├── authMiddleware.js         # JWT verification
│   │   └── uploadMiddleware.js       # Multer configuration
│   │
│   ├── uploads/                      # Uploaded product images
│   │   ├── products/                 # Product images
│   │   └── avatars/                  # User profile pictures
│   │
│   ├── server.js                     # Express app initialization
│   ├── seed.js                       # Database seeder (demo data)
│   ├── package.json                  # Backend dependencies
│   └── .env.example                  # Environment template
│
├── frontend/                         # ⚛️ React SPA
│   ├── src/
│   │   ├── components/               # Reusable React components
│   │   │   ├── Navbar.jsx            # Navigation bar
│   │   │   ├── Footer.jsx            # Footer
│   │   │   ├── ProductCard.jsx       # Product display card
│   │   │   ├── OrderTracker.jsx      # Order status tracker
│   │   │   └── ProtectedRoute.jsx    # Route protection wrapper
│   │   │
│   │   ├── context/                  # Global state management
│   │   │   ├── AuthContext.jsx       # User authentication state
│   │   │   └── CartContext.jsx       # Shopping cart state
│   │   │
│   │   ├── pages/                    # Page components
│   │   │   ├── HomePage.jsx          # Landing page
│   │   │   ├── ShopPage.jsx          # Product listing
│   │   │   ├── ProductPage.jsx       # Product details
│   │   │   ├── CartPage.jsx          # Shopping cart
│   │   │   ├── CheckoutPage.jsx      # Checkout flow
│   │   │   ├── PaymentPage.jsx       # Payment gateway
│   │   │   ├── OrdersPage.jsx        # Order history
│   │   │   ├── OrderDetailPage.jsx   # Order tracking
│   │   │   ├── AuthPage.jsx          # Login/Register
│   │   │   ├── ProfilePage.jsx       # User profile
│   │   │   ├── AdminDashboard.jsx    # Admin main dashboard
│   │   │   ├── AdminProducts.jsx     # Product management
│   │   │   ├── AdminOrders.jsx       # Order management
│   │   │   └── NotFoundPage.jsx      # 404 page
│   │   │
│   │   ├── utils/                    # Utility functions
│   │   │   ├── api.js                # Axios instance with auth interceptor
│   │   │   └── imageUrl.js           # Image URL helper
│   │   │
│   │   ├── App.jsx                   # Root component with routing
│   │   ├── main.jsx                  # React entry point
│   │   └── index.css                 # Global styles
│   │
│   ├── index.html                    # HTML template
│   ├── vite.config.js                # Vite configuration with API proxy
│   ├── package.json                  # Frontend dependencies
│   └── .gitignore
│
├── README.md                         # This file
└── .gitignore                        # Git ignore rules
```

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** 16+ and npm
- **MongoDB** (local or cloud - MongoDB Atlas recommended)
- **Git**

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/buildronics.git
cd buildronics
```

### 2️⃣ Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your MongoDB URI and payment keys
nano .env
```

### 3️⃣ Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install
```

---

## ⚙️ Configuration

### Backend Environment Variables (`.env`)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/buildronics?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars

# Payment Gateways
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

STRIPE_SECRET_KEY=your_stripe_secret_key

# Optional: Third-party Services
CLOUDINARY_NAME=optional_for_cloud_uploads
CLOUDINARY_API_KEY=optional_api_key
```

### Frontend Environment Variables (`.env.local` - optional)

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🏃 Running the Application

### Start Backend

```bash
cd backend
npm run dev          # Development mode with hot-reload (nodemon)
# or
npm start            # Production mode
```

Backend runs on: `http://localhost:5000`

### Start Frontend

```bash
cd frontend
npm run dev          # Development mode with Vite
```

Frontend runs on: `http://localhost:5173`

### Start Both (Concurrent - Optional)

```bash
# From root directory (if you have concurrently installed)
npm run dev
```

---

## 🌱 Database Seeding

Populate the database with 15 demo products and 2 demo users:

```bash
cd backend
npm run seed
```

This creates:
- **15 Products** across 4 categories (Microcontrollers, Sensors, Communication, FPGA)
- **Demo Users:**
  - Admin: `admin@buildronics.com` / `Admin@123`
  - Customer: `test@buildronics.com` / `Test@123`

---

## 🔑 Demo Accounts

Access the application with these credentials after running `npm run seed`:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Admin** | admin@buildronics.com | Admin@123 | Dashboard, manage products/orders |
| **Customer** | test@buildronics.com | Test@123 | Shop, cart, checkout, orders |

---

## 📡 API Reference

**Base URL:** `http://localhost:5000/api`

All protected endpoints require:
```
Authorization: Bearer <your_jwt_token>
```

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Secure@Pass123",
  "phone": "9876543210"
}
```

**Response:**
```json
{
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Secure@Pass123"
}
```

#### Get Profile (Protected)
```http
GET /auth/profile
Authorization: Bearer <token>
```

#### Update Profile (Protected)
```http
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "9876543210",
  "address": {
    "street": "123 MG Road",
    "city": "Bengaluru",
    "state": "Karnataka",
    "pincode": "560001"
  }
}
```

### Products

#### Get All Products
```http
GET /products
GET /products?page=1&limit=12&search=arduino
GET /products?collection=Microcontrollers&sort=price_asc
GET /products?minPrice=200&maxPrice=5000
```

#### Get Single Product
```http
GET /products/{productId}
```

#### Add Product Review (Protected)
```http
POST /products/{productId}/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Great product!"
}
```

### Shopping Cart (Protected)

#### Get Cart
```http
GET /cart
Authorization: Bearer <token>
```

#### Add to Cart
```http
POST /cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "...",
  "quantity": 2
}
```

#### Update Cart Item
```http
PUT /cart/{itemId}
Authorization: Bearer <token>
Content-Type: application/json

{ "quantity": 3 }
```

#### Remove from Cart
```http
DELETE /cart/{itemId}
Authorization: Bearer <token>
```

### Orders (Protected)

#### Create Order
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    { "productId": "...", "quantity": 2, "price": 299 }
  ],
  "shippingAddress": {
    "street": "123 Road",
    "city": "Bengaluru",
    "state": "Karnataka",
    "pincode": "560001"
  },
  "paymentMethod": "razorpay"
}
```

#### Get Orders
```http
GET /orders
Authorization: Bearer <token>
```

#### Get Order Details
```http
GET /orders/{orderId}
Authorization: Bearer <token>
```

### Admin Routes (Admin Only)

#### Get All Orders
```http
GET /admin/orders
Authorization: Bearer <admin_token>
```

#### Update Order Status
```http
PUT /admin/orders/{orderId}/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{ "status": "shipped" }
```

#### Get Admin Dashboard Stats
```http
GET /admin/stats
Authorization: Bearer <admin_token>
```

---

## 🎨 Project Features in Detail

### 🛒 Shopping Cart
- Add/remove products
- Update quantities
- Persist data in MongoDB
- Real-time price calculation
- Cart summary before checkout

### 💳 Checkout & Payment
- **2-Step Checkout:** Address → Payment Method
- **Payment Options:**
  - UPI/PhonePe with QR code generation
  - Razorpay card payments
  - Stripe integration ready
  - Cash on Delivery (COD)

### 📦 Order Management
- Real-time order status tracking
- Order history with timestamps
- Visual timeline of order events
- Admin ability to update order status

### 🔐 Security
- JWT-based authentication
- Password hashing with bcryptjs
- Protected routes (Frontend & Backend)
- Role-based access control
- CORS enabled for frontend

### 📊 Admin Dashboard
- Product analytics
- Order management
- Revenue tracking
- User statistics
- Order status breakdown

---

## 📸 Project Screenshots

(Add screenshots here)
- Homepage
- Product listing with filters
- Product details with reviews
- Shopping cart
- Checkout flow
- Order tracking
- Admin dashboard

---

## 🚀 Deployment

### Deploy Backend (Heroku / Render / Railway)

1. Create `.env` file with production values
2. Push to Git
3. Deploy using platform CLI or dashboard

**Example (Heroku):**
```bash
heroku login
heroku create your-app-name
git push heroku main
```

### Deploy Frontend (Vercel / Netlify)

```bash
npm run build
# Upload dist/ folder to Vercel or Netlify
```

Or using CLI:
```bash
npm install -g vercel
vercel
```

### Environment Variables for Production
- Update MongoDB URI to production
- Use strong JWT_SECRET
- Add production payment API keys
- Update CORS origins

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Test features before submitting PR
- Update README if adding new features

---

## 📝 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) file for details.

---

## 📞 Support & Contact

For issues, questions, or suggestions:
- **Email:** support@buildronics.com
- **GitHub Issues:** [Create an issue](https://github.com/yourusername/buildronics/issues)
- **Company:** EEKAI Innovations Pvt Ltd, Bengaluru

---

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced product recommendations
- [ ] Wishlist feature
- [ ] Email notifications
- [ ] SMS order updates
- [ ] Inventory management
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Progressive Web App (PWA)

---

**Built with ❤️ by EEKAI Innovations**

#### Add Product Review (Protected)
```
POST /api/products/<product_id>/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent board, works perfectly with Arduino IDE!"
}
```

#### Create Product (Admin Only)
```
POST /api/products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "STM32F103 Blue Pill Board",
  "sku": "EEKAI-MCU-STM32F1",
  "vendor": "STMicroelectronics",
  "collection": "Microcontrollers",
  "description": "The STM32F103 Blue Pill is a compact ARM Cortex-M3 development board.",
  "features": ["ARM Cortex-M3 @ 72MHz", "64KB Flash, 20KB SRAM", "37 GPIO pins"],
  "price": 320,
  "comparePrice": 420,
  "countInStock": 60,
  "tags": ["STM32", "ARM", "Cortex-M3", "microcontroller"]
}
```

#### Update Product (Admin Only)
```
PUT /api/products/<product_id>
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "price": 299,
  "countInStock": 100,
  "isFeatured": true
}
```

#### Delete Product (Admin Only)
```
DELETE /api/products/<product_id>
Authorization: Bearer <admin_token>
```

---

### CART (All Protected)

#### Get Cart
```
GET /api/cart
Authorization: Bearer <token>
```

#### Add to Cart
```
POST /api/cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "<product_id>",
  "quantity": 2
}
```

#### Update Item Quantity
```
PUT /api/cart/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "<product_id>",
  "quantity": 3
}
```
> Set quantity to 0 to remove item.

#### Remove Item
```
DELETE /api/cart/remove/<product_id>
Authorization: Bearer <token>
```

#### Clear Cart
```
DELETE /api/cart/clear
Authorization: Bearer <token>
```

---

### ORDERS (All Protected)

#### Create Order
```
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "product": "<product_id>",
      "name": "ESP32-S3 Dual Core WiFi BLE Development Board",
      "image": "https://...",
      "price": 680,
      "quantity": 2,
      "sku": "EEKAI-MCU-ESP32S3"
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "phone": "9876543210",
    "street": "123 MG Road, Indiranagar",
    "city": "Bengaluru",
    "state": "Karnataka",
    "pincode": "560038"
  },
  "paymentMethod": "phonepe",
  "itemsTotal": 1360,
  "shippingPrice": 0,
  "totalPrice": 1360
}
```
`paymentMethod` options: `phonepe` | `razorpay` | `upi` | `cod`

#### Get My Orders
```
GET /api/orders/my
Authorization: Bearer <token>
```

#### Get Single Order
```
GET /api/orders/<order_id>
Authorization: Bearer <token>
```

#### Cancel Order
```
PUT /api/orders/<order_id>/cancel
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Changed my mind"
}
```

#### Admin — Get All Orders
```
GET /api/orders
GET /api/orders?status=pending
GET /api/orders?status=shipped&page=1
Authorization: Bearer <admin_token>
```

#### Admin — Update Order Status
```
PUT /api/orders/<order_id>/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "shipped",
  "description": "Order dispatched via DTDC courier",
  "location": "Bengaluru Hub, Karnataka"
}
```
`status` options: `pending` → `confirmed` → `processing` → `packed` → `shipped` → `out_for_delivery` → `delivered`

---

### PAYMENT

#### Initiate PhonePe / UPI
```
POST /api/payment/phonepe/initiate
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 1360,
  "orderId": "<order_id>"
}
```

#### Confirm PhonePe Payment
```
POST /api/payment/phonepe/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "transactionId": "TXN1234567890",
  "orderId": "<order_id>"
}
```

#### Create Razorpay Order
```
POST /api/payment/razorpay/create-order
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 1360
}
```

#### Verify Razorpay Payment
```
POST /api/payment/razorpay/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "<order_id>",
  "razorpay_payment_id": "pay_demo_123",
  "razorpay_order_id": "ord_demo_456",
  "razorpay_signature": "demo_sig"
}
```

#### Confirm COD Order
```
POST /api/payment/cod/confirm
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "<order_id>"
}
```

---

### ADMIN

#### Admin Stats
```
GET /api/admin/stats
Authorization: Bearer <admin_token>
```

#### Get All Users
```
GET /api/admin/users
Authorization: Bearer <admin_token>
```

#### Delete User
```
DELETE /api/admin/users/<user_id>
Authorization: Bearer <admin_token>
```

#### Health Check
```
GET /api/health
```

---

## 🧪 Postman Testing Guide

### Step 1 — Import & Setup Environment

Create a Postman Environment with these variables:

| Variable      | Initial Value                 |
|---------------|-------------------------------|
| `base_url`    | `http://localhost:5000/api`   |
| `token`       | *(leave empty)*               |
| `admin_token` | *(leave empty)*               |
| `product_id`  | *(leave empty)*               |
| `order_id`    | *(leave empty)*               |

---

### Step 2 — Auto-capture token with Test Script

In your **Login** request → Tests tab, add:
```javascript
const json = pm.response.json();
pm.environment.set("token", json.token);
pm.environment.set("user_id", json.user._id);
console.log("Token saved:", json.token);
```

In your **Admin Login** request → Tests tab, add:
```javascript
const json = pm.response.json();
pm.environment.set("admin_token", json.token);
```

---

### Step 3 — Full Test Flow

**1. Seed DB first** (run once)
```bash
cd backend && npm run seed
```

**2. Admin Login**
```
POST {{base_url}}/auth/login
Body: { "email": "admin@buildronics.com", "password": "Admin@123" }
```
→ admin_token saved automatically

**3. Get Products** — copy a `_id` value
```
GET {{base_url}}/products
```
→ Copy a product `_id`, save to `product_id` env variable

**4. User Register**
```
POST {{base_url}}/auth/register
Body: { "name": "Test", "email": "new@test.com", "password": "Pass@123", "phone": "9876543210" }
```

**5. User Login**
```
POST {{base_url}}/auth/login
Body: { "email": "test@buildronics.com", "password": "Test@123" }
```
→ token saved automatically

**6. Add to Cart**
```
POST {{base_url}}/cart/add
Authorization: Bearer {{token}}
Body: { "productId": "{{product_id}}", "quantity": 2 }
```

**7. Create Order**
```
POST {{base_url}}/orders
Authorization: Bearer {{token}}
Body: (use the full JSON from API reference above, inserting {{product_id}})
```
→ Save the returned `_id` as `order_id`

**8. Initiate Payment**
```
POST {{base_url}}/payment/phonepe/initiate
Authorization: Bearer {{token}}
Body: { "amount": 1360, "orderId": "{{order_id}}" }
```

**9. Confirm Payment**
```
POST {{base_url}}/payment/phonepe/status
Authorization: Bearer {{token}}
Body: { "transactionId": "TXN999", "orderId": "{{order_id}}" }
```

**10. Track Order**
```
GET {{base_url}}/orders/{{order_id}}
Authorization: Bearer {{token}}
```

**11. Admin — Update Order Status**
```
PUT {{base_url}}/orders/{{order_id}}/status
Authorization: Bearer {{admin_token}}
Body: { "status": "shipped", "description": "Dispatched via DTDC", "location": "Bengaluru Hub" }
```

**12. Admin — Get Stats**
```
GET {{base_url}}/admin/stats
Authorization: Bearer {{admin_token}}
```

---

## 🔧 Production Setup

### Real Razorpay Integration
1. Sign up at [razorpay.com](https://razorpay.com), get test API keys
2. Update `.env`: `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
3. Uncomment the real Razorpay code in `backend/routes/paymentRoutes.js`
4. Add your key to `frontend/src/pages/PaymentPage.jsx` Razorpay checkout call

### Real PhonePe Integration
1. Sign up at [PhonePe for Business](https://business.phonepe.com)
2. Use PhonePe Payment Gateway SDK
3. Replace simulation code in `paymentRoutes.js` with actual API calls

### MongoDB Atlas (Cloud)
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/buildronics?retryWrites=true&w=majority
```

### Deploy to Production
```bash
# Build frontend
cd frontend && npm run build
# Serve dist/ with nginx or add express static serving in backend

# Use PM2 for backend
npm install -g pm2
cd backend && pm2 start server.js --name buildronics-api
```

---

## 📋 Order Status Flow

```
placed → confirmed → processing → packed → shipped → out_for_delivery → delivered
                                                    ↘ cancelled (before shipped)
```

---

## 🛠 Tech Stack

| Layer    | Technology                                    |
|----------|-----------------------------------------------|
| Frontend | React 18, Vite, React Router v6, CSS (no UI lib) |
| State    | React Context API (Auth + Cart)               |
| HTTP     | Axios with JWT interceptors                   |
| Backend  | Node.js, Express 4                            |
| Database | MongoDB with Mongoose ODM                     |
| Auth     | JWT (jsonwebtoken), bcryptjs                  |
| Payment  | Razorpay SDK, PhonePe UPI (simulation-ready)  |
| Fonts    | DM Sans, Space Mono, Bebas Neue (Google Fonts)|

---

## 📞 Support

**EEKAI Innovations Pvt Ltd**  
Bengaluru, Karnataka  
support@buildronics.com  
GeM Registered Supplier · HSN: 85340000

---

## 🖼️ Image Upload Guide

### How images work

Products can have images in two ways:

| Method | Format | Example |
|--------|--------|---------|
| External URL | Full `https://` URL | `https://images.unsplash.com/photo-xxx?w=400` |
| Uploaded file | Server path `/uploads/...` | `/uploads/products/product-1718000.jpg` |

The frontend automatically handles both — it prepends `http://localhost:5000` to local paths and uses external URLs as-is.

---

### Method 1 — Upload image first, then create product (Postman)

**Step A: Upload the image**
```
POST http://localhost:5000/api/upload
Authorization: Bearer <admin_token>
Body: form-data
  Key: image   (change type dropdown to "File")
  Value: [select your image file]
```

Response:
```json
{
  "message": "Image uploaded successfully",
  "imageUrl": "/uploads/products/product-1718000123456.jpg",
  "fullUrl": "http://localhost:5000/uploads/products/product-1718000123456.jpg"
}
```

**Step B: Create product using that imageUrl**
```
POST http://localhost:5000/api/products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "STM32F103 Blue Pill",
  "sku": "EEKAI-MCU-STM32F1",
  "vendor": "STMicroelectronics",
  "collection": "Microcontrollers",
  "description": "Compact ARM Cortex-M3 development board",
  "features": ["ARM Cortex-M3 @ 72MHz", "64KB Flash", "37 GPIO pins"],
  "price": 320,
  "comparePrice": 420,
  "countInStock": 60,
  "image": "/uploads/products/product-1718000123456.jpg",
  "isFeatured": true,
  "tags": ["STM32", "ARM", "microcontroller"]
}
```

---

### Method 2 — Upload image + create product in one request

```
POST http://localhost:5000/api/products/with-image
Authorization: Bearer <admin_token>
Body: form-data

  image          (File)   → your image file
  name           (Text)   → STM32F103 Blue Pill
  sku            (Text)   → EEKAI-MCU-STM32F1
  vendor         (Text)   → STMicroelectronics
  collection     (Text)   → Microcontrollers
  description    (Text)   → Compact ARM Cortex-M3 development board
  price          (Text)   → 320
  comparePrice   (Text)   → 420
  countInStock   (Text)   → 60
  isFeatured     (Text)   → true
  features       (Text)   → ["ARM Cortex-M3 @ 72MHz","64KB Flash","37 GPIO pins"]
  tags           (Text)   → ["STM32","ARM","microcontroller"]
```

---

### Method 3 — Use any public image URL (simplest)

```
POST http://localhost:5000/api/products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "My New Product",
  "sku": "EEKAI-MCU-NEW01",
  "image": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
  ...
}
```

Free image sources:
- **Unsplash**: `https://images.unsplash.com/photo-<id>?w=400&q=80`
- **Imgur**: `https://i.imgur.com/<id>.jpg`
- **Your S3/CDN**: any `https://` URL

---

### Update an existing product's image

```
PUT http://localhost:5000/api/products/<product_id>/image
Authorization: Bearer <admin_token>
Body: form-data
  Key: image  (File) → your new image file
```

---

### Admin UI (no Postman needed)

Go to **http://localhost:5173/admin/products** → click **Edit** on any product or **+ Add Product**.

The form has two tabs:
- **🔗 Image URL** — paste any external URL, preview updates live
- **📁 Upload File** — click the drop zone, pick a file, uploads instantly to server

