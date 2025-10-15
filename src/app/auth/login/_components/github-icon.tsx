import * as React from "react";

export type GitHubIconProps = React.SVGProps<SVGSVGElement>;

export function GitHubIcon({
  className,
  width = 20,
  height = 20,
  ...props
}: GitHubIconProps) {
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
      {/* GitHub mark (Octocat) simplified logo */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.59 2 12.253c0 4.52 2.865 8.35 6.839 9.705.5.095.683-.22.683-.49 0-.242-.009-.884-.014-1.736-2.782.617-3.37-1.37-3.37-1.37-.455-1.174-1.11-1.486-1.11-1.486-.907-.638.069-.625.069-.625 1.003.072 1.53 1.05 1.53 1.05.892 1.56 2.341 1.11 2.91.849.091-.662.35-1.11.636-1.366-2.22-.257-4.555-1.135-4.555-5.05 0-1.116.39-2.029 1.029-2.745-.103-.257-.446-1.29.098-2.688 0 0 .84-.272 2.75 1.049A9.38 9.38 0 0 1 12 7.34c.85.004 1.705.116 2.504.34 1.909-1.321 2.748-1.049 2.748-1.049.546 1.398.202 2.431.1 2.688.64.716 1.028 1.629 1.028 2.745 0 3.924-2.339 4.79-4.566 5.043.359.318.679.944.679 1.904 0 1.374-.013 2.482-.013 2.819 0 .273.18.59.688.489A10.02 10.02 0 0 0 22 12.253C22 6.59 17.522 2 12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default GitHubIcon;
