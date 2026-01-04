# Padiescakes

A beautiful e-commerce website for Padiescakes, specializing in handcrafted cupcake bouquets, custom cakes, and sweet treats for all occasions.

## Features

### Pages
- **Home**: Hero section, occasion CTAs (Wedding/Birthday/Corporate), size guide showing 7/19/44/86 bouquets with serving sizes, testimonials, and Instagram feed
- **Shop**: Filter chips by category, product grid with hover quick-add functionality
- **Product**: Image gallery, visual flavor chips (Vanilla, Chocolate, Lemon, Strawberry), dietary add-ons with pricing, and notes field
- **Contact**: Contact form with occasion selection and FAQs

### Components
- **Header**: Responsive navigation with cart icon
- **Trust Bar**: Key selling points (Fresh Daily, Same-Day Delivery, Custom Orders Welcome)
- **Sticky Mobile Cart Button**: Fixed cart button visible only on mobile devices
- **Footer**: Quick links and social media integration

### Products
- **Bouquets**: 4 sizes (7, 19, 44, 86 cupcakes)
- **Boxed Cupcakes**: 6, 12, and 24 piece options
- **Custom Cakes**: 6", 8", and 10" sizes
- **Cake Pops**: 12, 24, and 48 piece options

### Flavors
- Vanilla
- Chocolate
- Lemon
- Strawberry

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Heroicons
- **Code Quality**: ESLint

## Getting Started

### Prerequisites
- Node.js 18+ installed

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## Project Structure

```
padiescakes/
├── app/                    # Next.js app directory
│   ├── contact/           # Contact page
│   ├── product/[id]/      # Dynamic product pages
│   ├── shop/              # Shop page
│   ├── globals.css        # Global styles with Tailwind
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── StickyMobileCartButton.tsx
│   └── TrustBar.tsx
├── lib/                   # Utility functions and data
│   └── products.ts        # Product data and types
├── next.config.ts         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## Development

- All pages are server-side rendered or statically generated for optimal performance
- Responsive design works seamlessly across desktop, tablet, and mobile devices
- Product data is centralized in `lib/products.ts` for easy management
- Custom color palette defined in `app/globals.css` using Tailwind CSS v4 theme syntax

## License

ISC