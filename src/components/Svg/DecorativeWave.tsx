interface DecorativeWaveProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  strokeColor?: string;
  strokeWidth?: string | number;
}

export default function DecorativeWave({
  width = "234",
  height = "121",
  className = "",
  strokeColor = "#E7FABD",
  strokeWidth = "4"
}: DecorativeWaveProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 116 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M-91.718 14.1377C-93.7075 33.2453 -83.0199 61.6979 -24.3534 22.6479C48.9798 -26.1646 80.5275 22.2669 82.9328 86.9097C84.857 138.624 104.672 130.203 114.339 119.529"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
