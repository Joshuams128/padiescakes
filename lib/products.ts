export interface Product {
  id: string;
  name: string;
  category: 'bouquets' | 'boxed-cupcakes' | 'mini-cupcakes' | 'cakes' | 'party-favours';
  description: string;
  basePrice: number;
  image: string;
  secondaryImage?: string;
  flavors: string[];
  colors?: string[];
  dietaryPrices?: Record<string, number>;
  maxFlavors?: number;
  minOrder?: number;
  sizes?: {
    name: string;
    pieces: number;
    price: number;
    serves: string;
  }[];
}

export const flavors = ['Vanilla', 'Chocolate', 'Lemon', 'Strawberry'];

export const cakeFillings = [
  { id: 'vanilla-buttercream', name: 'Vanilla Buttercream', price: 0 },
  { id: 'cream-cheese', name: 'Cream Cheese', price: 3 },
  { id: 'chocolate-ganache', name: 'Chocolate Ganache', price: 3 },
  { id: 'biscoff', name: 'Biscoff', price: 5 },
];

export const dietaryAddons = [
  { id: 'gluten-free', name: 'Gluten-Free', price: 5 },
  { id: 'vegan', name: 'Vegan', price: 8 },
  { id: 'dairy-free', name: 'Dairy-Free', price: 3 },
];

