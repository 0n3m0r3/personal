interface DecorativeCurveDesktopProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  strokeColor?: string;
  strokeWidth?: string | number;
}

export default function DecorativeCurveDesktop({
  width = "126",
  height = "380",
  className = "",
  strokeColor = "white",
  strokeWidth = "3"
}: DecorativeCurveDesktopProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 126 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M129.685 378.387C100.212 369.539 42.6718 340.443 48.2971 294.842C55.3286 237.84 200.281 118.138 0.747199 1.99934"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
