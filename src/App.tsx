import { Routes, Route } from "react-router-dom";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import LogIn from "./pages/Authentication/Login/LogIn";
import Registration from "./pages/Authentication/Registration/Registration";
import Hero from "@/pages/Hero/Hero";
import Menu from "./pages/Menu/Menu";
import Shop from "./pages/Shop/Shop";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/hero" element={<Hero />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/shop" element={<Shop />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
