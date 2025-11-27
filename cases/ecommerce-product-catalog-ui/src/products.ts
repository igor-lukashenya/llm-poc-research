// Product list for the catalog
export type Product = {  
  id: number;
  name: string;
  category: string;
  brand: string;
  price: number;
  rating: number;
  image: string;
  reviews: number;
};

// Auto-generated 96 products with incrementing image ids from 1000
// ...existing code...
// prettier-ignore
export const products: Product[] = Array.from({ length: 96 }, (_, i) => {
  const id = i + 1;
  const categories = ['Electronics', 'Sportswear', 'Accessories', 'Home', 'Toys'];
  const brands = ['SoundMagic', 'TechTime', 'RunFast', 'ZenFit', 'UrbanStyle', 'SunGuard', 'BoomBox', 'FitPulse', 'PackPro', 'CapKing', 'HydroMax', 'ChargeUp'];
  const names = [
    'Wireless Headphones', 'Smart Watch', 'Running Shoes', 'Yoga Mat', 'Leather Wallet', 'Sunglasses', 'Bluetooth Speaker', 'Fitness Tracker',
    'Backpack', 'Baseball Cap', 'Sports Bottle', 'Wireless Charger', 'Laptop Sleeve', 'Wireless Mouse', 'Duffel Bag', 'Yoga Block',
    'Waterproof Jacket', 'Travel Mug', 'Portable Power Bank', 'Sports Socks', 'Gym Bag', 'Wireless Earbuds', 'Sports Towel', 'Smartphone Stand',
    'Travel Pillow', 'Sports Shorts', 'Laptop Backpack', 'Wireless Keyboard', 'Sports Gloves', 'Travel Organizer', 'Smartphone Case', 'Sports Cap',
    'Travel Adapter', 'Sports Backpack', 'Wireless Router', 'Sports Water Jug', 'Desk Lamp', 'Action Camera', 'Mini Drone', 'Electric Toothbrush',
    'Coffee Grinder', 'Espresso Maker', 'Board Game', 'Puzzle Set', 'Toy Robot', 'RC Car', 'Smart Thermostat', 'Air Purifier',
    'Blender', 'Juicer', 'Electric Kettle', 'Toaster', 'Rice Cooker', 'Slow Cooker', 'Pressure Cooker', 'Food Processor',
    'Hair Dryer', 'Curling Iron', 'Straightener', 'Shaver', 'Trimmer', 'Electric Razor', 'Face Brush', 'Massager',
    'Camping Tent', 'Sleeping Bag', 'Hiking Boots', 'Trekking Poles', 'Travel Mug', 'Picnic Blanket', 'Cooler Bag', 'Portable Grill',
    'Yoga Pants', 'Sports Bra', 'Cycling Gloves', 'Swim Goggles', 'Dumbbells', 'Jump Rope', 'Resistance Bands', 'Foam Roller',
    'Smart Plug', 'Smart Bulb', 'Security Camera', 'Doorbell Camera', 'Robot Vacuum', 'Pet Feeder', 'Pet Fountain', 'Cat Tree',
    'Dog Leash', 'Dog Bed', 'Cat Bed', 'Bird Cage', 'Fish Tank', 'Hamster Wheel', 'Reptile Lamp', 'Aquarium Filter'
  ];
  return {
    id,
    name: names[i % names.length] + (i >= names.length ? ` ${Math.floor(i / names.length) + 1}` : ''),
    category: categories[i % categories.length],
    brand: brands[i % brands.length],
    price: +(Math.random() * 200 + 10).toFixed(2),
    rating: +(Math.random() * 2 + 3).toFixed(1),
    image: `https://placecats.com/${300 + i}/200`,
    reviews: Math.floor(Math.random() * 200) + 10,
  };
});
// ...existing code...
