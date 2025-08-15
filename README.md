# Purchase Order Management Application

A modern, responsive web application for managing purchase orders built with Angular 17 and .NET Core.

## Features

### 1. List of Purchase Orders
- **Tabular View**: Display purchase orders in a clean, organized table
- **Advanced Filtering**: Filter by supplier, status, or date range
- **Sorting**: Sort by PO number, order date, total amount, or any column
- **Pagination**: Handle large datasets with configurable page sizes
- **Real-time Search**: Debounced search with instant results

### 2. Add / Edit / Delete Purchase Orders
- **Create New**: Add new purchase orders with validation
- **Edit Existing**: Update purchase order details
- **Delete**: Remove purchase orders with confirmation
- **Form Validation**: Comprehensive client-side validation

### 3. Purchase Order Details
- **Complete Information**: View all PO details in a clean layout
- **Status Tracking**: Visual timeline showing order progress
- **Responsive Design**: Works on all device sizes

### 4. Data Fields
Each Purchase Order includes:
- **PO Number**: Unique identifier (required, max 50 chars)
- **Description**: Optional details (max 500 chars)
- **Supplier Name**: Supplier information (required, max 200 chars)
- **Order Date**: Date of order (required)
- **Total Amount**: Numeric value with 2 decimal places
- **Status**: Draft / Approved / Shipped / Completed / Cancelled

## Technology Stack

### Frontend
- **Angular 17**: Latest version with standalone components
- **TypeScript**: Type-safe development
- **CSS Grid & Flexbox**: Modern responsive layouts
- **Font Awesome**: Professional icons
- **RxJS**: Reactive programming patterns

### Backend
- **.NET Core**: RESTful API
- **Entity Framework**: Data access
- **Clean Architecture**: Separation of concerns

## Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Package manager
- **Angular CLI**: Version 17 or higher
- **.NET Core**: Version 8.0 or higher (for backend)

## Installation & Setup

### 1. Install Dependencies

```bash
# Navigate to the frontend directory
cd purchase-order-ui

# Install npm packages
npm install
```

### 2. Backend Configuration

Ensure your .NET Core backend is running on `http://localhost:5000`. If your backend runs on a different port, update the `baseUrl` in `src/app/services/purchase-order.service.ts`.

### 3. Start the Application

```bash
# Start the development server
npm start

# The application will be available at http://localhost:4200
```

### 4. Build for Production

```bash
# Build the application
npm run build

# The built files will be in the dist/ directory
```

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── purchase-order-list/          # Main list component
│   │   ├── purchase-order-form/          # Add/edit form
│   │   └── purchase-order-detail/        # Detail view
│   ├── models/                           # TypeScript interfaces
│   ├── services/                         # API services
│   └── app.routes.ts                     # Routing configuration
├── assets/                               # Static assets
└── styles.css                            # Global styles
```

## API Endpoints

The application communicates with the following backend endpoints:

- `GET /api/purchaseorders` - List purchase orders with filtering/pagination
- `GET /api/purchaseorders/{id}` - Get purchase order details
- `POST /api/purchaseorders` - Create new purchase order
- `PUT /api/purchaseorders/{id}` - Update purchase order
- `DELETE /api/purchaseorders/{id}` - Delete purchase order

## Key Features Implementation

### Filtering & Sorting
- Real-time filtering with debouncing (300ms delay)
- Multi-column sorting with visual indicators
- Date range filtering
- Status-based filtering

### Pagination
- Configurable page sizes (5, 10, 25, 50)
- Navigation controls (First, Previous, Next, Last)
- Page information display
- Responsive pagination layout

### Form Validation
- Required field validation
- Character length limits
- Numeric range validation
- Real-time validation feedback

### Responsive Design
- Mobile-first approach
- CSS Grid and Flexbox layouts
- Breakpoint-based responsive design
- Touch-friendly interface






## Support

For support and questions:
- Check the troubleshooting section
- Review the code comments
- Create an issue in the project repository
