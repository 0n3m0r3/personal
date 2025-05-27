interface DecorativeWaveDesktopProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  strokeColor?: string;
  strokeWidth?: string | number;
}

export default function DecorativeWaveDesktop({
  width = "534",
  height = "481",
  className = "",
  strokeColor = "#E7FABD",
  strokeWidth = "4"
}: DecorativeWaveDesktopProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 534 481"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M-430.366 46.401C-439.66 119.174 -389.733 227.539 -115.67 78.8132C226.908 -107.094 374.284 77.3619 385.521 323.56C394.51 520.519 487.076 488.448 532.235 447.793"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
