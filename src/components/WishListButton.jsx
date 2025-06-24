import { useState, useEffect } from "react";
import { FiHeart } from "react-icons/fi";
import { useAuth } from "../pages/auth/AuthContext";
import api from "../utils/api";

export default function WishlistButton({ productId }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      checkWishlistStatus();
    }
  }, [isAuthenticated, productId]);

  const checkWishlistStatus = async () => {
    try {
      const response = await api.get('/wishlist');
      const wishlist = response.data.wishlist;
      setIsWishlisted(wishlist.includes(productId));
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      alert("Please login to use wishlist");
      return;
    }

    setLoading(true);
    try {
      if (isWishlisted) {
        await api.delete(`/wishlist/${productId}`);
      } else {
        await api.post(`/wishlist/${productId}`);
      }
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error('Error updating wishlist:', error);
      alert('Failed to update wishlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={`p-1 rounded-full transition-colors ${
        isWishlisted
          ? "text-red-500 fill-red-500"
          : "text-gray-400 hover:text-red-500 dark:hover:text-red-400"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <FiHeart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
    </button>
  );
}
