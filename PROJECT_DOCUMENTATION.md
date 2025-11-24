# Premium Choco Quick Commerce - Comprehensive Project Documentation

## 1. Project Overview
**Premium Choco Quick Commerce** is a full-stack e-commerce application for selling premium chocolate products. The system provides a dual-interface architecture: a customer-facing storefront and an admin management panel. The application emphasizes quick delivery (under 30 minutes) through efficient warehouse and delivery management.

### 1.1 Key Objectives
- **Quick Commerce**: Fast delivery within 30 minutes
- **Premium Products**: Focus on high-quality chocolate products
- **Efficient Operations**: Streamlined warehouse and delivery management
- **User Experience**: Intuitive interfaces for both customers and administrators

## 2. Technology Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: NextAuth.js (Google OAuth)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Validation**: Zod + React Hook Form
- **HTTP Client**: Axios + TanStack Query
- **UI Components**: Shadcn/ui

## 3. Database Schema & Entities

### 3.1 Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    fname VARCHAR(100) NOT NULL,
    lname VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    provider VARCHAR(20),
    external_id VARCHAR(100) NOT NULL,
    image TEXT,
    role VARCHAR(12) NOT NULL DEFAULT 'customer',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
- **Roles**: `customer` (default), `admin`
- **Auth Providers**: Google OAuth integration
- **Business Logic**: Admin users can access management features

### 3.2 Products Table
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    image TEXT,
    description TEXT,
    price INTEGER NOT NULL,
    is_offer BOOLEAN DEFAULT false,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
- **Price**: Stored as integer (cents) for precision
- **Images**: Stored in `/public/assets/` directory
- **Offers**: Special promotional products

### 3.3 Warehouses Table
```sql
CREATE TABLE warehouses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    pincode VARCHAR(6) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX pincode_idx ON warehouses(pincode);
```
- **Pincode Index**: Optimized for delivery area lookup
- **Business Logic**: Each warehouse serves specific pincode areas

### 3.4 Inventories Table
```sql
CREATE TABLE inventories (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(8) UNIQUE NOT NULL,
    order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
    warehouse_id INTEGER REFERENCES warehouses(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
- **SKU**: 8-character unique identifier for each item
- **Order Assignment**: When `order_id` is set, item is reserved/sold
- **Stock Management**: Available items have `order_id = NULL`

### 3.5 Orders Table
```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(10) NOT NULL,
    type VARCHAR(6) DEFAULT 'quick',
    price INTEGER NOT NULL,
    address TEXT NOT NULL,
    product_id INTEGER REFERENCES products(id) ON DELETE NO ACTION NOT NULL,
    qty INTEGER NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
- **Status Values**: `received`, `reserved`, `paid`, `delivered`, `cancelled`
- **Order Types**: `quick` (default), `scheduled`
- **Single Product**: Each order contains one product type

### 3.6 Delivery Persons Table
```sql
CREATE TABLE delivery_persons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(13) NOT NULL,
    warehouse_id INTEGER REFERENCES warehouses(id) ON DELETE CASCADE,
    order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
- **Availability**: Available when `order_id = NULL`
- **Assignment**: One delivery person per order
- **Warehouse Based**: Each person assigned to specific warehouse

## 4. API Endpoints & Functionality

### 4.1 Authentication APIs
- **Provider**: NextAuth.js with Google OAuth
- **Session Management**: JWT-based sessions
- **Role-based Access**: Middleware protects admin routes

### 4.2 Product Management APIs
```typescript
// GET /api/products - Get all products
// POST /api/products - Create product (Admin only)
```
- **File Upload**: Product images handled via FormData
- **Validation**: Zod schema validation
- **Error Handling**: Comprehensive error responses

### 4.3 Order Management APIs
```typescript
// POST /api/orders - Place new order
// GET /api/orders - Get all orders (Admin)
// GET /api/orders/history - Get user's orders
// PATCH /api/orders/status - Update order status (Admin)
```

### 4.4 Inventory Management APIs
```typescript
// POST /api/inventories - Add inventory (Admin)
// GET /api/inventories - Get all inventory
```

### 4.5 Warehouse & Delivery APIs
```typescript
// POST /api/warehouses - Create warehouse (Admin)
// GET /api/warehouses - Get all warehouses
// POST /api/delivery-persons - Add delivery person (Admin)
// GET /api/delivery-persons - Get all delivery persons
```

## 5. Core Business Logic & Use Cases

### 5.1 Order Placement Flow
```
1. Customer selects product and quantity
2. Customer enters delivery address and pincode
3. System validates warehouse coverage for pincode
4. System checks product availability in nearest warehouse
5. System finds available delivery person at warehouse
6. Database transaction begins:
   - Create order record
   - Reserve inventory items (update order_id)
   - Assign delivery person (update order_id)
   - Update order status to 'reserved'
