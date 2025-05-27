interface StarPatternDesktopProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  fillColor?: string;
}

export default function StarPatternDesktop({
  width = "167",
  height = "164",
  className = "",
  fillColor = "#F2F2F2"
}: StarPatternDesktopProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 167 164"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M83.5 0L85.234 79.7358L137.816 19.7692L87.8907 81.965L166.716 69.8267L88.493 85.3804L156.679 126.75L86.7589 88.3838L112.401 163.904L83.5 89.57L54.5993 163.904L80.2411 88.3838L10.3209 126.75L78.507 85.3804L0.283745 69.8267L79.1093 81.965L29.1844 19.7692L81.766 79.7358L83.5 0Z"
        fill={fillColor}
      />
    </svg>
  );
}
