import { useEffect, useState, useRef } from "react";
import heroVideo from "@/assets/videos/hero-video.mp4";
import coffeeCup from "@/assets/icons/coffee-cup.svg";
import mobileScreens from "@/assets/icons/mobile-screens.svg";
import type { Product } from "@/types/product";
import { fetchFavorites } from "@/api/api";
import { coffeeSliderImages } from "@/assets/icons/coffe-slider/coffeeSlider";

const Hero = () => {
  const [coffees, setCoffees] = useState<Product[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPaused, setIsPaused] = useState(false);

  const slideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const slideStartTimeRef = useRef<number>(0); // Timestamp when slide started
  const remainingTimeRef = useRef<number>(3000); // Remaining time in ms

  useEffect(() => {
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

  const startSlideTimer = (duration = 3000) => {
    slideStartTimeRef.current = Date.now();
    slideTimeoutRef.current = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % coffees.length);
      remainingTimeRef.current = 3000; // reset for next slide
    }, duration);
  };

  useEffect(() => {
    if (coffees.length === 0) return;
    if (!isPaused) {
      startSlideTimer(remainingTimeRef.current);
    }

    return () => {
      if (slideTimeoutRef.current) clearTimeout(slideTimeoutRef.current);
    };
  }, [coffees, currentSlide, isPaused]);

  const pauseTimer = () => {
    if (slideTimeoutRef.current) {
      clearTimeout(slideTimeoutRef.current);
      const elapsed = Date.now() - slideStartTimeRef.current;
      remainingTimeRef.current = Math.max(
        0,
        remainingTimeRef.current - elapsed
      );
    }
  };

  const resumeTimer = () => {
    if (!isPaused) return;
    startSlideTimer(remainingTimeRef.current);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
    pauseTimer();
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    resumeTimer();
  };

  const nextSlide = () => {
    if (slideTimeoutRef.current) clearTimeout(slideTimeoutRef.current);
    remainingTimeRef.current = 3000; // reset timer
    setCurrentSlide((prev) => (prev + 1) % coffees.length);
  };

  const prevSlide = () => {
    if (slideTimeoutRef.current) clearTimeout(slideTimeoutRef.current);
    remainingTimeRef.current = 3000; // reset timer
    setCurrentSlide((prev) => (prev - 1 + coffees.length) % coffees.length);
  };

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
        {error && (
          <div className="about-h1" id="failed_load">
            {error}
          </div>
        )}

        <div className="coffe-slideshow-container">
          <button
            className="prev"
            onClick={prevSlide}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.5"
                y="0.5"
                width="59"
                height="59"
                rx="29.5"
                stroke="#665F55"
              />
              <path
                d="M36.5 30H24M24 30L30 24M24 30L30 36"
                className="arrow"
                stroke="#403F3D"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {coffees.map((coffee, index) => (
            <div
              key={coffee.id}
              className={`slideItems ${index === currentSlide ? "fade" : ""}`}
              style={{ display: index === currentSlide ? "flex" : "none" }}
            >
              <img src={coffeeSliderImages[index]} alt={coffee.name} />
              <p>{coffee.name}</p>
            </div>
          ))}

          <button
            className="next"
            onClick={nextSlide}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.5"
                y="0.5"
                width="59"
                height="59"
                rx="29.5"
                stroke="#665F55"
              />
              <path
                d="M24 30H36.5M36.5 30L30.5 24M36.5 30L30.5 36"
                className="arrow"
                stroke="#403F3D"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {loading && (
          <div className="loading-bars">
            <div className="bar bar1"></div>
            <div className="bar bar2"></div>
            <div className="bar bar3"></div>
          </div>
        )}

        <div className={`dots-container ${isPaused ? "paused" : ""}`}>
          {coffees.map((_, index) => (
            <span
              key={index}
              className={`line ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
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
