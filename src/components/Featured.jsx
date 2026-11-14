import { Link } from "react-router-dom";
import { bySlug, formatPrice } from "../data/products";
import ProductArt from "./ProductArt";
import Magnetic from "./Magnetic";

export default function Featured() {
  const piece = bySlug("selene-band");

  return (
    <section className="detail" id="detail">
      <div className="detail__media" data-reveal>
        <div className="stage">
          <ProductArt piece={piece} variant={1} />
          <span className="stage__badge">925 · moonstone</span>
        </div>
        <div className="thumbs" aria-hidden="true">
          {[0, 1, 2, 3].map((v) => (
            <span key={v} className="thumb">
              <ProductArt piece={piece} variant={v} />
            </span>
          ))}
        </div>
      </div>

      <div className="detail__body" data-reveal data-reveal-delay="0.08">
        <p className="eyebrow">The first piece</p>
        <h2>{piece.name}</h2>
        <p className="detail__tagline">{piece.tagline}</p>
        <p className="detail__copy">{piece.description}</p>

        <div className="row">
          <strong className="detail__price">{formatPrice(piece.price)}</strong>
          <span className="detail__note">Sizes 6–12 · free shipping over ₹1,999</span>
        </div>

        <div className="detail__actions">
          <Magnetic as={Link} to={`/piece/${piece.slug}`} className="add" data-cursor="Open">
            View the piece
          </Magnetic>
          <Link to="/#shop" className="btn btn--ghost" data-cursor="">
            Browse the almanac
          </Link>
        </div>

        <dl className="detail__specs">
          <div>
            <dt>Material</dt>
            <dd>{piece.details.material}</dd>
          </div>
          <div>
            <dt>Finish</dt>
            <dd>{piece.details.finish}</dd>
          </div>
          <div>
            <dt>Made</dt>
            <dd>By hand, in small batches</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
