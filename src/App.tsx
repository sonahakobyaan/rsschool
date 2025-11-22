import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import * as HeaderModule from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import LogIn from "./pages/Authentication/Login/LogIn";
import Registration from "./pages/Authentication/Registration/Registration";
import Hero from "@/pages/Hero/Hero";
import Menu from "./pages/Menu/Menu";
import Shop from "./pages/Shoop/Shoop";

const Header = HeaderModule.default || HeaderModule.Header || (() => null);

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // On theme change, toggle dark class on body
  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
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
