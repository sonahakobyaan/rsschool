// components/Header.tsx
import { useEffect, useRef, useState } from "react";
import logo from "@/assets/icons/logo.svg";
import shoppingBag from "@/assets/icons/shopping-bag.svg";
import coffeeCupIcon from "@/assets/icons/coffee-cup.svg";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<SVGPathElement>(null);
  const line2Ref = useRef<SVGPathElement>(null);

  // Close mobile menu when clicking on any nav link (including anchor links)
  const handleNavClick = () => {
    if (window.innerWidth <= 768) {
      setIsMobileMenuOpen(false);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        navRef.current &&
        !navRef.current.contains(e.target as Node) &&
        !document.querySelector(".burger-menu")?.contains(e.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [isMobileMenuOpen]);

  return (
    <header className="relative z-50">
      <a href="/">
        <img src={logo} className="logo" alt="Coffee House Logo" />
      </a>

      <nav
        ref={navRef}
        className={`nav-links ${isMobileMenuOpen ? "mobile-active" : ""}`}
      >
        <div className="center-links">
          <a href="#favorite-coffee" onClick={handleNavClick}>
            Favorite coffee
          </a>
          <a href="#about" onClick={handleNavClick}>
            About
          </a>
          <a href="#mobile-app" onClick={handleNavClick}>
            Mobile app
          </a>
          <a href="#footer" onClick={handleNavClick}>
            Contact us
          </a>
        </div>

        <div className="menu-right-hand">
          <a href="/shop" id="shop">
            <img src={shoppingBag} alt="Shopping bag" />
          </a>
          <a href="/menu">
            <div className="menu-container">
              <p>Menu</p>
              <img src={coffeeCupIcon} className="menu" alt="Coffee Cup Icon" />
            </div>
          </a>
        </div>
      </nav>

      {/* Burger Menu */}
      <svg
        className="burger-menu"
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        style={{ cursor: "pointer" }}
      >
        <rect x="0.5" y="0.5" width="43" height="43" rx="21.5" stroke="#665F55" />
        <path
          ref={line1Ref}
          className={`line1 ${isMobileMenuOpen ? "x" : ""}`}
          d="M14 18H30"
          stroke="#403F3D"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          ref={line2Ref}
          className={`line2 ${isMobileMenuOpen ? "x" : ""}`}
          d="M14 26H30"
          stroke="#403F3D"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </header>
  );
};

export default Header;