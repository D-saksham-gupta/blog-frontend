import "./Features.css";

function Features() {
  const features = [
    {
      title: "Intuitive Editor",
      description:
        "Write with ease using our distraction-free editor designed for creators. Focus on what matters most - your story.",
    },
    {
      title: "Build Your Audience",
      description:
        "Connect with readers who share your passions. Grow your following and engage with a vibrant community.",
    },
    {
      title: "Beautiful Design",
      description:
        "Your content deserves to look stunning. Our elegant templates make every post a visual masterpiece.",
    },
    {
      title: "Analytics & Insights",
      description:
        "Understand your impact with detailed analytics. Track views, engagement, and reader demographics.",
    },
    {
      title: "Monetize Your Work",
      description:
        "Turn your passion into income. Multiple monetization options help you earn from your content.",
    },
    {
      title: "Cross-Platform",
      description:
        "Write anywhere, anytime. Seamless experience across all your devices, always in sync.",
    },
  ];

  return (
    <section className="features" id="story">
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-title">Why Choose Blogger?</h2>
          <p className="features-subtitle">
            Everything you need to share your voice with the world
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
