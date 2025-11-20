import { useEffect, useState } from "react";
import { fetchProducts } from "@/api/api";
import type { Product } from "@/types/product";
import { coffee } from "@/assets/coffee/coffee.ts";
import { tea } from "@/assets/tea/tea.ts";
import { dessert } from "@/assets/dessert/dessert.ts";
import coffeImg from "../../assets/icons/coffee.png";
import teaImg from "../../assets/icons/tea.png";
import dessertImg from "../../assets/icons/dessert.png";

const categories = ["coffee", "tea", "dessert"] as const;
type Category = (typeof categories)[number];

const categoryIcons: Record<Category, string> = {
  coffee: coffeImg,
  tea: teaImg,
  dessert: dessertImg,
};

const categoryLabels: Record<Category, string> = {
  coffee: "Coffee",
  tea: "Tea",
  dessert: "Desserts",
};

const MOBILE_BREAKPOINT = 768;
const INITIAL_MOBILE_COUNT = 4;
const LOAD_MORE_STEP = 4;

const Menu = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>("coffee");
  const [rotating, setRotating] = useState(false);

  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1000
  );
  const [visibleCount, setVisibleCount] =
    useState<number>(INITIAL_MOBILE_COUNT);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth < MOBILE_BREAKPOINT) {
      setVisibleCount(INITIAL_MOBILE_COUNT);
    } else {
      setVisibleCount(Infinity);
    }
  }, [selectedCategory, windowWidth]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setError(null);
      } catch {
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const filtered = products.filter((p) => p.category === selectedCategory);
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

  const isMobile = windowWidth < MOBILE_BREAKPOINT;
  const displayedProducts = isMobile
    ? filteredProducts.slice(0, visibleCount)
    : filteredProducts;

  const hasMore = filteredProducts.length > visibleCount;

  const handleLoadMore = () => {
    setRotating(true);
setTimeout(() => {
  setRotating(false);
  setVisibleCount((prev) => prev + LOAD_MORE_STEP);
}, 1000);

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
          <p className="error">{error}</p>
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
                <img src={categoryIcons[cat]} alt={categoryLabels[cat]} />
              </div>
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      </section>

      <section className="data">
        <div
          className={
            !filteredProducts.length ? "error-container" : "data-container"
          }
        >
          {!filteredProducts.length ? (
            <div className="about-h1" id="failed_load">
              <p className="error">
                Something went wrong. Please, refresh the page
              </p>
            </div>
          ) : (
            <>
              {displayedProducts.map((product, idx) => {
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
                    <div className="item_info">
                      <div className="item_text">
                        <h1 className="name">{product.name}</h1>
                        <p className="description">{product.description}</p>
                      </div>
                      <div className="item_price">
                        ${product.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isMobile && (hasMore || rotating) && (
                <button onClick={handleLoadMore} className="load-more">
                  <svg
                    width="60"
                    height="60"
                    viewBox="0 0 60 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`rotate-icon ${rotating ? "rotating" : ""}`}
                  >
                    <rect
                      x="0.5"
                      y="0.5"
                      width="59"
                      height="59"
                      rx="29.5"
                      stroke="#665F55"
                    ></rect>
                    <path
                      className="path"
                      d="M39.8883 31.5C39.1645 36.3113 35.013 40 30 40C24.4772 40 20 35.5228 20 30C20 24.4772 24.4772 20 30 20C34.1006 20 37.6248 22.4682 39.1679 26"
                      stroke="#403F3D"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      className="path"
                      d="M35 26H39.4C39.7314 26 40 25.7314 40 25.4V21"
                      stroke="#403F3D"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Menu;
