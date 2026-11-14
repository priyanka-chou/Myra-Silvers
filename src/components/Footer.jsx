import { useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setJoined(true);
  };

  return (
    <footer className="foot">
      <div className="foot__inner">
        <div className="foot__lead">
          <p className="eyebrow">Dawn</p>
          <h2>Morning, after the night.</h2>
          <p className="foot__copy">
            One letter each new moon: what we made, what we're keeping, and the occasional piece
            before it reaches the collection.
          </p>

          {joined ? (
            <p className="foot__joined" role="status">
              You're on the list. Look for us at the next new moon. ✦
            </p>
          ) : (
            <form className="sub" onSubmit={onSubmit}>
              <label className="sr-only" htmlFor="newsletter">
                Email address
              </label>
              <input
                id="newsletter"
                type="email"
                required
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="add" type="submit">
                Join the list
              </button>
            </form>
          )}
        </div>

        <div className="foot__cols">
          <div>
            <h3>Shop</h3>
            <Link to="/#shop">Rings</Link>
            <Link to="/#shop">Earrings</Link>
            <Link to="/#shop">Necklaces</Link>
            <Link to="/#shop">Bracelets</Link>
            <Link to="/#shop">Anklets</Link>
          </div>
          <div>
            <h3>House</h3>
            <Link to="/#story">Our story</Link>
            <Link to="/#detail">The first piece</Link>
            <span>Care guide</span>
            <span>Shipping &amp; returns</span>
          </div>
          <div>
            <h3>Elsewhere</h3>
            <a href="https://instagram.com/myra.silvers" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="mailto:hello@myrasilvers.in">Email</a>
            <span>Pune, India</span>
          </div>
        </div>
      </div>

      <div className="foot__base">
        <span>© {new Date().getFullYear()} Myra Silvers</span>
        <span>925 sterling silver · hand-finished</span>
        <a href="#top">Back to the moon ↑</a>
      </div>
    </footer>
  );
}
