interface StarPatternProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  fillColor?: string;
  strokeWidth?: number;
}

export default function StarPattern({
  width = "46",
  height = "54",
  className = "",
  fillColor = "#F2F2F2",
  strokeWidth = 2
}: StarPatternProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 36 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M18.1244 0.138672L18.4956 21.0744L29.7513 5.32937L19.0643 21.6597L35.9379 18.4727L19.1932 22.5565L33.7893 33.4187L18.822 23.3451L24.311 43.174L18.1244 23.6565L11.9379 43.174L17.4268 23.3451L2.4595 33.4187L17.0556 22.5565L0.310934 18.4727L17.1845 21.6597L6.49749 5.32937L17.7532 21.0744L18.1244 0.138672Z"
        fill={fillColor}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
