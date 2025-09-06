import * as React from "react";

export type GoogleIconProps = React.SVGProps<SVGSVGElement>;

export function GoogleIcon({
  className,
  width = 20,
  height = 20,
  ...props
}: GoogleIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={width}
      height={height}
      className={className}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {/* Monochrome Google "G" mark built from the official segmented paths */}
      <path
        d="M21.35 11.1h-9.17v2.98h5.29c-.23 1.33-.93 2.45-1.98 3.2v2.65h3.2c1.86-1.72 2.94-4.26 2.94-7.27 0-.7-.07-1.37-.2-2.02z"
        fill="currentColor"
      />
      <path
        d="M12.18 22c2.7 0 4.96-.89 6.62-2.39l-3.2-2.65c-.89.6-2.03.97-3.42.97-2.63 0-4.86-1.77-5.65-4.14H3.2v2.61C4.84 19.64 8.2 22 12.18 22z"
        fill="currentColor"
      />
      <path
        d="M6.53 13.79c-.2-.6-.31-1.24-.31-1.9s.11-1.3.31-1.9V6.38H3.2C2.47 7.77 2.07 9.34 2.07 11c0 1.66.4 3.23 1.13 4.62l3.33-1.83z"
        fill="currentColor"
      />
      <path
        d="M12.18 4.85c1.47 0 2.79.51 3.83 1.52l2.87-2.87C17.14 1.69 14.88.8 12.18.8 8.2.8 4.84 3.16 3.2 6.38l3.33 1.83c.79-2.37 3.02-4.14 5.65-4.14z"
        fill="currentColor"
      />
    </svg>
  );
}

export default GoogleIcon;
