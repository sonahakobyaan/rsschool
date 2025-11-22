import { useEffect, useState } from "react";
import { message } from "antd";

import { api } from "@/api/api";

import dessertImg from "../../assets/icons/dessert.png";
import coffeImg from "../../assets/icons/coffee.png";
import teaImg from "../../assets/icons/tea.png";

import getCategoryImage from "@/pages/Menu/utils/getCategoryImage.ts";
import LoadMore from "@/pages/Menu/components/LoadMore.tsx";
import { toFloat } from "@/utils/toFloat";
import { isLoggedIn } from "@/utils/auth";

import type { Product } from "@/types/product";
import ProductModal from "./components/Modal";
import { handleMobile } from "@/utils/mobile";

const categories = ["coffee", "tea", "dessert"] as const;

type Category = (typeof categories)[number];

const categoryIcons: Record<Category, string> = {
  dessert: dessertImg,
  coffee: coffeImg,
  tea: teaImg,
};

const categoryLabels: Record<Category, string> = {
  dessert: "Desserts",
  coffee: "Coffee",
  tea: "Tea",
};

const INITIAL_MOBILE_COUNT = 4;
const LOAD_MORE_STEP = 4;

const Menu = () => {
  const [visibleCount, setVisibleCount] =
    useState<number>(INITIAL_MOBILE_COUNT);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [detailedProduct, setDetailedProduct] = useState<
    (Product & { categoryIndex?: number }) | null
  >(null);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1000
  );
  const [selectedSize, setSelectedSize] = useState<string>("s");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedAdditives, setSelectedAdditives] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>("coffee");
  const isMobile = handleMobile();
  useEffect(() => {
    if (isLoggedIn()) {
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setVisibleCount(isMobile ? INITIAL_MOBILE_COUNT : Infinity);
  }, [windowWidth, isMobile]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await api.fetchProducts();
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

  const openModal = async (product: Product, categoryIndex: number) => {
    setModalOpen(true);
    setModalLoading(true);
    document.body.classList.add("no-scroll");

    try {
      const fullProduct = await api.fetchProductById(product.id);
      const productWithIndex = { ...fullProduct, categoryIndex };
      setDetailedProduct(productWithIndex);

      const availableSizeKey = fullProduct.sizes
        ? Object.keys(fullProduct.sizes)[0]
        : "s";
      setSelectedSize(availableSizeKey);
      setSelectedAdditives([]);
    } catch {
      message.error("Product not found");
      closeModal();
    } finally {
      setTimeout(() => {
        setModalLoading(false);
      }, 100);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setDetailedProduct(null);
    setSelectedSize("s");
    setSelectedAdditives([]);
    document.body.classList.remove("no-scroll");
  };

  const toggleAdditive = (name: string) => {
    setSelectedAdditives((prev) =>
      prev.includes(name)
        ? prev.filter((a) => a !== name)
        : prev.length < 3
        ? [...prev, name]
        : prev
    );
  };
  const displayedProducts = isMobile
    ? filteredProducts.slice(0, visibleCount)
    : filteredProducts;
  const hasMore = filteredProducts.length > visibleCount;

  const handleLoadMore = () => {
    setRotating(true);
    setTimeout(() => {
      setRotating(false);
      setVisibleCount((prev) =>
        Math.min(prev + LOAD_MORE_STEP, filteredProducts.length)
      );
    }, 1000);
  };

  const getDisplayPrice = (product: Product) => {
    if (
      loggedIn &&
      product.discountPrice &&
      toFloat(product.discountPrice) < toFloat(product.price)
    ) {
      return { price: product.discountPrice, original: product.price };
    }
    return { price: product.price, original: null };
  };

  if (loading)
    return (
      <div className="sections">
        <section className="data">
          <div className="loader"></div>
        </section>
      </div>
    );

  if (error)
    return (
      <div className="sections">
        <section className="data">
          <p className="error">{error}</p>
        </section>
      </div>
    );

  return (
    <>
      <div className="sections">
        <section className="top">
          <h2 className="about-h1">
            Behind each of our cups hides an{" "}
            <span className="accent">amazing surprise</span>
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
              <p className="about-h1">
                Something went wrong. Please refresh the page
              </p>
            ) : (
              <>
                {displayedProducts.map((product, idx) => {
                  const categoryIndex =
                    filteredProducts
                      .slice(0, idx + 1)
                      .filter((p) => p.category === product.category).length -
                    1;

                  const { price: displayPrice, original } =
                    getDisplayPrice(product);

                  return (
                    <div
                      key={product.id}
                      className="product"
                      onClick={() => openModal(product, categoryIndex)}
                      style={{ cursor: "pointer" }}
                    >
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
                        />
                      </div>
                      <div className="item_info">
                        <div className="item_text">
                          <h1 className="name">{product.name}</h1>
                          <p className="description">{product.description}</p>
                        </div>
                        <div className="item_price">
                          {original ? (
                            <>
                              <span className="horisontal-line">
                                ${toFloat(original).toFixed(2)}
                              </span>{" "}
                              <strong>
                                ${toFloat(displayPrice).toFixed(2)}
                              </strong>
                            </>
                          ) : (
                            <strong>${toFloat(displayPrice).toFixed(2)}</strong>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {isMobile && (hasMore || rotating) && (
                  <button onClick={handleLoadMore} className="load-more">
                    <LoadMore rotating={rotating} />
                  </button>
                )}
              </>
            )}
          </div>
        </section>
      </div>
      {modalOpen && (
        <ProductModal
          open={modalOpen}
          loading={modalLoading}
          product={detailedProduct}
          selectedSize={selectedSize}
          selectedAdditives={selectedAdditives}
          loggedIn={loggedIn}
          onClose={closeModal}
          onSizeChange={setSelectedSize}
          onAdditiveToggle={toggleAdditive}
          getCategoryImage={getCategoryImage}
        />
      )}
    </>
  );
};

export default Menu;
