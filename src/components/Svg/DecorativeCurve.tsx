interface DecorativeCurveProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  strokeColor?: string;
  strokeWidth?: string | number;
}

export default function DecorativeCurve({
  width = "64",
  height = "120",
  className = "",
  strokeColor = "white",
  strokeWidth = "3"
}: DecorativeCurveProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 29 102"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M28.8086 100.255C22.4995 97.9314 10.1823 90.2918 11.3865 78.3185C12.8917 63.352 43.9205 31.9225 1.20782 1.42861"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
