import Link from "next/link";
import "./CTA.css";

function CTA() {
  return (
    <section className="cta">
      <div className="cta-container">
        <h2 className="cta-title">Ready to Share Your Story?</h2>
        <p className="cta-description">
          Join thousands of writers who trust Blogger to bring their ideas to
          life. Start your journey today - no credit card required.
        </p>
        <Link href={"/login"} className="cta-button">
          Start Writing for Free
        </Link>
        <p className="cta-note">Free forever. No payment required.</p>
      </div>
    </section>
  );
}

export default CTA;
