import Header from "@/components/Header/Header";
import Footer from "./components/Footer/Footer";
import LogIn from "./pages/Authentication/Login/LogIn";
import Registration from "./pages/Authentication/Registration/Registration";

function App() {
  return (
    <>
      <Header />
      <LogIn />
      <Registration/>
      <Footer />
    </>
  );
}

export default App;