export const products: Product[] = [
  // Bouquets
  {
    id: '14-mini-cupcake-bouquet-on-a-cake-board',
    name: '14 Mini Cupcake Bouquet on a Cake Board',
    category: 'mini-cupcakes',
    description: 'A charming display of 14 mini cupcakes elegantly arranged on a cake board. Each mini cupcake is a delightful treat, hand-piped with buttercream flowers. Perfect for intimate gatherings or as a stunning table centerpiece.',
    basePrice: 50,
    image: '/images/14MiniCupcake.jpeg',
    flavors: ['Vanilla', 'Chocolate'],
    sizes: [
      { name: 'Small', pieces: 14, price: 50, serves: '8-14 people' },
    ],
  },
  {
    id: '7-cupcake-bouquet',
    name: '7-Cupcake Bouquet',
    category: 'bouquets',
    description: 'A charming arrangement of seven hand-piped floral cupcakes, elegantly wrapped with a bow. Choice of one flavour, with vegan, gluten free, and dairy free options available for an extra cost.',
    basePrice: 65,
    image: '/images/7-bouquet.png',
    flavors: ['Lemon', 'Vanilla', 'Chocolate', 'Strawberry'],
    sizes: [
      { name: 'Small', pieces: 7, price: 65, serves: '5-7 people' },
    ],
  },
  {
    id: 'all-my-love',
    name: 'All My Love',
    category: 'bouquets',
    description: 'A romantic arrangement of seven hand-piped floral cupcakes in your choice of pink or red, elegantly wrapped with a bow. Perfect for anniversaries, Valentine\'s Day, or showing someone special how much you care.',
    basePrice: 65,
    image: '/images/7-cupcake-bouquet.jpg',
    secondaryImage: '/images/allmylove-2.JPG',
    flavors: ['Vanilla', 'Chocolate', 'Strawberry', 'Lemon'],
    colors: ['Pink', 'Red'],
    sizes: [
      { name: 'Small', pieces: 7, price: 65, serves: '5-7 people' },
    ],
  },
  {
    id: '12-cupcake-bouquet',
    name: '12-Cupcake Bouquet',
    category: 'bouquets',
    description: 'A beautiful bouquet of twelve hand-piped floral cupcakes, elegantly arranged and wrapped with a bow. Choice of up to 2 flavours, with vegan, gluten free, and dairy free options available for an extra cost.',
    basePrice: 95,
    image: '/images/12cupcakebouquet.png',
    flavors: ['Lemon', 'Vanilla', 'Chocolate', 'Strawberry'],
    maxFlavors: 2,
    sizes: [
      { name: 'Standard', pieces: 12, price: 95, serves: '10-12 people' },
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
    dietaryPrices: { 'gluten-free': 20, 'dairy-free': 20 },
    maxFlavors: 4,
    sizes: [
      { name: 'Large', pieces: 44, price: 350, serves: '35-44 people' },
    ],
  },
  {
    id: '86-cupcake-bouquet',
    name: '86-Cupcake Bouquet',
    category: 'bouquets',
    description: 'A bouquet of 86 floral-designed cupcakes.',
    basePrice: 750,
    image: '/images/86cupcakes.png',
    flavors: ['Chocolate', 'Confetti', 'Lemon', 'Strawberry', 'Vanilla'],
    dietaryPrices: { 'gluten-free': 30, 'dairy-free': 30 },
    maxFlavors: 4,
    sizes: [
      { name: 'Extra Large', pieces: 86, price: 750, serves: '70-86 people' },
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
    secondaryImage: '/images/12-cupcakes-box.png',
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
    secondaryImage: '/images/floralcupcakes-6.jpg',
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
    id: 'box-24-mini-floral-boxed',
    name: 'Box of 24 Mini Floral Cupcakes',
    category: 'boxed-cupcakes',
    description: 'Two dozen hand-piped mini floral cupcakes, perfect for larger gatherings. Choice of two flavours: vanilla, chocolate, lemon, or strawberry.',
    basePrice: 55,
    image: '/images/24-mini-floral-cupcakes.jpg',
    flavors: ['Vanilla', 'Chocolate', 'Lemon', 'Strawberry'],
    maxFlavors: 2,
  },
  {
    id: 'box-12-mini-floral-boxed',
    name: 'Box of 12 Mini Floral Cupcakes',
    category: 'boxed-cupcakes',
    description: 'A delightful dozen of miniature cupcakes, each one a tiny masterpiece of floral design. These petite treats are perfect for sharing at gatherings or as a charming gift. Every cupcake is hand-piped with vibrant flowers, creating a stunning and delicious display. Choice of 1 flavour.',
    basePrice: 30,
    image: '/images/mini-box-12.jpg',
    flavors: ['Vanilla', 'Chocolate'],
  },
  {
    id: '24-boxed-cupcakes',
    name: 'Box of 24 Mini Floral Cupcakes',
    category: 'mini-cupcakes',
    description: 'Two dozen hand-piped mini floral cupcakes, perfect for larger gatherings. Choice of two flavours: vanilla, chocolate, lemon, or strawberry.',
    basePrice: 55,
    image: '/images/24-mini-floral-cupcakes.jpg',
    flavors: ['Vanilla', 'Chocolate', 'Lemon', 'Strawberry'],
    maxFlavors: 2,
  },
  {
    id: '12-mini-floral-cupcakes-box',
    name: 'Box of 12 Mini Floral Cupcakes',
    category: 'mini-cupcakes',
    description: 'A delightful dozen of miniature cupcakes, each one a tiny masterpiece of floral design. These petite treats are perfect for sharing at gatherings or as a charming gift. Every cupcake is hand-piped with vibrant flowers, creating a stunning and delicious display. Choice of 1 flavour.',
    basePrice: 30,
    image: '/images/mini-box-12.jpg',
    flavors: ['Vanilla', 'Chocolate'],
  },

  // Cakes
  {
    id: 'heart-shaped-vintage-cake',
    name: 'Heart Shaped Vintage Cake',
    category: 'cakes',
    description: 'A heart-shaped vintage cake with moist cake layers that features delicate, rich layers of cake that are soft and flavourful.',
    basePrice: 100,
    image: '/images/heart-shaped-vintage-cake.jpg',
    flavors: ['Vanilla', 'Chocolate', 'Lemon', 'Strawberry', 'Carrot', 'Red Velvet'],
    sizes: [
      { name: '6 Inch', pieces: 1, price: 100, serves: '4-6 people' },
      { name: '9 Inch', pieces: 1, price: 140, serves: '8-10 people' },
    ],
  },
  {
    id: '8-inch-vintage-cake',
    name: '8 Inch Cake',
    category: 'cakes',
    description: '4 layers of cake',
    basePrice: 145,
    image: '/images/vintagecake2.jpeg',
    flavors: ['Carrot', 'Chocolate', 'Lemon', 'Red Velvet', 'Vanilla'],
  },

  // Cake Pops
  {
    id: 'a-dozen-cake-pops',
    name: 'A Dozen Cake Pops',
    category: 'party-favours',
    description: 'A dozen delicious cake pops. Each pop is moist, flavourful, and beautifully decorated — ideal for parties, gifts, or a sweet personal treat.',
    basePrice: 36,
    image: '/images/dozencakepops.jpeg',
    flavors: ['Lemon', 'Vanilla'],
  },

  // Party/Wedding Favours
  {
    id: 'party-wedding-favours',
    name: 'Party/Wedding Favours',
    category: 'party-favours',
    description: 'A single cupcake perfect for party and wedding favours. Minimum order of 10 required.',
    basePrice: 6,
    image: '/images/single-cupcake.JPG',
    flavors: ['Vanilla', 'Chocolate', 'Lemon', 'Strawberry'],
    minOrder: 10,
  },

];

export const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'bouquets', name: 'Bouquets' },
  { id: 'boxed-cupcakes', name: 'Boxed Cupcakes' },
  { id: 'mini-cupcakes', name: 'Mini Cupcakes' },
  { id: 'cakes', name: 'Cakes' },
  { id: 'party-favours', name: 'Party Favours' },
];
