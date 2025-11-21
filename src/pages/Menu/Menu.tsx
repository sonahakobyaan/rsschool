// import { useEffect, useState } from "react";
// import { fetchProducts, fetchProductById } from "@/api/api";
// import type { Product } from "@/types/product";
// import { coffee } from "@/assets/coffee/coffee.ts";
// import { tea } from "@/assets/tea/tea.ts";
// import { dessert } from "@/assets/dessert/dessert.ts";
// import coffeImg from "../../assets/icons/coffee.png";
// import teaImg from "../../assets/icons/tea.png";
// import dessertImg from "../../assets/icons/dessert.png";
// import empty from "@/assets/icons/info-empty.svg";

// const categories = ["coffee", "tea", "dessert"] as const;
// type Category = (typeof categories)[number];

// const categoryIcons: Record<Category, string> = {
//   coffee: coffeImg,
//   tea: teaImg,
//   dessert: dessertImg,
// };

// const categoryLabels: Record<Category, string> = {
//   coffee: "Coffee",
//   tea: "Tea",
//   dessert: "Desserts",
// };

// const MOBILE_BREAKPOINT = 768;
// const INITIAL_MOBILE_COUNT = 4;
// const LOAD_MORE_STEP = 4;

// const Menu = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedCategory, setSelectedCategory] = useState<Category>("coffee");
//   const [rotating, setRotating] = useState(false);
//   const [windowWidth, setWindowWidth] = useState<number>(
//     typeof window !== "undefined" ? window.innerWidth : 1000
//   );
//   const [visibleCount, setVisibleCount] = useState<number>(INITIAL_MOBILE_COUNT);

//   // Login state
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [currentUser, setCurrentUser] = useState<any>(null);

//   // Modal state
//   const [modalOpen, setModalOpen] = useState(false);
//   const [detailedProduct, setDetailedProduct] = useState<
//     (Product & { categoryIndex?: number }) | null
//   >(null);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [selectedSize, setSelectedSize] = useState<string>("s");
//   const [selectedAdditives, setSelectedAdditives] = useState<string[]>([]);

//   // Check login status from localStorage
//   useEffect(() => {
//     const checkLoginStatus = () => {
//       const token = localStorage.getItem("access_token");
//       const user = localStorage.getItem("user");

//       if (token && user) {
//         try {
//           const parsedUser = JSON.parse(user);
//           setIsLoggedIn(true);
//           setCurrentUser(parsedUser);
//         } catch (e) {
//           setIsLoggedIn(false);
//           setCurrentUser(null);
//         }
//       } else {
//         setIsLoggedIn(false);
//         setCurrentUser(null);
//       }
//     };

//     checkLoginStatus();
//     window.addEventListener("storage", checkLoginStatus);
//     return () => window.removeEventListener("storage", checkLoginStatus);
//   }, []);

