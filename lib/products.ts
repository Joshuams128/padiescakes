export interface Product {
  id: string;
  name: string;
  category: 'bouquets' | 'boxed-cupcakes' | 'cakes' | 'cake-pops';
  description: string;
  basePrice: number;
  image: string;
  flavors: string[];
  maxFlavors?: number;
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
    id: '14-mini-cupcake-bouquet-on-a-cake-board',
    name: '14 Mini Cupcake Bouquet on a Cake Board',
    category: 'bouquets',
    description: 'A charming display of 14 mini cupcakes elegantly arranged on a cake board. Each mini cupcake is a delightful treat, hand-piped with buttercream flowers. Perfect for intimate gatherings or as a stunning table centerpiece.',
    basePrice: 55,
    image: '/images/14MiniCupcake.jpeg',
    flavors: ['Vanilla', 'Chocolate'],
    sizes: [
      { name: 'Small', pieces: 14, price: 55, serves: '8-14 people' },
    ],
  },
  {
    id: '7-cupcake-bouquet',
    name: '7-Cupcake Bouquet',
    category: 'bouquets',
    description: 'A charming arrangement of seven beautifully floral decorated cupcakes, perfect for a small gesture of love. Each cupcake is hand-piped with delicate, blooming flowers, making it an ideal gift for a thank you or a sweet surprise. Comes elegantly wrapped with a beautiful bow and in our premium packaging.\n\nChoice of 1 flavour.\nThe pictures shown are examples.\nYou can share with us the colours & design you want during checkout.\n\nWe can also do these as Vegan, Gluten Free and / or Dairy Free for an extra cost.',
    basePrice: 65,
    image: '/images/7-cupcake-bouquet.jpg',
    flavors: ['Lemon', 'Vanilla', 'Chocolate', 'Strawberry'],
    sizes: [
      { name: 'Small', pieces: 7, price: 65, serves: '5-7 people' },
    ],
  },
  {
    id: '19-cupcake-bouquet',
    name: '19-Cupcake Bouquet',
    category: 'bouquets',
    description: 'Indulge in the ultimate treat with our 19 Floral Cupcake Bouquet. This exquisite arrangement features nineteen stunning cupcakes, each meticulously decorated to resemble a different flower. Perfect for larger gatherings or special occasions, this bouquet is sure to impress with its intricate designs and vibrant colors. It\'s a feast for both the eyes and the palate.',
    basePrice: 150,
    image: '/images/19cupcake.webp',
    flavors: ['Vanilla', 'Chocolate', 'Lemon', 'Strawberry'],
    maxFlavors: 3,
    sizes: [
      { name: 'Standard', pieces: 19, price: 150, serves: '15-19 people' },
    ],
  },
  {
    id: '44-cupcake-bouquet',
    name: '44-Cupcake Bouquet',
    category: 'bouquets',
    description: 'A grand bouquet comprising forty-four cupcakes, meticulously adorned with intricate floral designs. This generous arrangement is perfect for weddings, large parties, or corporate events. Each cupcake is a masterpiece, assembled together to create a stunning floral display that will impress any crowd.\n\nChoice of 4 flavours.\nThe pictures shown are examples.\nYou can share with us the colours & design you want during checkout.\n\nWe can also do these as Vegan, Gluten Free and / or Dairy Free for an extra cost.',
    basePrice: 350,
    image: '/images/44-Cupcake-Bouquet-scaled.jpg',
    flavors: ['Vanilla', 'Chocolate', 'Lemon', 'Strawberry'],
    maxFlavors: 4,
    sizes: [
      { name: 'Large', pieces: 44, price: 350, serves: '35-44 people' },
    ],
  },

  // Boxed Cupcakes
  {
    id: '12-floral-cupcakes',
    name: '12 Floral Cupcakes',
    category: 'boxed-cupcakes',
    description: 'Twelve hand-decorated floral cupcakes, each topped with intricate buttercream flowers, beautifully presented in a clear-window gift box. Choose up to 2 flavours and customise your colours and design at checkout. Available in Vegan, Gluten Free, and/or Dairy Free options for an additional cost.',
    basePrice: 60,
    image: '/images/12-Floral-Cupcakes-scaled.jpg',
    flavors: ['Vanilla', 'Chocolate', 'Lemon', 'Strawberry'],
    maxFlavors: 2,
  },
  {
    id: '6-floral-cupcakes',
    name: '6 Floral Cupcakes',
    category: 'boxed-cupcakes',
    description: 'A delightful assortment of six intricately decorated floral cupcakes. Each cupcake is a work of art, hand-piped with buttercream flowers in vibrant colors. This box is perfect for small gatherings or as a thoughtful gift to brighten someone\'s day.\n\nChoice of up to 1 flavour.\nThe picture shown is an example.\nYou can share with us the colours & design you want during checkout.',
    basePrice: 30,
    image: '/images/6floralcucpakes-scaled.jpg',
    flavors: ['Vanilla', 'Chocolate', 'Lemon', 'Strawberry'],
  },
  {
    id: '4-cupcake-giftbox',
    name: 'Cupcake Gift Box – Box of 4',
    category: 'boxed-cupcakes',
    description: 'Elevate your gift-giving with our elegant Cupcake Giftbox. This delightful set includes four exquisitely decorated cupcakes, each nestled in a clear, chic giftbox with convenient straps for easy carrying. Perfect for any occasion, from birthdays to thank-you gestures, this giftbox combines both beauty and taste. Each cupcake is a masterpiece, ensuring a memorable and delicious surprise for the lucky recipient.\n\nChoice of up to 1 flavour.\nThe picture shown is an example.\nYou can share with us the colours & design you want during checkout.',
    basePrice: 30,
    image: '/images/giftbox.webp',
    flavors: ['Vanilla', 'Chocolate', 'Lemon', 'Strawberry'],
  },
  {
    id: '24-boxed-cupcakes',
    name: '24 Boxed Cupcakes',
    category: 'boxed-cupcakes',
    description: 'Two dozen cupcakes for larger gatherings.',
    basePrice: 85,
    image: '/images/24-mini-floral-cupcakes.jpg',
    flavors: ['Vanilla', 'Chocolate', 'Lemon', 'Strawberry'],
  },

  // Cakes
  {
    id: 'heart-shaped-vintage-cake',
    name: 'Heart Shaped Vintage Cake',
    category: 'cakes',
    description: 'A 6-inch heart-shaped vintage cake with moist cake layers that features delicate, rich layers of cake that are soft and flavourful.',
    basePrice: 55,
    image: '/images/heart-shaped-vintage-cake.jpg',
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
