import { useEffect, useRef, useState } from "react";
import { isLoggedIn, getUser, logout } from "@/utils/auth";
import coffeeCupIcon from "@/assets/icons/coffee-cup.svg";
import shoppingBag from "@/assets/icons/shopping-bag.svg";
import logo from "@/assets/icons/logo.svg";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [loggedIn, setLoggedIn] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<SVGPathElement>(null);
  const line2Ref = useRef<SVGPathElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoggedIn()) {
      setLoggedIn(true);
      setUsername(getUser()?.login || "");
    }
  }, []);

  const handleLogout = () => {
    logout();
    setUsername("");
    setLoggedIn(false);
    setIsDropdownOpen(false);
  };

  const handleNavClick = () => {
    if (window.innerWidth <= 768) {
      setIsMobileMenuOpen(false);
    }
  };

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
      if (
        isDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen, isDropdownOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [isMobileMenuOpen]);

  return (
    <header className="relative z-50">
      <a href="/hero">
        <img src={logo} className="logo" alt="Coffee House Logo" />
      </a>

      <nav
        ref={navRef}
        className={`nav-links ${isMobileMenuOpen ? "mobile-active" : ""}`}
      >
        <div className="center-links">
          <a href="/hero#favorite-coffee" onClick={handleNavClick}>
            Favorite coffee
          </a>
          <a href="/hero#about" onClick={handleNavClick}>
            About
          </a>
          <a href="/hero#mobile-app" onClick={handleNavClick}>
            Mobile app
          </a>
          <a href="/hero#footer" onClick={handleNavClick}>
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
              <img src={coffeeCupIcon} className="menu" alt="Menu" />
            </div>
          </a>

          <div className="auth-section" ref={dropdownRef}>
            {loggedIn ? (
              <div className="user-dropdown">
                <button
                  className="username-btn"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="username-text">{username}</span>
                  <svg
                    className={`dropdown-arrow ${
                      isDropdownOpen ? "rotated" : ""
                    }`}
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                  >
                    <path
                      d="M1 1L6 6L11 1"
                      stroke="#403F3D"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <button onClick={handleLogout} className="logout-btn">
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a href="/" className="sign-in-btn">
                Sign In
              </a>
            )}
          </div>
        </div>
      </nav>

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
        <rect
          x="0.5"
          y="0.5"
          width="43"
          height="43"
          rx="21.5"
          stroke="#665F55"
        />
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
