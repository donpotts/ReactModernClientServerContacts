// src/data/gridData.js

/**
 * Returns a static array of grid data items.
 * In a real application, this might fetch data from an API.
 * @returns {Array<Object>} An array of grid data objects.
 */
export const getHomeGridData = () => {
  const GRID_DATA = [
    { id: 1, name: "Product A", description: "High-quality product with excellent features.", image: "https://placehold.co/100x100/A78BFA/ffffff?text=ProdA" },
    { id: 2, name: "Service B", description: "Reliable and efficient service tailored for your needs.", image: "https://placehold.co/100x100/60A5FA/ffffff?text=ServB" },
    { id: 3, name: "Solution C", description: "Innovative solution to complex problems.", image: "https://placehold.co/100x100/34D399/ffffff?text=SoluC" },
    { id: 4, name: "Item D", description: "Durable and stylish, a perfect addition.", image: "https://placehold.co/100x100/FACC15/ffffff?text=ItemD" },
    { id: 5, name: "Gadget E", description: "Cutting-edge technology for modern living.", image: "https://placehold.co/100x100/FB923C/ffffff?text=GadgE" },
    { id: 6, name: "Software F", description: "Boost your productivity with our intuitive software.", image: "https://placehold.co/100x100/EF4444/ffffff?text=SoftF" },
  ];
  return GRID_DATA;
};