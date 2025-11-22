import type { Product } from "@/types/product";
import { calculatePrice } from "@/pages/Menu/utils/calculatePrice.ts";
import empty from "@/assets/icons/info-empty.svg";

interface ProductModalProps {
  open: boolean;
  loading: boolean;
  product: (Product & { categoryIndex?: number }) | null;
  selectedSize: string;
  selectedAdditives: string[];
  loggedIn: boolean;
  onClose: () => void;
  onSizeChange: (size: string) => void;
  onAdditiveToggle: (name: string) => void;
  getCategoryImage: (category: string, index: number) => string;
}

export default function ProductModal({
  open,
  loading,
  product,
  selectedSize,
  selectedAdditives,
  loggedIn,
  onClose,
  onSizeChange,
  onAdditiveToggle,
  getCategoryImage,
}: ProductModalProps) {
  if (!open || !product) return null;

  const priceResult = calculatePrice({
    detailedProduct: product,
    selectedSize,
    loggedIn,
    selectedAdditives,
  });
  const { base: price, discount: discountPrice, showDiscount } = priceResult;

  return (
    <div
      id="product-modal"
      className="modal"
      style={{ display: "block" }}
      onClick={onClose}
    >
      <div
        className={loading ? "loading-content" : "modal-content"}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-body">
          {loading ? (
            <div className="loader" style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.9)",
              zIndex: 10,
            }}>
              <div className="loader"></div>
            </div>
          ) : (
            <>
              <img
                id="modal-image"
                src={getCategoryImage(product.category, product.categoryIndex || 0)}
                alt={product.name}
              />
              <div className="modal-content-text">
                <h1 id="modal-title" className="about-h1">{product.name}</h1>
                <p id="modal-description" className="descp">{product.description}</p>

                {product.sizes && Object.keys(product.sizes).length > 0 && (
                  <div id="size">
                    <p className="descp">Size</p>
                    <div id="sizes">
                      {Object.entries(product.sizes).map(([key, size]) => (
                        <button
                          key={key}
                          className={`modal-size-btn ${selectedSize === key ? "selected" : ""}`}
                          onClick={() => onSizeChange(key)}
                        >
                          <div className="modal-size-bg">{key.toUpperCase()}</div>
                          <span className="size-text">{size.size}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.additives && product.additives.length > 0 && (
                  <div id="additive">
                    <p className="descp">Additives</p>
                    <div id="additives">
                      {product.additives.map((add, i) => (
                        <button
                          key={i}
                          className={`modal-size-btn additive-btn ${
                            selectedAdditives.includes(add.name) ? "selected" : ""
                          }`}
                          onClick={() => onAdditiveToggle(add.name)}
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

                <button className="modal-btn" onClick={onClose}>
                  {loggedIn ? "Add to cart" : "Close"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}