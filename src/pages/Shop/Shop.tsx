import { api } from "@/api/api.ts";
import type { Product } from "@/types/product";
import { useEffect, useState } from "react";
import Delete from "@/assets/icons/trash.svg"
const Shop = () => {
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState<Product[]>([]);

  useEffect(() => {
    const getFavorites = async () => {
      try {
        const res = await api.fetchFavorites();
        setFavorites(res || []);
        setError("");
      } catch (err) {
        setError("Failed to load favorite coffees");
        console.error(err);
      }
    };
  
    getFavorites();
  }, []);
  
  const totalPrice = 0
  

  return (
    <div className="sections">
      <div id="profile-section">
        <h2 className="about-h1">Cart</h2>

        {error && <p className="text-red-500">{error}</p>}

        <div id="cart-items">
          {favorites.length === 0 && <p>Your cart is empty</p>}

          {favorites.map((item) => (
            <div className="cart-row" key={item.id} data-price={item.discountPrice || item.price}>
              <button className="delete-btn">
                <img src={Delete} alt="Delete" />
              </button>
              <img
                src={`./assets/${item.category}/${item.name.toLowerCase().replace(/\s/g, "-")}.svg`}
                alt={item.name}
                className="product-image"
              />
              <div className="product-info">
                <p className="product-name">{item.name}</p>
                <p className="product-details">{item.category}</p>
              </div>
              <div className="product-price">${item.discountPrice || item.price}</div>
            </div>
          ))}
        </div>

        <h3 id="total-price" className="about-h1">
          Total: ${totalPrice.toFixed(2)}
        </h3>

        <div className="button-contaner-card">
          <button className="login-button">
            <a href="login.html">Sign In</a>
          </button>
          <button className="login-button">
            <a href="registration.html">Registration</a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Shop;
