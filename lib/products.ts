export interface Product {
  id: string;
  name: string;
  category: 'bouquets' | 'boxed-cupcakes' | 'cakes' | 'cake-pops';
  description: string;
  basePrice: number;
  image: string;
  flavors: string[];
  sizes?: {
    name: string;
    pieces: number;
    price: number;
    serves: string;
  }[];
}

export const flavors = ['Vanilla', 'Chocolate', 'Lemon', 'Strawberry'];

export const dietaryAddons = [
  { id: 'gluten-free', name: 'Gluten-Free', price: 5 },
  { id: 'vegan', name: 'Vegan', price: 8 },
  { id: 'sugar-free', name: 'Sugar-Free', price: 6 },
  { id: 'dairy-free', name: 'Dairy-Free', price: 7 },
];

export const products: Product[] = [
  // Bouquets
  {
    id: 'bouquet-small',
    name: 'Small Cupcake Bouquet',
    category: 'bouquets',
    description: 'A delightful arrangement of 7 handcrafted cupcakes, perfect for intimate gatherings.',
    basePrice: 35,
    image: '/images/bouquet-7.jpg',
    flavors: ['Vanilla', 'Chocolate', 'Lemon', 'Strawberry'],
    sizes: [
      { name: 'Small', pieces: 7, price: 35, serves: '5-7 people' },
    ],
  },
  {
    id: 'bouquet-medium',
    name: 'Medium Cupcake Bouquet',
    category: 'bouquets',
    description: 'Our most popular choice with 19 beautifully arranged cupcakes.',
    basePrice: 75,
    image: '/images/bouquet-19.jpg',
    flavors: ['Vanilla', 'Chocolate', 'Lemon', 'Strawberry'],
    sizes: [
      { name: 'Medium', pieces: 19, price: 75, serves: '15-19 people' },
    ],
  },
  {
    id: 'bouquet-large',
    name: 'Large Cupcake Bouquet',
    category: 'bouquets',
    description: 'An impressive display of 44 cupcakes for your special event.',
    basePrice: 140,
    image: '/images/bouquet-44.jpg',
    flavors: ['Vanilla', 'Chocolate', 'Lemon', 'Strawberry'],
    sizes: [
      { name: 'Large', pieces: 44, price: 140, serves: '35-44 people' },
    ],
  },
  {
    id: 'bouquet-xl',
    name: 'XL Cupcake Bouquet',
    category: 'bouquets',
    description: 'Our largest bouquet with 86 cupcakes for grand celebrations.',
    basePrice: 260,
    image: '/images/bouquet-86.jpg',
    flavors: ['Vanilla', 'Chocolate', 'Lemon', 'Strawberry'],
    sizes: [
      { name: 'XL', pieces: 86, price: 260, serves: '70-86 people' },
    ],
  },

  // Boxed Cupcakes
  {
    id: 'cupcakes-6',
    name: '6 Boxed Cupcakes',
    category: 'boxed-cupcakes',
    description: 'Half dozen of our delicious cupcakes in a beautiful box.',
    basePrice: 24,
    image: '/images/boxed-6.jpg',
    flavors: ['Vanilla', 'Chocolate', 'Lemon', 'Strawberry'],
  },
  {
    id: 'cupcakes-12',
    name: '12 Boxed Cupcakes',
    category: 'boxed-cupcakes',
    description: 'A dozen of your favorite cupcakes, perfect for sharing.',
    basePrice: 45,
    image: '/images/boxed-12.jpg',
    flavors: ['Vanilla', 'Chocolate', 'Lemon', 'Strawberry'],
  },
  {
    id: 'cupcakes-24',
    name: '24 Boxed Cupcakes',
    category: 'boxed-cupcakes',
    description: 'Two dozen cupcakes for larger gatherings.',
    basePrice: 85,
    image: '/images/boxed-24.jpg',
    flavors: ['Vanilla', 'Chocolate', 'Lemon', 'Strawberry'],
  },

  // Cakes
  {
    id: 'cake-6inch',
    name: '6" Custom Cake',
    category: 'cakes',
    description: 'Perfect for small celebrations, serves 6-8 people.',
    basePrice: 45,
    image: '/images/cake-6.jpg',
    flavors: ['Vanilla', 'Chocolate', 'Lemon', 'Strawberry'],
  },
  {
    id: 'cake-8inch',
    name: '8" Custom Cake',
    category: 'cakes',
    description: 'Ideal for parties and events, serves 12-16 people.',
    basePrice: 65,
    image: '/images/cake-8.jpg',
    flavors: ['Vanilla', 'Chocolate', 'Lemon', 'Strawberry'],
  },
  {
    id: 'cake-10inch',
    name: '10" Custom Cake',
    category: 'cakes',
    description: 'Perfect for larger celebrations, serves 20-24 people.',
    basePrice: 95,
    image: '/images/cake-10.jpg',
    flavors: ['Vanilla', 'Chocolate', 'Lemon', 'Strawberry'],
  },

  // Cake Pops
  {
    id: 'cake-pops-12',
    name: '12 Cake Pops',
    category: 'cake-pops',
    description: 'A dozen of our delightful cake pops, perfect for parties.',
    basePrice: 30,
    image: '/images/pops-12.jpg',
    flavors: ['Vanilla', 'Chocolate', 'Lemon', 'Strawberry'],
  },
  {
    id: 'cake-pops-24',
    name: '24 Cake Pops',
    category: 'cake-pops',
    description: 'Two dozen cake pops for your celebration.',
    basePrice: 55,
    image: '/images/pops-24.jpg',
    flavors: ['Vanilla', 'Chocolate', 'Lemon', 'Strawberry'],
  },
  {
    id: 'cake-pops-48',
    name: '48 Cake Pops',
    category: 'cake-pops',
    description: 'Four dozen cake pops for large events.',
    basePrice: 100,
    image: '/images/pops-48.jpg',
    flavors: ['Vanilla', 'Chocolate', 'Lemon', 'Strawberry'],
  },
];

export const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'bouquets', name: 'Bouquets' },
  { id: 'boxed-cupcakes', name: 'Boxed Cupcakes' },
  { id: 'cakes', name: 'Cakes' },
  { id: 'cake-pops', name: 'Cake Pops' },
];
