import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import * as HeaderModule from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import LogIn from "./pages/Authentication/Login/LogIn";
import Registration from "./pages/Authentication/Registration/Registration";
import Hero from "@/pages/Hero/Hero";
import Menu from "./pages/Menu/Menu";
import Shop from "./pages/Shoop/Shoop";

const Header = HeaderModule.default || (() => null);

function App() {
  const [theme, setTheme] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "light"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/hero" element={<Hero />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/shoop" element={<Shop />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
