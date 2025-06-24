import { useEffect, useState } from "react";

export default function useRecentlyViewed(product = null) {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const isValidProduct = product && typeof product.id !== "undefined";
  if (product && !isValidProduct) {
    console.warn("Invalid product data for recently viewed");
    return;
  }

  useEffect(() => {
    try {
      const stored = localStorage.getItem("recentlyViewed");
      // Initialize with empty array if no data exists
      const parsed = stored ? JSON.parse(stored) : [];
      setRecentlyViewed(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      console.error("Error parsing recently viewed:", error);
      setRecentlyViewed([]);
    }
  }, []);

  useEffect(() => {
    if (product) {
      try {
        setRecentlyViewed((prev) => {
          const filtered = prev.filter((p) => p.id !== product.id);
          const updated = [product, ...filtered].slice(0, 5);
          localStorage.setItem("recentlyViewed", JSON.stringify(updated));
          return updated;
        });
      } catch (error) {
        console.error("Error updating recently viewed:", error);
      }
    }
  }, [product]);

  return recentlyViewed;
}
