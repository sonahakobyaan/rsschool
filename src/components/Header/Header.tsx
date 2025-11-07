
import logo from "@/assets/icons/logo.svg";
import shoopingBag from "@/assets/icons/shopping-bag.svg";
import coffeeCupIcon from "@/assets/icons/coffee-cup.svg";

const Header = () => {
  return (
    <header>
      <a href="/">
        <img src={logo} className="logo" alt="Coffee House Logo" />
      </a>
      <nav className="nav-links">
        <div className="center-links">
          <a href="#favorite-coffee">Favorite coffee</a>
          <a href="#about">About</a>
          <a href="#mobile-app">Mobile app</a>
          <a href="#footer">Contact us</a>
        </div>
        <div className="menu-right-hand">
          <a href="shoop.html">
            <img src={shoopingBag} alt="shooping-bag" />
          </a>
          <a href="menu.html">
            <div className="menu-container">
              <p>Menu</p>
              <img src={coffeeCupIcon} className="menu" alt="Coffee Cup Icon" />
            </div>
          </a>
        </div>
      </nav>
      <svg
        className="burger-menu"
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="0.5"
          y="0.5"
          width="43"
          height="43"
          rx="21.5"
          stroke="#665F55"
        />
        <path
          className="line1"
          d="M14 18H30"
          stroke="#403F3D"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          className="line2"
          d="M14 26H30"
          stroke="#403F3D"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </header>
  );
};

export default Header;
