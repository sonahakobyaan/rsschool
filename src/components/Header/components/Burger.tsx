type BurgerProps = {
  isMobileMenuOpen: boolean;
  line1Ref: React.RefObject<SVGPathElement | null>;
  line2Ref: React.RefObject<SVGPathElement | null>;
  onClick: () => void;
};

const Burger = ({
  isMobileMenuOpen,
  line1Ref,
  line2Ref,
  onClick,
}: BurgerProps) => {
  return (
    <svg
      className="burger-menu"
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={() => onClick()}
      style={{ cursor: "pointer" }}
    >
      <rect x="0.5" y="0.5" width="43" height="43" rx="21.5" stroke="#665F55" />
      <path
        ref={line1Ref}
        className={`line1 ${isMobileMenuOpen ? "x" : ""}`}
        d="M14 18H30"
        stroke="#403F3D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        ref={line2Ref}
        className={`line2 ${isMobileMenuOpen ? "x" : ""}`}
        d="M14 26H30"
        stroke="#403F3D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Burger;
