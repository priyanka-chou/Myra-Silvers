import { useRef } from "react";

/** A button that leans very slightly toward the pointer. Never more than that. */
export default function Magnetic({ as: Tag = "button", strength = 10, className = "", children, ...rest }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width / 2) / r.width;
    const dy = (e.clientY - r.top - r.height / 2) / r.height;
    el.style.setProperty("--mx-lift", `${(dx * strength).toFixed(2)}px`);
    el.style.setProperty("--my-lift", `${(dy * strength * 0.6).toFixed(2)}px`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--mx-lift", "0px");
    el.style.setProperty("--my-lift", "0px");
  };

  return (
    <Tag ref={ref} className={`magnetic ${className}`} onPointerMove={onMove} onPointerLeave={onLeave} {...rest}>
      {children}
    </Tag>
  );
}
