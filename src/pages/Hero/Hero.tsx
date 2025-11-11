import { useEffect, useRef, useState } from "react";
import heroVideo from "@/assets/videos/hero-video.mp4";
import coffeeCup from "@/assets/icons/coffee-cup.svg";
import mobileScreens from "@/assets/icons/mobile-screens.svg";
import type { Product } from "@/types/product";
import { fetchFavorites } from "@/api/api";

const Hero = () => {
  const [coffees, setCoffees] = useState<Product[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const hasFetchedRef = useRef(false);

useEffect(() => {
  if (hasFetchedRef.current) return;
  hasFetchedRef.current = true;

  const getFavorites = async () => {
    setLoading(true);
    try {
      const favorites = await fetchFavorites();
      setCoffees(favorites);
      setError("");
    } catch (err) {
      setError("Failed to load favorite coffees");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  getFavorites();
}, []);

  useEffect(() => {
    if (coffees.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % coffees.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [coffees]);

  return (
    <div className="sections">
      <section className="hero">
        <div className="hero-img">
          <video autoPlay muted loop playsInline className="hero-video">
            <source src={heroVideo} type="video/mp4" />
          </video>

          <div className="hero-content">
            <h2 className="section-h1">
              <span className="accent">Enjoy</span> premium coffee at our
              charming cafe
            </h2>
            <p>
              With its inviting atmosphere and delicious coffee options, the
              Coffee House Resource is a popular destination for coffee lovers
              and those seeking a warm and inviting space to enjoy their
              favorite beverage.
            </p>
            <button
              className="hero-button"
              onClick={() => (window.location.href = "/menu")}
            >
              Menu
              <img src={coffeeCup} className="icon" alt="Coffee Cup Icon" />
            </button>
          </div>
        </div>
      </section>

      <section id="favorite-coffee">
        <h2 className="about-h1">
          Choose your <span className="accent">favorite</span> coffee
        </h2>

        {loading && <div className="loader" id="coffee-loader"></div>}
        {error && <div className="about-h1" id="failed_load">{error}</div>}

        <div className="coffe-slideshow-container">
          {coffees.map((coffee, index) => (
            <div
              key={coffee.id}
              className="slide"
              style={{ display: index === currentSlide ? "block" : "none" }}
            >
              <img src={coffee.imageUrl} alt={coffee.name} />
              <p>{coffee.name}</p>
            </div>
          ))}
        </div>

        <div className="dots-container">
          {coffees.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>
      </section>

      <section id="about">
        <h2 className="about-h1">
          Resource is
          <span className="accent"> the perfect and cozy place </span>
          where you can enjoy a variety of hot beverages, relax, catch up with
          friends, or get some work done.
        </h2>
        <div className="about-img-container">
          <div className="img-col img-col1">
            <div className="item_wrapper">
              <div className="item item1"></div>
            </div>
            <div className="item_wrapper">
              <div className="item item2"></div>
            </div>
          </div>
          <div className="img-col img-col2">
            <div className="item_wrapper">
              <div className="item item3"></div>
            </div>
            <div className="item_wrapper">
              <div className="item item4"></div>
            </div>
          </div>
        </div>
      </section>

      <section id="mobile-app">
        <div className="container-col1">
          <h2 className="about-h1">
            <span className="accent">Download </span> our apps to start ordering
          </h2>
          <p>
            Download the Resource app today and experience the comfort of
            ordering your favorite coffee from wherever you are
          </p>
          <img src={mobileScreens} alt="Mobile Screens" />
        </div>
      </section>
    </div>
  );
};

export default Hero;
