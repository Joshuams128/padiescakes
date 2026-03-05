# Order Management System - Setup Guide

## Overview
Your Padie's Cakes website now has a complete order management system with:
- ✅ Order storage in MongoDB
- ✅ Admin dashboard to view all orders
- ✅ Order status tracking (pending, confirmed, completed, cancelled)
- ✅ Detailed order view pages
- ✅ Password-protected dashboard

## Setup Instructions

### 1. Create a MongoDB Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Click "Create" to create a new project
4. Click "Build a Database" and choose the **Free tier**
5. Select your preferred cloud provider and region
6. Wait for the cluster to be created (takes ~5 minutes)

### 2. Get Your MongoDB Connection String

1. In MongoDB Atlas, click "Connect"
2. Choose "Drivers" 
3. Select "Node.js" as the driver
4. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`)
5. Replace `<password>` with your database password
6. Add a database name (e.g., `padiescakes`)

### 3. Update Environment Variables

In `.env.local`, replace the placeholder values:

```env
# Resend API key (already set)
RESEND_API_KEY=re_RkWujDey_L762FCn5qd8QmTDRXK2YYjRS

# Your MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/padiescakes?retryWrites=true&w=majority

# Change this to a strong password for your dashboard
DASHBOARD_PASSWORD=your_secure_password_here
```

### 4. Update Owner Email

Update the notification email in `/app/api/orders/route.ts`:

```typescript
// Change this line (around line 49):
to: 'your@email.com', // <- Change to your email address
```

## How It Works

### Order Flow

```
Customer Checkout
    ↓
POST /api/orders
    ↓
[Save to MongoDB]
    ↓
[Send 2 emails via Resend]
    ├─ Confirmation email to customer
    └─ Notification email to you
    ↓
Redirect to /success
```

### Dashboard Access

1. **URL**: `http://localhost:3000/dashboard` (or your deployed domain)
2. **Password**: Use the `DASHBOARD_PASSWORD` from your `.env.local`
3. **Features**:
   - View all orders in a table
   - Click "View" to see detailed order information
   - Update order status (pending → confirmed → completed → cancelled)
   - Email or call customer directly from the order details page

### Orders Page Structure

#### Dashboard Homepage (`/dashboard`)
- Login with dashboard password
- View all orders in table format
- Change order status
- Click order number to view details

#### Order Details (`/dashboard/orders/[id]`)
- Full customer information
- Delivery details
- Complete order items list
- Customer notes
- Email/call customer buttons
- Change order status

## Files Created/Modified

### New Files
- `/lib/mongodb.ts` - Database connection
- `/lib/models/Order.ts` - Order schema
- `/app/api/orders/route.ts` - Save orders to DB (modified)
- `/app/api/orders/list/route.ts` - Get all orders
- `/app/api/orders/[id]/route.ts` - Get/update order details
- `/app/dashboard/page.tsx` - Dashboard homepage
- `/app/dashboard/orders/[id]/page.tsx` - Order details page
- `.env.local` - Updated with MongoDB and dashboard settings

## Order Status Meanings

| Status | Meaning | Next Step |
|--------|---------|-----------|
| **Pending** | Order received, awaiting confirmation | Contact customer to confirm |
| **Confirmed** | Order confirmed with customer | Prepare the order |
| **Completed** | Order is ready/delivered | Mark as complete |
| **Cancelled** | Order is cancelled | No action needed |

## Testing the System

1. Start your dev server: `npm run dev`
2. Go to `/shop` and place a test order
3. Visit `/dashboard` and login with your password
4. You should see the order in the table
5. Click "View" to see full details
6. Try changing the status

## Security Notes

⚠️ **Important**: 
- Change the default `DASHBOARD_PASSWORD` to something strong and unique
- Never commit `.env.local` to Git (already in .gitignore)
- The password is sent in request headers - always use HTTPS in production
- For production, consider adding proper authentication (OAuth, JWT, etc.)

## Troubleshooting

### Orders not saving?
- Check that `MONGODB_URI` is correctly set
- Verify the MongoDB cluster is running
- Check browser console and server logs for errors

### Dashboard not loading?
- Make sure you're using the correct password
- Check that MongoDB connection is working
- Clear localStorage: `localStorage.removeItem('dashboardAuth')`

### Emails not sending?
- Verify `RESEND_API_KEY` is correct
- Check email address in order is valid
- Use Resend dashboard to monitor email delivery

## Next Steps (Optional)

### Add Real Authentication
Replace the simple password with a proper auth system using NextAuth.js or similar.

### Add Email Templates
Replace the inline HTML with React Email or similar for better email formatting.

### Add Order Export
Add CSV or PDF export functionality for orders.

### Add Customer Portal
Create a `/orders` page where customers can track their orders using order number.

## Support

For MongoDB issues: [MongoDB Documentation](https://docs.mongodb.com/)
For Resend issues: [Resend Documentation](https://resend.com/docs)
For Next.js issues: [Next.js Documentation](https://nextjs.org/docs)
