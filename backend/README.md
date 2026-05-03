# Brew & Co Backend

A complete, production-ready REST API backend for a modern coffee shop management platform built with Node.js, Express.js, and PostgreSQL using Prisma ORM.

## 🚀 Features

- **Authentication & Authorization** - JWT-based auth with refresh tokens
- **Menu Management** - Full CRUD operations for menu items and categories
- **Order System** - Complete order lifecycle management
- **Reservations** - Table booking and availability management
- **Loyalty Program** - Points system and rewards management
- **Reviews & Ratings** - Customer feedback system
- **Payment Processing** - Stripe integration support
- **SMS Notifications** - Twilio SMS notifications
- **Email Notifications** - Resend email service
- **Analytics** - Revenue, customer growth, and sales analytics
- **Rate Limiting** - API request throttling
- **Input Validation** - Express validator integration
- **Error Handling** - Centralized error middleware
- **Logging** - Request logging with Morgan

## 📋 Prerequisites

- Node.js >= 18
- PostgreSQL (Neon recommended)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd brew-co-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` and configure:
- PostgreSQL connection string (Neon)
- JWT secrets
- Stripe API keys (optional)
- Email service (Resend)
- SMS service (Twilio)
- Cloudinary (for images)

4. **Setup Neon PostgreSQL**
- Go to https://console.neon.tech
- Create a new project
- Copy the connection string to `.env`

5. **Initialize database**
```bash
npm run db:migrate
npm run db:seed
```

6. **Start development server**
```bash
npm run dev
```

The server will be running at `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <accessToken>
```

### Health Check
```
GET /api/v1/health
```

### Authentication Endpoints
```
POST   /auth/register          - Register new user
POST   /auth/login             - Login user
POST   /auth/logout            - Logout user
POST   /auth/refresh-token     - Refresh access token
POST   /auth/forgot-password   - Request password reset
POST   /auth/reset-password    - Reset password
GET    /auth/verify-email/:token - Verify email
```

### User Endpoints
```
GET    /users/profile          - Get user profile
PUT    /users/profile          - Update user profile
DELETE /users/account          - Delete user account
GET    /users                  - Get all users (admin)
```

### Menu Endpoints
```
GET    /menu                   - Get all menu items
GET    /menu/featured          - Get featured items
GET    /menu/category/:slug    - Get items by category
GET    /menu/:id               - Get menu item details
POST   /menu                   - Create menu item (admin)
PUT    /menu/:id               - Update menu item (admin)
DELETE /menu/:id               - Delete menu item (admin)
PATCH  /menu/:id/availability  - Toggle availability (admin)
```

### Order Endpoints
```
POST   /orders                 - Create order
GET    /orders/my-orders       - Get user orders
GET    /orders/:id             - Get order details
PATCH  /orders/:id/cancel      - Cancel order
GET    /orders                 - Get all orders (admin)
PATCH  /orders/:id/status      - Update order status (admin)
```

### Reservation Endpoints
```
GET    /reservations/availability - Get available tables
POST   /reservations           - Create reservation
GET    /reservations/my-reservations - Get user reservations
GET    /reservations/:id       - Get reservation details
PATCH  /reservations/:id/cancel - Cancel reservation
GET    /reservations           - Get all reservations (admin)
PATCH  /reservations/:id/status - Update status (admin)
```

### Loyalty Endpoints
```
GET    /loyalty/points         - Get user points
GET    /loyalty/history        - Get points history
GET    /loyalty/rewards        - Get available rewards
GET    /loyalty/stamp-card     - Get stamp card status
POST   /loyalty/redeem         - Redeem reward
```

### Review Endpoints
```
GET    /reviews                - Get all reviews
POST   /reviews                - Create review
GET    /reviews/:id            - Get review details
PUT    /reviews/:id            - Update review
DELETE /reviews/:id            - Delete review
GET    /reviews/rating/average - Get average rating
```

### Analytics Endpoints (Admin)
```
GET    /analytics/revenue/daily - Daily revenue
GET    /analytics/revenue/weekly - Weekly revenue
GET    /analytics/revenue/monthly - Monthly revenue
GET    /analytics/best-sellers - Best selling items
GET    /analytics/peak-hours   - Peak hours analysis
GET    /analytics/customer-growth - Customer growth
GET    /analytics/order-stats  - Order statistics
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   ├── controllers/         # Request handlers
│   ├── routes/              # API routes
│   ├── middleware/          # Express middleware
│   ├── services/            # Business logic
│   ├── validators/          # Input validators
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript types
│   └── app.ts               # Express app setup
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── seed.ts              # Database seeding
│   └── migrations/          # Database migrations
├── tests/                   # Test files
├── server.ts                # Entry point
├── package.json
├── tsconfig.json
└── .env                     # Environment variables
```

## 🗄️ Database Schema

### Users
- Authentication and profile management
- Loyalty points and stamps tracking
- Admin and staff roles

### Menu Items & Categories
- Hierarchical menu structure
- Availability and feature flags
- Customization options

### Orders
- Order creation and status tracking
- Order items with pricing
- Delivery and special notes

### Reservations
- Table availability management
- Guest capacity tracking
- Reservation status

### Payments
- Payment tracking and processing
- Stripe integration support
- Payment status management

### Reviews & Ratings
- Customer feedback system
- Visibility control

### Loyalty System
- Points history tracking
- Reward redemption
- Stamp card system

## 🔑 Environment Variables

```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret_key_min_32_chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars
JWT_REFRESH_EXPIRES_IN=30d
STRIPE_SECRET_KEY=sk_test_...
RESEND_API_KEY=re_...
TWILIO_ACCOUNT_SID=AC...
CLOUDINARY_CLOUD_NAME=...
CLIENT_URL=http://localhost:3000
```

## 📦 Scripts

```bash
npm run dev              # Start development server with hot reload
npm run build           # Build TypeScript to JavaScript
npm start               # Start production server
npm run db:migrate      # Create/update database migrations
npm run db:generate     # Generate Prisma client
npm run db:seed         # Seed database with sample data
npm run db:studio       # Open Prisma Studio UI
npm test                # Run tests
npm run lint            # Run ESLint
```

## 🔒 Security

- JWT authentication with refresh tokens
- Password hashing with bcryptjs
- CORS configuration
- Rate limiting
- Helmet for HTTP headers
- Input validation with express-validator
- Environment variable validation with Zod

## 🚀 Deployment

### Deploy to Railway/Heroku/Vercel

1. Build the project
```bash
npm run build
```

2. Set environment variables on your platform

3. Run migrations
```bash
npm run db:migrate
```

4. Start the server
```bash
npm start
```

## 📝 Notes

- Use Neon PostgreSQL for database (free tier available)
- Optional services (Stripe, Twilio, Resend, Cloudinary) - backend works without them
- All endpoints are fully typed with TypeScript
- Prisma ORM handles all database operations
- Middleware stack for comprehensive request handling

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Commit with clear messages
4. Push and create a pull request

## 📄 License

MIT License

## 📞 Support

For issues and questions, please open an GitHub issue.

---

Happy coding! ☕
