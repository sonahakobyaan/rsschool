import { useEffect, useState } from "react";
import { fetchProducts } from "@/api/api";
import type { Product } from "@/types/product";
import { coffee } from "@/assets/coffee/coffee.ts";
import { tea } from "@/assets/tea/tea.ts";
import { dessert } from "@/assets/dessert/dessert.ts";

const Menu = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCategoryImage = (category: string, index: number) => {
    console.log(category, index)
    switch (category) {
      case "coffee":
        return coffee[index];
      case "tea":
        return tea[index];
      case "dessert":
        return dessert[index];
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="sections">
        <section className="top">
          <h2 className="about-h1">
            Behind each of our cups hides an
            <span className="accent"> amazing surprise</span>
          </h2>
        </section>
        <section className="data">
          <div className="loader" id="coffee-loader">
            Loading...
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sections">
        <section className="top">
          <h2 className="about-h1">
            Behind each of our cups hides an
            <span className="accent"> amazing surprise</span>
          </h2>
        </section>
        <section className="data">
          <div className="about-h1" id="failed_load">
            {error}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="sections">
      <section className="top">
        <h2 className="about-h1">
          Behind each of our cups hides an
          <span className="accent"> amazing surprise</span>
        </h2>
        <div id="categories-container">
        </div>
      </section>

      <section className="data">
        <div className="data-container">
          {products.map((product, index) => {
            console.log(index)
            return (
              <div key={product.id} className="product">
                <div className="item_wrapper product_img">
                  <div
                    className="item" style={{backgroundImage: `url(${getCategoryImage(product.category, index)})`, backgroundSize: "cover", backgroundPosition: "center", width:"100%", height:"310px"}}></div>
                </div>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">${product.price.toFixed(2)}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Menu;
