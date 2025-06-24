import { Link } from "react-router-dom";
import WishlistButton from "./WishlistButton";
import useRecentlyViewed from "../hooks/useRecentlyViewed";

export default function ProductCard({ product, compact = false }) {
  // Track this product as recently viewed
  useRecentlyViewed(product);

  return (
    <div className={`group relative ${compact ? "p-1 sm:p-2" : "p-2 sm:p-4"}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        {/* Product Image */}
        <Link
          to={`/products/${product.id}`}
          className="block aspect-square overflow-hidden"
        >
          <div className="w-full h-40 sm:h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center relative">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <span className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                Product Image
              </span>
            )}
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-3 sm:p-4 flex-grow flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <Link
              to={`/products/${product.id}`}
              className="text-base sm:text-lg font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2"
            >
              {product.name}
            </Link>
            <WishlistButton productId={product.id} />
          </div>

          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-2">
            {product.description}
          </p>

          {/* Tags (if available) */}
          {product.aiTags && (
            <div className="flex gap-1 sm:gap-2 mb-3 sm:mb-4 flex-wrap">
              {product.aiTags.ecoScore > 0.7 && (
                <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                  Eco-Friendly
                </span>
              )}
              {product.aiTags.techLevel > 0.7 && (
                <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                  High-Tech
                </span>
              )}
            </div>
          )}

          <div className="mt-auto flex items-center justify-between flex-wrap gap-2">
            <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              ${product.price.toFixed(2)}
            </span>
            <button
              className="px-2 sm:px-3 py-1 bg-indigo-600 text-white text-xs sm:text-sm rounded-md hover:bg-indigo-700 transition-colors whitespace-nowrap"
              onClick={() => console.log("Add to cart", product.id)} // Replace with your cart function
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
