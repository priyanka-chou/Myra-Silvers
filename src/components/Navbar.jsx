export default function Navbar({ cartCount }) {
  return (
    <nav>
      <a className="logo" href="#top">Myra Silvers</a>
      <div className="links">
        <a href="#shop">Collection</a>
        <a href="#story">Story</a>
        <a className="cartbtn" href="#detail">Cart ({cartCount})</a>
      </div>
    </nav>
  );
}