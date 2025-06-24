import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";
import waterBottleImage from "../../assets/images/waterBottle.jpg";

const products = [
  {
    id: 1,
    name: "Smart Eco Water Bottle",
    price: 29.99,
    description: "Reduces plastic waste by 90%",
    aiTags: { ecoScore: 0.95, techLevel: 0.2 },
    image: waterBottleImage,
  },
  {
    id: 2,
    name: "Wireless Headphones",
    price: 199.99,
    description: "Optimized bass for your music taste",
    aiTags: { ecoScore: 0.3, techLevel: 0.9 },
    image: waterBottleImage,
  },
  {
    id: 3,
    name: "Yoga Mat (Extra Cushion)",
    price: 49.99,
    description: "Selected for your fitness preferences",
    aiTags: { ecoScore: 0.7, techLevel: 0.1 },
    image: waterBottleImage,
  },
];

export default function ProductGrid() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900" id="products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            AI-Suggested Products
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Selected by our algorithm based on your preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/products"
            className="inline-block text-gray-700 dark:text-gray-300 hover:text-indigo-600 
             dark:hover:text-indigo-400 px-6 py-3 text-xl font-semibold transition-all 
             duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] 
             hover:scale-[1.05] border border-gray-400 dark:border-gray-600 
             rounded-xl hover:border-indigo-500"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
