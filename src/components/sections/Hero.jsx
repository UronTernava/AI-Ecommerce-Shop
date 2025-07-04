import { Link } from "react-router-dom";

// Mock promotional products data
const promoProducts = [
  {
    id: 101,
    name: "Summer Special Bundle",
    price: 89.99,
    discount: 30,
    image: "/headphones.jpg",
  },
  {
    id: 102,
    name: "Limited Edition Headphones",
    price: 179.99,
    discount: 20,
    image: "/headphones.jpg",
  },
  {
    id: 103,
    name: "Eco Starter Kit",
    price: 49.99,
    discount: 15,
    image: "/headphones.jpg",
  },
];

export default function Hero() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section
        id="home"
        className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white pt-16 sm:pt-20 md:pt-24 pb-20 sm:pb-24 md:pb-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="block">Shop Smarter,</span>
            <span className="block bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">
              Powered by AI
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 max-w-2xl sm:max-w-3xl mx-auto px-2">
            Discover products uniquely matched to your taste with our machine
            learning engine.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0">
            <button className="px-6 sm:px-8 py-3 bg-white text-indigo-600 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg hover:shadow-xl text-sm sm:text-base">
              Try AI Recommendations
            </button>
            <button className="px-6 sm:px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition text-sm sm:text-base">
              How It Works
            </button>
          </div>
        </div>
      </section>

      {/* Promotional Products Section */}
      <div className="bg-gradient-to-b from-indigo-600 to-purple-700 pt-12 sm:pt-16 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-lg sm:text-xl font-bold text-center mb-6 sm:mb-8 text-white">
            🔥 Hot Deals This Week
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {promoProducts.map((product) => (
              <Link
                to="/products"
                key={product.id}
                className="bg-white/20 rounded-xl p-3 sm:p-4 backdrop-blur-sm border border-white/30 hover:scale-105 transition-transform duration-300"
              >
                <div className="h-32 sm:h-40 bg-white/30 rounded-lg mb-3 flex items-center justify-center">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full object-contain"
                    />
                  ) : (
                    <span className="text-gray-300 text-sm sm:text-base">Product Image</span>
                  )}
                </div>
                <h4 className="font-semibold text-white text-sm sm:text-base">{product.name}</h4>
                <div className="flex items-center mt-1 flex-wrap">
                  <span className="text-yellow-300 font-bold text-sm sm:text-base">
                    ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </span>
                  <span className="ml-2 text-xs sm:text-sm text-white/70 line-through">
                    ${product.price}
                  </span>
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    -{product.discount}%
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-6 sm:mt-8">
            <Link
              to="/products"
              className="inline-block px-4 sm:px-6 py-2 bg-white text-indigo-600 rounded-full font-medium hover:bg-gray-100 transition text-sm sm:text-base"
            >
              View All Deals →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
