import "./index.scss";

const Shop = () => {
  return (
    <div className="sections">
      <div id="profile-section">
        <h2 className="about-h1">Cart</h2>
        <div id="cart-items"></div>
        <h3 id="total-price" className="about-h1">
          Total: $0.00
        </h3>
        <div className="button-contaner-card">
          <button className="login-button" id="signInButton">
            <a href="login.html">Sign In</a>
          </button>
          <button className="login-button" id="signInButton">
            <a href="registration.html">Registration</a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Shop;