7. Transaction commits
8. Redirect to payment success page
```

### 5.2 Inventory Management
- **Stock Tracking**: Each inventory item has unique SKU
- **Reservation System**: Items locked during order placement
- **Availability Check**: `order_id IS NULL` for available stock
- **Warehouse Distribution**: Products distributed across warehouses

### 5.3 Delivery Assignment
- **Automatic Assignment**: System assigns nearest available delivery person
- **Warehouse-based**: Delivery persons assigned to specific warehouses
- **Availability Tracking**: One active order per delivery person

## 6. Frontend Architecture

### 6.1 Customer Interface
- **Landing Page**: Hero, featured products, newsletter
- **Product Catalog**: Grid view with search/filter
- **Product Details**: Individual product pages with order form
- **Cart System**: Persistent cart using Zustand + localStorage
- **Order History**: Customer's past orders with status

### 6.2 Admin Interface
- **Dashboard**: Revenue metrics, order statistics
- **Product Management**: CRUD operations with image upload
- **Inventory Management**: Add/view stock across warehouses
- **Order Management**: View and update order status
- **Warehouse Management**: Manage locations and coverage
- **Delivery Management**: Manage delivery personnel

### 6.3 State Management
```typescript
// Cart Store (Zustand)
interface CartState {
    items: CartItem[];
    addToCart: (product: Product, qty: number) => void;
    removeFromCart: (productId: number) => void;
    updateQty: (productId: number, action: 'increment' | 'decrement') => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getItemCount: () => number;
}
```

## 7. Security & Validation

### 7.1 Authentication & Authorization
- **NextAuth.js**: Secure OAuth implementation
- **Middleware**: Route protection based on user roles
- **Session Validation**: Server-side session checks

### 7.2 Input Validation
```typescript
// Order Schema
const orderSchema = z.object({
    productId: z.number(),
    pincode: z.string().length(6),
    qty: z.number(),
    address: z.string().min(5),
});
```

### 7.3 Database Security
- **Parameterized Queries**: Drizzle ORM prevents SQL injection
- **Transaction Safety**: ACID compliance for order processing
- **Row Locking**: `FOR UPDATE` prevents race conditions

## 8. Exception Handling & Error Scenarios

### 8.1 Order Placement Exceptions
- **No Warehouse Coverage**: Return 400 with "No warehouse found"
- **Insufficient Stock**: Return 500 with stock availability info
- **No Delivery Person**: Return 500 with "Delivery person not available"
- **Database Transaction Failure**: Automatic rollback

### 8.2 Authentication Exceptions
- **Unauthorized Access**: 401 status for missing sessions
- **Forbidden Access**: 403 status for insufficient permissions
- **Invalid Tokens**: Automatic redirect to login

### 8.3 Validation Exceptions
- **Zod Validation**: 400 status with detailed error messages
- **File Upload Errors**: 500 status for file system issues
- **Database Constraints**: 500 status for integrity violations

## 9. System Boundaries & Constraints

### 9.1 Current Limitations
- **Single Product Orders**: One product type per order
- **Simulated Payments**: No actual payment gateway integration
- **Basic Delivery Tracking**: No real-time GPS tracking
- **Limited Geography**: Warehouse coverage based on pincodes only

### 9.2 Scalability Considerations
- **Database Indexing**: Optimized queries for high traffic
- **Image Storage**: File system storage (could be moved to CDN)
- **Session Management**: JWT-based for stateless scaling
- **API Rate Limiting**: Not implemented (future enhancement)

## 10. Deployment & Environment

### 10.1 Environment Variables
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
DATABASE_URL=postgresql://username:password@localhost/dbname
APP_BASE_URL=http://localhost:3000
```

### 10.2 Database Migrations
- **Drizzle Kit**: Schema migrations in `/drizzle/` directory
- **Migration Files**: Incremental database changes
- **Seeding**: Manual data entry through admin interface

## 11. SDA Diagram Requirements

### 11.1 Entity-Relationship Diagram (ERD)
**Primary Entities**: Users, Products, Orders, Warehouses, Inventories, DeliveryPersons

**Key Relationships**:
- Users (1:N) Orders
- Products (1:N) Orders  
- Products (1:N) Inventories
- Warehouses (1:N) Inventories
- Warehouses (1:N) DeliveryPersons
- Orders (1:1) DeliveryPersons (assignment)
- Orders (1:N) Inventories (reservation)

### 11.2 Use Case Diagram
**Actors**: Customer, Admin, System

**Customer Use Cases**:
- Browse Products
- View Product Details
- Add to Cart
- Place Order
- View Order History
- Authentication (Login/Logout)

**Admin Use Cases**:
- Manage Products (CRUD)
- Manage Warehouses
- Manage Inventory
- Manage Delivery Personnel
- View Orders
- Update Order Status
- View Dashboard Analytics

**System Use Cases**:
- Validate Stock Availability
- Assign Warehouse
- Assign Delivery Person
- Process Payments
- Send Notifications

### 11.3 Sequence Diagrams
**Order Placement Sequence**:
1. Client → Product Selection
2. Client → Cart Management  
3. Client → Checkout Form
4. Client → API: POST /api/orders
5. API → Database: Validate Stock
6. API → Database: Transaction Begin
7. API → Database: Create Order
8. API → Database: Reserve Inventory
9. API → Database: Assign Delivery
10. API → Database: Transaction Commit
11. API → Client: Success Response
12. Client → Payment Success Page

### 11.4 Class Diagram
Focus on TypeScript interfaces and their relationships:
- Product, Order, User, Warehouse, Inventory, DeliveryPerson interfaces
- CartStore, ProductStore state management classes
- API service classes
- Validation schema classes