//   useEffect(() => {
//     const handleResize = () => setWindowWidth(window.innerWidth);
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     setVisibleCount(
//       windowWidth < MOBILE_BREAKPOINT ? INITIAL_MOBILE_COUNT : Infinity
//     );
//   }, [windowWidth, selectedCategory]);

//   useEffect(() => {
//     const loadProducts = async () => {
//       try {
//         const data = await fetchProducts();
//         setProducts(data);
//         setError(null);
//       } catch {
//         setError("Failed to load products. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadProducts();
//   }, []);

//   useEffect(() => {
//     if (products.length > 0) {
//       const filtered = products.filter((p) => p.category === selectedCategory);
//       setFilteredProducts(filtered);
//     }
//   }, [selectedCategory, products]);

//   const getCategoryImage = (category: string, index: number) => {
//     const imageIndex = index + 1;
//     switch (category) {
//       case "coffee":
//         return coffee[imageIndex];
//       case "tea":
//         return tea[imageIndex];
//       case "dessert":
//         return dessert[imageIndex];
//       default:
//         return "";
//     }
//   };

//   const openModal = async (product: Product, categoryIndex: number) => {
//     setModalOpen(true);
//     setModalLoading(true);
//     document.body.classList.add("no-scroll");

//     try {
//       const fullProduct = await fetchProductById(product.id);
//       const productWithIndex = { ...fullProduct, categoryIndex };
//       setDetailedProduct(productWithIndex);

//       const availableSizeKey = fullProduct.sizes
//         ? Object.keys(fullProduct.sizes)[0]
//         : "s";
//       setSelectedSize(availableSizeKey);
//       setSelectedAdditives([]);
//     } catch (err) {
//       console.error("Failed to load product details", err);
//       alert("Failed to load product details");
//       closeModal();
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setDetailedProduct(null);
//     setSelectedSize("s");
//     setSelectedAdditives([]);
//     document.body.classList.remove("no-scroll");
//   };

//   const toggleAdditive = (name: string) => {
//     setSelectedAdditives((prev) =>
//       prev.includes(name)
//         ? prev.filter((a) => a !== name)
//         : prev.length < 3
//         ? [...prev, name]
//         : prev
//     );
//   };

//   // Updated calculatePrice — only apply discount if logged in
//   const calculatePrice = () => {
//     if (!detailedProduct) return { base: 0, discount: 0, showDiscount: false };

//     const sizeData = detailedProduct.sizes?.[selectedSize];
//     const sizeBasePrice = sizeData?.price
//       ? parseFloat(sizeData.price)
//       : parseFloat(detailedProduct.price);

//     const shouldApplyDiscount = isLoggedIn;

//     const sizeDiscountPrice = shouldApplyDiscount && sizeData?.discountPrice
//       ? parseFloat(sizeData.discountPrice)
//       : null;

//     const additivesBaseTotal = selectedAdditives.reduce((sum, name) => {
//       const additive = detailedProduct.additives?.find((a) => a.name === name);
//       return sum + (additive?.price ? parseFloat(additive.price) : 0);
//     }, 0);

//     const additivesDiscountTotal = selectedAdditives.reduce((sum, name) => {
//       const additive = detailedProduct.additives?.find((a) => a.name === name);
//       if (!shouldApplyDiscount) {
//         return sum + (additive?.price ? parseFloat(additive.price) : 0);
//       }
//       return sum + (additive?.discountPrice ? parseFloat(additive.discountPrice) : additive?.price ? parseFloat(additive.price) : 0);
//     }, 0);

//     const totalBase = sizeBasePrice + additivesBaseTotal;
//     const totalDiscount = sizeDiscountPrice !== null
//       ? sizeDiscountPrice + additivesDiscountTotal
//       : totalBase;

//     return {
//       base: totalBase,
//       discount: totalDiscount,
//       showDiscount: shouldApplyDiscount && totalDiscount < totalBase,
//     };
//   };

//   const priceResult = detailedProduct ? calculatePrice() : { base: 0, discount: 0, showDiscount: false };
//   const { base: price, discount: discountPrice, showDiscount } = priceResult;

//   const isMobile = windowWidth < MOBILE_BREAKPOINT;
//   const displayedProducts = isMobile
//     ? filteredProducts.slice(0, visibleCount)
//     : filteredProducts;
//   const hasMore = filteredProducts.length > visibleCount;

//   const handleLoadMore = () => {
//     setRotating(true);
//     setTimeout(() => {
//       setRotating(false);
//       setVisibleCount((prev) =>
//         Math.min(prev + LOAD_MORE_STEP, filteredProducts.length)
//       );
//     }, 1000);
//   };

//   // Helper to get display price in product grid
//   const getDisplayPrice = (product: Product) => {
//     if (isLoggedIn && product.discountPrice && parseFloat(product.discountPrice) < parseFloat(product.price)) {
//       return { price: product.discountPrice, original: product.price };
//     }
//     return { price: product.price, original: null };
//   };

//   if (loading)
//     return (
//       <div className="sections">
//         <section className="data">
//           <div className="loader"></div>
//         </section>
//       </div>
//     );

//   if (error)
//     return (
//       <div className="sections">
//         <section className="data">
//           <p className="error">{error}</p>
//         </section>
//       </div>
//     );

//   return (
//     <>
//       <div className="sections">
//         <section className="top">
//           <h2 className="about-h1">
//             Behind each of our cups hides an{" "}
//             <span className="accent">amazing surprise</span>
//           </h2>
//           <div id="categories-container" className="categories-container">
//             {categories.map((cat) => (
//               <button
//                 key={cat}
//                 className={`category-div ${selectedCategory === cat ? "selected" : ""}`}
//                 onClick={() => setSelectedCategory(cat)}
//               >
//                 <div className="img-div">
//                   <img src={categoryIcons[cat]} alt={categoryLabels[cat]} />
//                 </div>
//                 {categoryLabels[cat]}
//               </button>
//             ))}
//           </div>
//         </section>

//         <section className="data">
//           <div className={!filteredProducts.length ? "error-container" : "data-container"}>
//             {!filteredProducts.length ? (
//               <p className="about-h1">
//                 Something went wrong. Please refresh the page
//               </p>
//             ) : (
//               <>
//                 {displayedProducts.map((product, idx) => {
//                   const categoryIndex =
//                     filteredProducts
//                       .slice(0, idx + 1)
//                       .filter((p) => p.category === product.category).length - 1;

//                   const { price: displayPrice, original } = getDisplayPrice(product);

//                   return (
//                     <div
//                       key={product.id}
//                       className="product"
//                       onClick={() => openModal(product, categoryIndex)}
//                       style={{ cursor: "pointer" }}
//                     >
//                       <div className="item_wrapper product_img">
//                         <div
//                           className="item"
//                           style={{
//                             backgroundImage: `url(${getCategoryImage(
//                               product.category,
//                               categoryIndex
//                             )})`,
//                             backgroundSize: "cover",
//                             backgroundPosition: "center",
//                             width: "100%",
//                             height: "310px",
//                           }}
//                         />
//                       </div>
//                       <div className="item_info">
//                         <div className="item_text">
//                           <h1 className="name">{product.name}</h1>
//                           <p className="description">{product.description}</p>
//                         </div>
//                         <div className="item_price">
//                           {original ? (
//                             <>
//                               <span className="original-price">
//                                 ${parseFloat(original).toFixed(2)}
//                               </span>{" "}
//                               <strong>${parseFloat(displayPrice).toFixed(2)}</strong>
//                             </>
//                           ) : (
//                             <strong>${parseFloat(displayPrice).toFixed(2)}</strong>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}

//                 {isMobile && (hasMore || rotating) && (
//                   <button onClick={handleLoadMore} className="load-more">
//                     <svg
//                       width="60"
//                       height="60"
//                       viewBox="0 0 60 60"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                       className={`rotate-icon ${rotating ? "rotating" : ""}`}
//                     >
//                       <rect x="0.5" y="0.5" width="59" height="59" rx="29.5" stroke="#665F55" />
//                       <path
//                         className="path"
//                         d="M39.8883 31.5C39.1645 36.3113 35.013 40 30 40C24.4772 40 20 35.5228 20 30C20 24.4772 24.4772 20 30 20C34.1006 20 37.6248 22.4682 39.1679 26"
//                         stroke="#403F3D"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                       <path
//                         className="path"
//                         d="M35 26H39.4C39.7314 26 40 25.7314 40 25.4V21"
//                         stroke="#403F3D"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                     </svg>
//                   </button>
//                 )}
//               </>
//             )}
//           </div>
//         </section>
//       </div>

//       {/* MODAL */}
//       {modalOpen && (
//         <div id="product-modal" className="modal" style={{ display: "block" }} onClick={closeModal}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-body">
//               {modalLoading ? (
//                 <div
//                   style={{
//                     position: "absolute",
//                     inset: 0,
//                     background: "rgba(255,255,255,0.9)",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     zIndex: 10,
//                   }}
//                 >
//                   <div className="loader-spinner">Loading product...</div>
//                 </div>
//               ) : detailedProduct ? (
//                 <>
//                   <img
//                     id="modal-image"
//                     src={getCategoryImage(detailedProduct.category, detailedProduct.categoryIndex || 0)}
//                     alt={detailedProduct.name}
//                   />
//                   <div className="modal-content-text">
//                     <h1 id="modal-title" className="about-h1">
//                       {detailedProduct.name}
//                     </h1>
//                     <p id="modal-description" className="descp">
//                       {detailedProduct.description}
//                     </p>

//                     {/* SIZES */}
//                     {detailedProduct.sizes && Object.keys(detailedProduct.sizes).length > 0 && (
//                       <div id="size">
//                         <p className="descp">Size</p>
//                         <div id="sizes">
//                           {Object.entries(detailedProduct.sizes).map(([key, size]) => (
//                             <button
//                               key={key}
//                               className={`modal-size-btn ${selectedSize === key ? "selected" : ""}`}
//                               onClick={() => setSelectedSize(key)}
//                             >
//                               <div className="modal-size-bg">{key.toUpperCase()}</div>
//                               <span className="size-text">{size.size}</span>
//                             </button>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* ADDITIVES */}
//                     {detailedProduct.additives && detailedProduct.additives.length > 0 && (
//                       <div id="additive">
//                         <p className="descp">Additives</p>
//                         <div id="additives">
//                           {detailedProduct.additives.map((add, i) => (
//                             <button
//                               key={i}
//                               className={`modal-size-btn additive-btn ${
//                                 selectedAdditives.includes(add.name) ? "selected" : ""
//                               }`}
//                               onClick={() => toggleAdditive(add.name)}
//                               disabled={
//                                 selectedAdditives.length >= 3 && !selectedAdditives.includes(add.name)
//                               }
//                             >
//                               <div className="modal-size-bg">{i + 1}</div>
//                               <span className="size-text">{add.name}</span>
//                             </button>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* PRICE — Only show discount if logged in */}
//                     <div className="modal-div">
//                       <h3 className="about-h1 modal-price-h1">Total:</h3>
//                       <div className="price-container">
//                         <h3
//                           id="modal-price"
//                           className={showDiscount ? "horisontal-line" : ""}
//                         >
//                           ${price.toFixed(2)}
//                         </h3>
//                         {showDiscount && (
//                           <h3 id="modal-discount" className="discounted-price">
//                             ${discountPrice.toFixed(2)}
//                           </h3>
//                         )}
//                       </div>
//                     </div>

//                     <div className="modal-div top-border">
//                       <img src={empty} className="info" alt="Info" />
//                       <p>
//                         {isLoggedIn
//                           ? "You're getting the best price! Download our app for even more rewards."
//                           : "Log in to unlock exclusive discounts up to 20% and earn loyalty points!"}
//                       </p>
//                     </div>

//                     <button className="modal-btn" onClick={closeModal}>
//                       Close
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <p className="error">Product not found</p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Menu;