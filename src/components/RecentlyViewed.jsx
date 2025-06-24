import { Link } from "react-router-dom";
import useRecentlyViewed from "../hooks/useRecentlyViewed";
import ProductCard from "./ProductCard";

export default function RecentlyViewed() {
  const recentlyViewed = useRecentlyViewed();

  if (recentlyViewed.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold mb-4 dark:text-white">
        Recently Viewed
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {recentlyViewed.map((product) => (
          <Link
            to={`/products/${product.id}`}
            key={product.id}
            className="hover:scale-[1.02] transition-transform"
          >
            <ProductCard product={product} compact />
          </Link>
        ))}
      </div>
    </section>
  );
}
