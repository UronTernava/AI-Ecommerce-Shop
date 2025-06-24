import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiShoppingCart } from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import useRecentlyViewed from "../hooks/useRecentlyViewed";
import WishlistButton from "../components/WishlistButton";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  // Track this product as recently viewed
  useRecentlyViewed(product);

  useEffect(() => {
    // Simulate API fetch
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Replace with actual API call
        const mockProducts = [
          {
            id: 1,
            name: "Smart Eco Water Bottle",
            price: 29.99,
            description:
              "Reduces plastic waste by 90%. Made from sustainable materials with smart hydration tracking.",
            longDescription:
              "This innovative water bottle combines eco-friendly materials with smart technology...",
            images: ["/placeholder-bottle.jpg", "/placeholder-bottle-2.jpg"],
            aiTags: { ecoScore: 0.95, techLevel: 0.2 },
            specs: {
              material: "Recycled Stainless Steel",
              capacity: "750ml",
              weight: "350g",
            },
          },
          // Add other products...
        ];

        const foundProduct = mockProducts.find((p) => p.id === parseInt(id));
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate loading

        setProduct(foundProduct);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">
          Loading product...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">
          Product not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/products"
          className="flex items-center text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 mb-6"
        >
          <FiArrowLeft className="mr-2" /> Back to Products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {product.images ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">
                    Product Image
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images?.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white dark:bg-gray-800 rounded-md border ${
                    selectedImage === index
                      ? "border-indigo-600 dark:border-indigo-400"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {product.name}
              </h1> 
              <WishlistButton productId={product.id} />
            </div>

            <p className="text-lg font-bold text-gray-900 dark:text-white mt-4">
              ${product.price.toFixed(2)}
            </p>

            <p className="mt-4 text-gray-700 dark:text-gray-300">
              {product.longDescription || product.description}
            </p>

            {/* Specifications */}
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Specifications
              </h3>
              <ul className="mt-2 space-y-2">
                {product.specs &&
                  Object.entries(product.specs).map(([key, value]) => (
                    <li key={key} className="flex">
                      <span className="text-gray-500 dark:text-gray-400 w-32">
                        {key}:
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {value}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>

            <button className="mt-8 w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
              <FiShoppingCart className="mr-2" />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Recently Viewed */}
        <div className="mt-16">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Replace with actual related products */}
            <ProductCard
              product={{
                id: 2,
                name: "Wireless Headphones",
                price: 199.99,
                description: "Premium sound quality",
                image: "/placeholder-headphones.jpg",
              }}
              compact
            />
          </div>
        </div>

        {/* see more products button */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/products-more"
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            See more products
          </Link>
        </div>
      </div>
    </div>
  );
}
