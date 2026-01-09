import { useRouter } from "next/navigation";
import "./Hero.css";

function Hero() {
  const router = useRouter();
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Your Stories,
            <span className="hero-highlight"> Beautifully Told</span>
          </h1>
          <p className="hero-description">
            Blogger is the modern platform where your thoughts come to life.
            Share your journey, inspire others, and build a community around
            what matters to you.
          </p>
          <div className="hero-buttons">
            <button
              onClick={() => router.push("/login")}
              className="btn-primary"
            >
              Start Writing
            </button>
            <button
              onClick={() => router.push("/home")}
              className="btn-secondary"
            >
              Explore Stories
            </button>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">50K+</span>
            <span className="stat-label">Active Writers</span>
          </div>
          <div className="stat">
            <span className="stat-number">1M+</span>
            <span className="stat-label">Stories Published</span>
          </div>
          <div className="stat">
            <span className="stat-number">10M+</span>
            <span className="stat-label">Monthly Readers</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
