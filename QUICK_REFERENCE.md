# Quick Reference - Padiescakes Cart System

## 🚀 Quick Start

1. **Install dependencies** (already done)
   ```bash
   npm install
   ```

2. **Add Resend API key**
   ```bash
   # Edit .env.local
   RESEND_API_KEY=re_your_actual_key_here
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Test the cart**
   - Visit http://localhost:3000/shop
   - Select a product
   - Add to cart
   - Checkout

## 📁 File Locations

```
context/CartContext.tsx        # Cart state & localStorage
app/cart/page.tsx              # Cart management page
app/checkout/page.tsx          # Checkout form
app/success/page.tsx           # Order confirmation
app/api/order/route.ts         # Order processing API
components/StickyMobileCartButton.tsx  # Cart button
```

## 🛒 Cart Usage

```typescript
import { useCart } from '@/context/CartContext';

// In any component:
const { 
  items,           // Current cart items
  addItem,         // Add item to cart
  removeItem,      // Remove by ID
  updateQuantity,  // Update quantity
  clearCart,       // Clear all
  getTotalItems,   // Get count
  getTotalPrice    // Get total $
} = useCart();

// Add item example:
addItem({
  id: unique_id,
  productId: 'bouquet-small',
  name: 'Small Cupcake Bouquet',
  flavor: 'Vanilla',
  dietaryOptions: ['gluten-free'],
  quantity: 2,
  price: 40.00,
  image: '/images/product.jpg'
});
```

## 📧 Email Configuration

**Location:** `app/api/order/route.ts`

```typescript
// Line 114 - Business email
from: 'Padiescakes Orders <orders@padiescakes.com>',
to: 'padiescakes@gmail.com',

// Line 122 - Customer email
from: 'Padiescakes <orders@padiescakes.com>',
to: customer.email,
```

**To change:**
1. Update email addresses in route.ts
2. Verify domain in Resend dashboard
3. Test email delivery

## 🔧 Environment Variables

```bash
# Required
RESEND_API_KEY=re_xxxxx

# Get from:
# https://resend.com/api-keys
```

## 📄 Pages

| Route | Purpose | Type |
|-------|---------|------|
| `/cart` | View cart | Static |
| `/checkout` | Place order | Static |
| `/success?orderNumber=X&total=Y` | Confirmation | Dynamic |
| `/api/order` | Process order | API |

## 💳 Payment Flow

1. Customer completes checkout
2. Receives order confirmation email
3. Sends e-transfer to: **padiescakes@gmail.com**
4. Reference: **Order #[timestamp]**
5. Business receives order notification email

## 🎨 Customization Points

### Change Colors
**File:** `app/globals.css` (Tailwind config)
- `primary-600` → main brand color
- `secondary-200` → accent color

### Update Email Templates
**File:** `app/api/order/route.ts`
- `ownerEmailHtml` → Business email
- `customerEmailHtml` → Customer email

### Modify Form Fields
**File:** `app/checkout/page.tsx`
- Add/remove form fields
- Update validation logic

### Change Payment Method
**Files:**
- `app/api/order/route.ts` → Email template
- `app/success/page.tsx` → Payment instructions

## 🐛 Troubleshooting

### Build fails with Resend error
✓ **Fixed:** API key validation added
- Build works without API key
- Runtime checks for missing key

### Cart not persisting
- Check browser localStorage enabled
- Key: `padiescakes-cart`
- Clear cache if corrupted

### Emails not sending
1. Check `.env.local` has correct key
2. Verify key is valid at Resend
3. Check console for errors
4. Verify domain if using custom domain

### Success page redirects to home
- Ensure URL has params: `?orderNumber=X&total=Y`
- Check checkout form submission
- Verify API response includes orderNumber

## 📊 Cart Item Structure

```typescript
interface CartItem {
  id: string;              // "product-vanilla-gluten-free-1234567890"
  productId: string;       // "bouquet-small"
  name: string;            // "Small Cupcake Bouquet"
  flavor: string;          // "Vanilla"
  dietaryOptions: string[];// ["gluten-free", "vegan"]
  quantity: number;        // 2
  price: number;           // 40.00 (per item including addons)
  image: string;           // "/images/bouquet-7.jpg"
}
```

## 🔗 Important Links

- **Resend Dashboard:** https://resend.com/home
- **API Keys:** https://resend.com/api-keys
- **Documentation:** https://resend.com/docs
- **Next.js Docs:** https://nextjs.org/docs

## ✅ Testing Checklist

- [ ] Add item to cart
- [ ] View cart page
- [ ] Update quantities
- [ ] Remove items
- [ ] Cart persists on page reload
- [ ] Cart badge shows correct count
- [ ] Proceed to checkout
- [ ] Form validation works
- [ ] Submit order
- [ ] Receive business email
- [ ] Receive customer email
- [ ] Success page displays correctly
- [ ] Cart clears after order

## 📝 Notes

- Order numbers use timestamps
- Cart merges identical items
- localStorage auto-syncs
- Emails require API key
- Build successful without API key
- Runtime checks prevent crashes
