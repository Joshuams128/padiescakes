# Shopping Cart Flow

## User Journey

```
┌─────────────┐
│   Browse    │
│  Products   │
│  (/shop)    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Select    │
│  Product    │
│(/product/id)│
└──────┬──────┘
       │
       │ Choose flavor
       │ Select dietary options
       │ Set quantity
       │
       ▼
┌─────────────┐
│  Add to     │
│   Cart      │
│ (Context)   │
└──────┬──────┘
       │
       │ Saved to localStorage
       │
       ▼
┌─────────────┐
│  View Cart  │
│  (/cart)    │
└──────┬──────┘
       │
       │ Review items
       │ Adjust quantities
       │ Remove items if needed
       │
       ▼
┌─────────────┐
│  Checkout   │
│ (/checkout) │
└──────┬──────┘
       │
       │ Fill form:
       │  • Name
       │  • Email
       │  • Phone
       │  • Address
       │  • Date needed
       │  • Notes
       │
       ▼
┌─────────────┐
│   Submit    │
│   Order     │
│(POST /api/  │
│   order)    │
└──────┬──────┘
       │
       ├─────────────────────┐
       │                     │
       ▼                     ▼
┌─────────────┐      ┌─────────────┐
│ Email to    │      │ Email to    │
│  Business   │      │  Customer   │
│   Owner     │      │(Confirmation│
└─────────────┘      └─────────────┘
       │                     │
       └──────────┬──────────┘
                  │
                  ▼
           ┌─────────────┐
           │   Success   │
           │   Page      │
           │ (/success)  │
           └─────────────┘
                  │
                  │ Show:
                  │  • Order #
                  │  • Total
                  │  • E-transfer info
                  │  • Payment instructions
                  │
                  ▼
           ┌─────────────┐
           │  Customer   │
           │  Sends      │
           │ E-transfer  │
           └─────────────┘
```

## Data Flow

### 1. Add to Cart
```
Product Page
    │
    ├─ User selects flavor
    ├─ User selects dietary options
    ├─ User sets quantity
    │
    ▼
useCart().addItem({
    id: unique_id,
    productId: product.id,
    name: product.name,
    flavor: selectedFlavor,
    dietaryOptions: [array],
    quantity: number,
    price: calculated_price,
    image: product.image
})
    │
    ▼
CartContext
    │
    ├─ Check if similar item exists
    ├─ Merge or add new item
    │
    ▼
localStorage
    └─ Save cart state
```

### 2. Checkout Process
```
Cart Page
    │
    ▼
Checkout Page
    │
    ├─ Validate form
    ├─ Collect customer data
    ├─ Get cart items
    │
    ▼
POST /api/order
    │
    ├─ Order data
    ├─ Customer info
    ├─ Items list
    └─ Total amount
    │
    ▼
Resend API
    │
    ├─ Send email to business
    └─ Send confirmation to customer
    │
    ▼
Clear cart
    │
    ▼
Redirect to Success
```

## Cart Context Structure

```typescript
CartContext
├─ State
│  └─ items: CartItem[]
│
├─ Methods
│  ├─ addItem(item)
│  ├─ removeItem(id)
│  ├─ updateQuantity(id, quantity)
│  ├─ clearCart()
│  ├─ getTotalItems()
│  └─ getTotalPrice()
│
└─ Effects
   ├─ Load from localStorage on mount
   └─ Save to localStorage on change
```

## Email Flow

```
Order Submitted
    │
    ├─────────────────────┐
    │                     │
    ▼                     ▼
Business Email       Customer Email
    │                     │
    ├─ Order #            ├─ Order #
    ├─ Customer info      ├─ Order summary
    ├─ Full item list     ├─ Delivery info
    ├─ Delivery details   ├─ Payment instructions
    └─ Special notes      │  ├─ Amount
                          │  ├─ Email: padiescakes@gmail.com
                          │  └─ Reference: Order #
                          └─ Next steps
```

## Key Components

| Component | Purpose | State |
|-----------|---------|-------|
| CartContext | Global cart state | items[], methods |
| Product Page | Add items to cart | flavor, addons, qty |
| Cart Page | View/manage cart | Display items |
| Checkout Page | Collect customer info | form data |
| API Route | Process order | Email sending |
| Success Page | Confirm order | Display instructions |

## Storage

```
localStorage: "padiescakes-cart"
├─ Persists across sessions
├─ Automatically synced
└─ Cleared on order completion
```

## Error Handling

```
Checkout Form
├─ Client-side validation
│  ├─ Required fields
│  ├─ Email format
│  └─ Date validation
│
API Route
├─ Missing API key check
├─ Email send failures
└─ Error responses
```
