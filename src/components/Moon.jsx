export default function Moon({ shift = "0%", size = 26, className = "" }) {
  return (
    <span
      className={`moon ${className}`}
      style={{ width: size, height: size, "--s": shift }}
      aria-hidden="true"
    />
  );
}
