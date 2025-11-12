import { useEffect, useState } from "react";
import { fetchProducts } from "@/api/api";
import type { Product } from "@/types/product";
import { coffee } from "@/assets/coffee/coffee.ts";
import { tea } from "@/assets/tea/tea.ts";
import { dessert } from "@/assets/dessert/dessert.ts";

const categories = ["coffee", "tea", "dessert"] as const;
type Category = (typeof categories)[number];

const categoryImages: Record<Category, string[]> = {
  coffee,
  tea,
  dessert,
};

const categoryLabels: Record<Category, string> = {
  coffee: "Coffee",
  tea: "Tea",
  dessert: "Desserts",
};

const Menu = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>("coffee");

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

  useEffect(() => {
    if (products.length > 0) {
      const filtered =
        selectedCategory === "all"
          ? products
          : products.filter((p) => p.category === selectedCategory);
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products]);

  const getCategoryImage = (category: string, index: number) => {
    const imageIndex = index + 1;
    switch (category) {
      case "coffee":
        return coffee[imageIndex];
      case "tea":
        return tea[imageIndex];
      case "dessert":
        return dessert[imageIndex];
      default:
        return "";
    }
  };

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
        <div id="categories-container" className="categories-container">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-div ${
                selectedCategory === cat ? "selected" : ""
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              <div className="img-div">
                <img
                  src={`../../assets/icons/${cat}.png`}
                  alt={categoryLabels[cat]}
                />
              </div>
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      </section>

      <section className="data">
        <div className="data-container">
          {filteredProducts.length === 0 ? (
            <p className="no-products">No products found in this category.</p>
          ) : (
            filteredProducts.map((product, idx) => {
              const categoryIndex =
                filteredProducts
                  .slice(0, idx + 1)
                  .filter((p) => p.category === product.category).length - 1;

              return (
                <div key={product.id} className="product">
                  <div className="item_wrapper product_img">
                    <div
                      className="item"
                      style={{
                        backgroundImage: `url(${getCategoryImage(
                          product.category,
                          categoryIndex
                        )})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        width: "100%",
                        height: "310px",
                      }}
                    ></div>
                  </div>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <p className="product-price">${product.price.toFixed(2)}</p>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

export default Menu;
