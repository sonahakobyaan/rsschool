import { useEffect, useRef, useState } from "react";
import { isLoggedIn, getUser, logout } from "@/utils/auth";
import { handleMobile } from "@/utils/mobile";
import coffeeCupIcon from "@/assets/icons/coffee-cup.svg";
import shoppingBag from "@/assets/icons/shopping-bag.svg";
import logo from "@/assets/icons/logo.svg";
import Dropdown from "@/components/Header/components/Dropdown.tsx";
import Burger from "@/components/Header/components/Burger.tsx";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [loggedIn, setLoggedIn] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<SVGPathElement>(null);
  const line2Ref = useRef<SVGPathElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { href: "/hero#favorite-coffee", label: "Favorite coffee" },
    { href: "/hero#about", label: "About" },
    { href: "/hero#mobile-app", label: "Mobile app" },
    { href: "/hero#footer", label: "Contact us" },
  ];

  const handleLogout = () => {
    logout();
    setUsername("");
    setLoggedIn(false);
    setIsDropdownOpen(false);
  };

  const handleNavClick = () => {
    if (handleMobile()) {
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn()) {
      setLoggedIn(true);
      console.log("ok")
      setUsername(getUser()?.login || "");
    }
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [isMobileMenuOpen]);

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
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={handleNavClick}>
              {link.label}
            </a>
          ))}
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
                  <Dropdown isDropdownOpen={isDropdownOpen} />
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
      <Burger
        isMobileMenuOpen={isMobileMenuOpen}
        line1Ref={line1Ref}
        line2Ref={line2Ref}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
    </header>
  );
};

export default Header;
