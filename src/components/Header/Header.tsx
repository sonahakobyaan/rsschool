// components/Header.tsx
import { useEffect, useRef, useState } from "react";
import logo from "@/assets/icons/logo.svg";
import shoppingBag from "@/assets/icons/shopping-bag.svg";
import coffeeCupIcon from "@/assets/icons/coffee-cup.svg";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string>("");

  const navRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<SVGPathElement>(null);
  const line2Ref = useRef<SVGPathElement>(null);

    const navigate = useNavigate();


  // Check login status
  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("access_token");
      const userStr = localStorage.getItem("user");

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          setIsLoggedIn(true);
          setUsername(user.login || "User");
        } catch {
          setIsLoggedIn(false);
          setUsername("");
        }
      } else {
        setIsLoggedIn(false);
        setUsername("");
      }
    };

    checkLogin();
    window.addEventListener("storage", checkLogin);

    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  // Close mobile menu on link click
  const handleNavClick = () => {
    if (window.innerWidth <= 768) {
      setIsMobileMenuOpen(false);
    }
  };

  // Close menus when clicking outside
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

  // Prevent scroll when mobile menu open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
 

 }, [isMobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUsername("");
    setIsDropdownOpen(false);
    navigate("/hero", { replace: true });
  };

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

          {/* Auth Section */}
          <div className="auth-section" ref={dropdownRef}>
            {isLoggedIn ? (
              <div className="user-dropdown">
                <button
                  className="username-btn"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="username-text">{username}</span>
                  <svg
                    className={`dropdown-arrow ${isDropdownOpen ? "rotated" : ""}`}
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