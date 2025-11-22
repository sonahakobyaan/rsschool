import { useEffect, useState } from "react";
import { message } from "antd";

import { dessert } from "@/assets/dessert/dessert.ts";
import { coffee } from "@/assets/coffee/coffee.ts";
import { tea } from "@/assets/tea/tea.ts";
import { api } from "@/api/api";

import dessertImg from "../../assets/icons/dessert.png";
import coffeImg from "../../assets/icons/coffee.png";
import empty from "@/assets/icons/info-empty.svg";
import teaImg from "../../assets/icons/tea.png";

import { calculatePrice } from "@/pages/Menu/utils/calculatePrice.ts";
import LoadMore from "@/pages/Menu/components/LoadMore.tsx";
import { toFloat } from "@/utils/toFloat";
import { isLoggedIn } from "@/utils/auth";

import type { Product } from "@/types/product";

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
const MOBILE_BREAKPOINT = 768;
const LOAD_MORE_STEP = 4;

const Menu = () => {
  const [visibleCount, setVisibleCount] =
    useState<number>(INITIAL_MOBILE_COUNT);
  const [loading, setLoading] = useState(true);
  const [rotating, setRotating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1000
  );
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>("coffee");

  const [loggedIn, setLoggedIn] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [detailedProduct, setDetailedProduct] = useState<
    (Product & { categoryIndex?: number }) | null
  >(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("s");
  const [selectedAdditives, setSelectedAdditives] = useState<string[]>([]);

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
    setVisibleCount(
      windowWidth < MOBILE_BREAKPOINT ? INITIAL_MOBILE_COUNT : Infinity
    );
  }, [windowWidth, selectedCategory]);

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

  const priceResult = detailedProduct
    ? calculatePrice({
        detailedProduct,
        selectedSize,
        loggedIn,
        selectedAdditives,
      })
    : { base: 0, discount: 0, showDiscount: false };
  const { base: price, discount: discountPrice, showDiscount } = priceResult;

  const isMobile = windowWidth < MOBILE_BREAKPOINT;
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
        <div
          id="product-modal"
          className="modal"
          style={{ display: "block" }}
          onClick={closeModal}
        >
          <div
            className={`${
              modalLoading || !detailedProduct
                ? "loading-content"
                : "modal-content"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-body">
              {modalLoading ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <div className="loader"></div>
                </div>
              ) : detailedProduct ? (
                <>
                  <img
                    id="modal-image"
                    src={getCategoryImage(
                      detailedProduct.category,
                      detailedProduct.categoryIndex || 0
                    )}
                    alt={detailedProduct.name}
                  />
                  <div className="modal-content-text">
                    <h1 id="modal-title" className="about-h1">
                      {detailedProduct.name}
                    </h1>
                    <p id="modal-description" className="descp">
                      {detailedProduct.description}
                    </p>
                    {detailedProduct.sizes &&
                      Object.keys(detailedProduct.sizes).length > 0 && (
                        <div id="size">
                          <p className="descp">Size</p>
                          <div id="sizes">
                            {Object.entries(detailedProduct.sizes).map(
                              ([key, size]) => (
                                <button
                                  key={key}
                                  className={`modal-size-btn ${
                                    selectedSize === key ? "selected" : ""
                                  }`}
                                  onClick={() => setSelectedSize(key)}
                                >
                                  <div className="modal-size-bg">
                                    {key.toUpperCase()}
                                  </div>
                                  <span className="size-text">{size.size}</span>
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    {detailedProduct.additives &&
                      detailedProduct.additives.length > 0 && (
                        <div id="additive">
                          <p className="descp">Additives</p>
                          <div id="additives">
                            {detailedProduct.additives.map((add, i) => (
                              <button
                                key={i}
                                className={`modal-size-btn additive-btn ${
                                  selectedAdditives.includes(add.name)
                                    ? "selected"
                                    : ""
                                }`}
                                onClick={() => toggleAdditive(add.name)}
                                disabled={
                                  selectedAdditives.length >= 3 &&
                                  !selectedAdditives.includes(add.name)
                                }
                              >
                                <div className="modal-size-bg">{i + 1}</div>
                                <span className="size-text">{add.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    <div className="modal-div">
                      <h3 className="about-h1 modal-price-h1">Total:</h3>
                      <div className="price-container">
                        <h3
                          id="modal-price"
                          className={showDiscount ? "horisontal-line" : ""}
                        >
                          ${price.toFixed(2)}
                        </h3>
                        {showDiscount && (
                          <h3 id="modal-discount" className="discounted-price">
                            ${discountPrice.toFixed(2)}
                          </h3>
                        )}
                      </div>
                    </div>

                    <div className="modal-div top-border">
                      <img src={empty} className="info" alt="Info" />
                      <p>
                        {loggedIn
                          ? "You're getting the best price! Download our app for even more rewards."
                          : "Log in to unlock exclusive discounts up to 20% and earn loyalty points!"}
                      </p>
                    </div>
                    <button
                      className="modal-btn"
                      onClick={loggedIn ? closeModal : closeModal}
                    >
                      {loggedIn ? "Add to cart" : "Close"}
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Menu;
