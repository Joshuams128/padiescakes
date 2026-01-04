# Padiescakes Cart System - Setup Instructions

## Overview
A complete shopping cart system with React Context, localStorage persistence, checkout form, and email notifications via Resend.

## Features Implemented

### 1. Cart System
- **React Context**: Global cart state management using `CartContext`
- **localStorage**: Cart data persists across browser sessions
- **Cart Items**: Stores product details, flavors, dietary options, and quantity
- **Cart Operations**: Add, remove, update quantity, and clear cart

### 2. Shopping Flow
- **Product Pages**: Add items with flavor selection, dietary add-ons, and quantity
- **Cart Page**: View all items, adjust quantities, see pricing breakdown
- **Checkout Page**: Form with customer and delivery information
- **Success Page**: Order confirmation with payment instructions

### 3. Order Processing
- **API Endpoint**: `/api/order` handles order submission
- **Email Notifications**: 
  - Business owner receives order details
  - Customer receives order confirmation
- **E-transfer Instructions**: Customer shown payment details with order number

## Setup Instructions

### 1. Install Dependencies
Dependencies are already installed. The project includes:
- `resend` - Email service SDK

### 2. Configure Resend API Key

1. Sign up for a Resend account at [https://resend.com](https://resend.com)
2. Get your API key from [https://resend.com/api-keys](https://resend.com/api-keys)
3. Create a `.env.local` file in the project root:

```bash
RESEND_API_KEY=re_your_actual_api_key_here
```

4. (Optional) Configure your domain in Resend to send emails from your own domain instead of `orders@padiescakes.com`

### 3. Update Email Addresses

In [app/api/order/route.ts](app/api/order/route.ts), update the email configuration:

```typescript
// Line 114: Change to your actual domain email
from: 'Padiescakes Orders <orders@yourdomain.com>',

// Line 115: Change to the business email that receives orders
to: 'padiescakes@gmail.com',

// Line 122: Change to your actual domain email
from: 'Padiescakes <orders@yourdomain.com>',
```

### 4. Test the System

1. Start the development server:
```bash
npm run dev
```

2. Navigate to a product page (e.g., `/product/bouquet-small`)
3. Select a flavor and add to cart
4. View cart at `/cart`
5. Proceed to checkout at `/checkout`
6. Fill out the form and submit
7. Check that you receive both emails (business + customer confirmation)

## File Structure

```
context/
  CartContext.tsx          # Cart state management with React Context

app/
  cart/
    page.tsx               # Cart view and management page
  checkout/
    page.tsx               # Checkout form page
  success/
    page.tsx               # Order confirmation page
  api/
    order/
      route.ts             # Order processing API endpoint
  layout.tsx               # Updated with CartProvider
  product/[id]/
    page.tsx               # Updated with cart integration

components/
  StickyMobileCartButton.tsx  # Updated to show cart count
```

## Cart Context API

```typescript
// Available cart methods
const { 
  items,              // Array of cart items
  addItem,            // Add item to cart
  removeItem,         // Remove item by ID
  updateQuantity,     // Update item quantity
  clearCart,          // Clear all items
  getTotalItems,      // Get total item count
  getTotalPrice       // Get total cart price
} = useCart();
```

## Cart Item Structure

```typescript
interface CartItem {
  id: string;              // Unique item ID
  productId: string;       // Product identifier
  name: string;            // Product name
  flavor: string;          // Selected flavor
  dietaryOptions: string[]; // Array of dietary addon IDs
  quantity: number;        // Item quantity
  price: number;           // Price per item (including addons)
  image: string;           // Product image URL
}
```

## Order Flow

1. **Browse Products** → Select product from shop
2. **Customize** → Choose flavor, dietary options, quantity
3. **Add to Cart** → Item saved to cart (localStorage)
4. **View Cart** → Review items, adjust quantities
5. **Checkout** → Fill out delivery form
6. **Submit Order** → POST to `/api/order`
7. **Emails Sent** → Business notified, customer receives confirmation
8. **Success Page** → Payment instructions displayed

## Payment Information

The success page displays:
- Order number (timestamp)
- Total amount
- E-transfer email: `padiescakes@gmail.com`
- Reference: Order number for payment matching

## Environment Variables

Required in `.env.local`:
```
RESEND_API_KEY=your_resend_api_key_here
```

## Notes

- **localStorage**: Cart persists across browser sessions
- **Email Domain**: Update the `from` addresses in the API route to use your verified domain
- **Validation**: Form includes client-side validation for required fields
- **Error Handling**: Displays error messages for failed submissions
- **Responsive**: All pages are mobile-friendly

## Support

For questions or issues, refer to:
- [Resend Documentation](https://resend.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [React Context](https://react.dev/reference/react/useContext)
