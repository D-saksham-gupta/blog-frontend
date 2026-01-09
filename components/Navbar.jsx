import { useRouter } from "next/navigation";
import "./Navbar.css";

function Navbar() {
  const router = useRouter();
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">Blogger</div>
        <nav className="nav">
          <a href="#story" className="nav-link">
            Our Story
          </a>
          <button
            onClick={() => router.push("/signup")}
            className="get-started-btn"
          >
            Get Started
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
