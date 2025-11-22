import { useEffect, useState, useRef } from "react";
import type { Product } from "@/types/product";
import { api } from "@/api/api.ts";
import coffeeCup from "@/assets/icons/coffee-cup.svg";
import heroVideo from "@/assets/videos/hero-video.mp4";
import mobileScreens from "@/assets/icons/mobile-screens.svg";
import { coffeeSliderImages } from "@/assets/icons/coffe-slider/coffeeSlider";

import Prev from "@/pages/Hero/components/Prev.tsx";
import Next from "@/pages/Hero/components/Next.tsx";
import Google from "@/pages/Hero/components/Google.tsx";
import Apple from "@/pages/Hero/components/Apple.tsx";
const Hero = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [coffees, setCoffees] = useState<Product[]>([]);

  const slideStartTimeRef = useRef<number>(0);
  const remainingTimeRef = useRef<number>(3000);
  const slideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const getFavorites = async () => {
      setLoading(true);
      try {
        const favorites = await api.fetchFavorites();
        setCoffees(favorites);
        setError("");
      } catch {
        setError("Failed to load favorite coffees");
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
      remainingTimeRef.current = 3000;
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
    remainingTimeRef.current = 3000;
    setCurrentSlide((prev) => (prev + 1) % coffees.length);
  };

  const prevSlide = () => {
    if (slideTimeoutRef.current) clearTimeout(slideTimeoutRef.current);
    remainingTimeRef.current = 3000;
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
            <Prev />
          </button>
          {coffees.map((coffee, index) => (
            <div
              key={coffee.id}
              className={`slideItems ${index === currentSlide ? "fade" : ""}`}
              style={{ display: index === currentSlide ? "flex" : "none" }}
            >
              <img src={coffeeSliderImages[index]} alt={coffee.name} />
              <div className="text">
                <h3>{coffee.name}</h3>
                <p>{coffee.description}</p>
                <h4>${coffee.price.toFixed(2)}</h4>
              </div>
            </div>
          ))}

          <button
            className="next"
            onClick={nextSlide}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Next />
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
          <div>
            <a className="store" href="https://www.apple.com/app-store/">
              <Apple />
            </a>
            <a
              className="store"
              href="https://play.google.com/store/games?hl=en"
            >
              <Google />
            </a>
          </div>
        </div>
        <div>
          <img src={mobileScreens} alt="Mobile Screens" />
        </div>
      </section>
    </div>
  );
};

export default Hero;
