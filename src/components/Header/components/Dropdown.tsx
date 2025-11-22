type DropdownProps = {
    isDropdownOpen: boolean;
  };
const Dropdown = ({ isDropdownOpen }: DropdownProps) => {
  return (
    <svg
      className={`dropdown-arrow ${isDropdownOpen ? "rotated" : ""}`}
      width="12"
      height="8"
      viewBox="0 0 12 8"
      fill="none"
    >
      <path
        d="M1 1L6 6L11 1"
        stroke="#403F3D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Dropdown;
