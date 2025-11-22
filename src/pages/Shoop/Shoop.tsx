import { api } from "@/api/api.ts";
import type { Product } from "@/types/product";
import { useEffect, useState } from "react";
import Delete from "@/assets/icons/trash.svg";
import { toFloat } from "@/utils/toFloat";
import { isLoggedIn } from "@/utils/auth";
import getCategoryImage from "@/pages/Menu/utils/getCategoryImage.ts";

const Shoop = () => {
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState<Product[]>([]);

  useEffect(() => {
    const getFavorites = async () => {
      try {
        const res = await api.fetchFavorites();
        setFavorites(res || []);
        setError("");
      } catch {
        setError("Failed to load favorite coffees");
      }
    };

    getFavorites();
  }, []);

  const handleDelete = (id: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const totalPrice = (favorites || []).reduce(
    (sum, item) =>
      sum + toFloat(isLoggedIn() ? item.discountPrice : item.price),
    0
  );

  return (
    <div className="sections">
      <div id="profile-section">
        <h2 className="about-h1">Cart</h2>

        {error && <p className="text-red-500">{error}</p>}
        {!isLoggedIn() && <p className="about-h1 center">Sign In to see you cart.</p>}
        {isLoggedIn() && (
          <div id="cart-items">
            {favorites.length === 0 && <p>Your cart is empty</p>}

            {favorites.map((item) => {
              const index = Number(item.id) - 1;
              return (
                <div
                  className="cart-row"
                  key={item.id}
                  data-price={item.discountPrice || item.price}
                >
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item.id)}
                  >
                    <img src={Delete} alt="Delete" />
                  </button>
                  <img
                    src={getCategoryImage(item.category, index)}
                    alt={item.name}
                    className="product-image"
                  />
                  <div className="product-info">
                    <p className="product-name">{item.name}</p>
                    <p className="product-details">{item.category}</p>
                  </div>
                  <div className="product-price">
                    $
                    {isLoggedIn()
                      ? (item.discountPrice ?? item.price).toFixed(2)
                      : item.price.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <h3 id="total-price" className="about-h1">
          Total: ${isLoggedIn() ? totalPrice.toFixed(2): 0}
        </h3>
      </div>
    </div>
  );
};

export default Shoop;
