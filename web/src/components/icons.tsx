import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;
const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6 6 12 12M6 18 18 6" />
    </svg>
  );
}
export function DownIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4v16m-6-6 6 6 6-6" />
    </svg>
  );
}
export function OpenIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  );
}
export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}
export function InboxIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m4 4-2 11v5h20v-5L20 4H4Z" />
      <path d="M2 15h6l2 3h4l2-3h6" />
    </svg>
  );
}
export function SearchIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 5 5" />
    </svg>
  );
}
