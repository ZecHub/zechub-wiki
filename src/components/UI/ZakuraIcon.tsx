import type { IconType } from "react-icons";

// Cherry-blossom (sakura) outline for the Zakura node. Drawn as a single-colour stroke
// icon so it follows the text colour like the other menu icons.
const PETAL =
  "M12 12C8.6 10.2 8 5.6 10.3 4.1C11.1 3.6 11.8 4.3 12 5.4C12.2 4.3 12.9 3.6 13.7 4.1C16 5.6 15.4 10.2 12 12Z";

const ZakuraIcon: IconType = ({ size = 16, className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    {...(rest as React.SVGProps<SVGSVGElement>)}
  >
    {[0, 72, 144, 216, 288].map((deg) => (
      <path key={deg} d={PETAL} transform={`rotate(${deg} 12 12)`} />
    ))}
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export default ZakuraIcon;
