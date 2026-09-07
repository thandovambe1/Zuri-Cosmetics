import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = (props: P) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...props,
});

/* The Zuri lotus-crown mark — drawn to echo the brand logo. */
export function LotusMark(props: P) {
  return (
    <svg viewBox="0 0 64 40" fill="currentColor" aria-hidden {...props}>
      <path d="M32 2c1.6 4.4 3 8.2 3 12.4 0 4.6-1.4 8.6-3 11.6-1.6-3-3-7-3-11.6C29 10.2 30.4 6.4 32 2Z" />
      <path d="M18.5 10.5c4 2.6 7.4 5.6 9.4 9.2 1.7 3 2.3 6 2.3 8.6-3.4-1.2-6.9-3.4-9.2-6.8-2-3-2.6-7-2.5-11Z" />
      <path d="M45.5 10.5c.1 4-.5 8-2.5 11-2.3 3.4-5.8 5.6-9.2 6.8 0-2.6.6-5.6 2.3-8.6 2-3.6 5.4-6.6 9.4-9.2Z" />
      <path d="M8 18.5c4.8.6 9.3 2 12.7 4.6 2.8 2.1 4.6 4.6 5.6 6.9-3.6.2-7.8-.5-11.3-2.6-3.1-1.9-5.4-5.3-7-8.9Z" />
      <path d="M56 18.5c-1.6 3.6-3.9 7-7 8.9-3.5 2.1-7.7 2.8-11.3 2.6 1-2.3 2.8-4.8 5.6-6.9 3.4-2.6 7.9-4 12.7-4.6Z" />
    </svg>
  );
}

export const IconBag = (p: P) => (
  <svg {...base(p)}>
    <path d="M5.5 8h13l1 12.5H4.5L5.5 8Z" />
    <path d="M9 8V6.8C9 4.7 10.3 3 12 3s3 1.7 3 3.8V8" />
  </svg>
);

export const IconSearch = (p: P) => (
  <svg {...base(p)}>
    <circle cx="10.8" cy="10.8" r="6.3" />
    <path d="m15.6 15.6 4.4 4.4" />
  </svg>
);

export const IconUser = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8.2" r="3.7" />
    <path d="M4.8 20c1.2-3.6 4-5.4 7.2-5.4s6 1.8 7.2 5.4" />
  </svg>
);

export const IconMenu = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 7.5h16M4 12h16M4 16.5h10" />
  </svg>
);

export const IconClose = (p: P) => (
  <svg {...base(p)}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const IconStar = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M12 2.8l2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L12 16.6l-5.6 3.3 1.4-6.3L3 9.3l6.4-.6L12 2.8Z" />
  </svg>
);

export const IconPlus = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconMinus = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14" />
  </svg>
);

export const IconTrash = (p: P) => (
  <svg {...base(p)}>
    <path d="M4.5 6.5h15M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7M6.5 6.5l.9 13h9.2l.9-13M10 10.5v5.5M14 10.5v5.5" />
  </svg>
);

export const IconArrowRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 12h15.5M14 6.5l5.5 5.5-5.5 5.5" />
  </svg>
);

export const IconChevronDown = (p: P) => (
  <svg {...base(p)}>
    <path d="m6 9.5 6 6 6-6" />
  </svg>
);

export const IconCheck = (p: P) => (
  <svg {...base(p)}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export const IconTruck = (p: P) => (
  <svg {...base(p)}>
    <path d="M2.8 6.5h11.4v10H2.8zM14.2 10h4l3 3v3.5h-7" />
    <circle cx="7" cy="18" r="1.8" />
    <circle cx="17.5" cy="18" r="1.8" />
  </svg>
);

export const IconLock = (p: P) => (
  <svg {...base(p)}>
    <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
    <path d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5M12 14.2v2.3" />
  </svg>
);

export const IconDrop = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3.2c3.4 4.2 6 7.6 6 10.8a6 6 0 0 1-12 0c0-3.2 2.6-6.6 6-10.8Z" />
    <path d="M9.4 14.4a2.7 2.7 0 0 0 2.4 2.9" />
  </svg>
);

export const IconLashFan = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 14c2.6-4.4 6-6.6 9-6.6s6.4 2.2 9 6.6" />
    <path d="M6.4 11.2 5 8.6M9.4 9.2 8.6 6.2M12 8.4V5.2M14.6 9.2l.8-3M17.6 11.2 19 8.6" />
    <path d="M3 14c2.6 2.6 6 3.9 9 3.9s6.4-1.3 9-3.9" />
  </svg>
);

export const IconSparkle = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3.5c.8 4.3 2.6 6.4 6.8 7.3-4.2 1-6 3-6.8 7.4-.8-4.4-2.6-6.4-6.8-7.4 4.2-.9 6-3 6.8-7.3Z" />
    <path d="M18.8 16.2c.4 1.9 1.1 2.8 2.9 3.2-1.8.4-2.5 1.3-2.9 3.1-.4-1.8-1.1-2.7-2.9-3.1 1.8-.4 2.5-1.3 2.9-3.2Z" />
  </svg>
);

export const IconPlay = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M8 5.4v13.2L19 12 8 5.4Z" />
  </svg>
);

export const IconPause = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M7.5 5h3v14h-3zM13.5 5h3v14h-3z" />
  </svg>
);

export const IconVolume = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 9.5h3.5L12 5.8v12.4L7.5 14.5H4z" />
    <path d="M15.5 9.2a4 4 0 0 1 0 5.6M18 7a7.4 7.4 0 0 1 0 10" />
  </svg>
);

export const IconMute = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 9.5h3.5L12 5.8v12.4L7.5 14.5H4z" />
    <path d="m16 9.5 5 5M21 9.5l-5 5" />
  </svg>
);

export const IconExpand = (p: P) => (
  <svg {...base(p)}>
    <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />
  </svg>
);

export const IconWhatsApp = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

export const IconInstagram = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="12" cy="12" r="3.8" />
    <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const IconFacebook = (p: P) => (
  <svg {...base(p)}>
    <path d="M14.8 3.5h-2.3a3.7 3.7 0 0 0-3.7 3.7v2.6H6.5v3h2.3v7.7h3.1v-7.7h2.6l.5-3h-3.1V7.4c0-.5.4-.9.9-.9h2V3.5Z" />
  </svg>
);

export const IconTikTok = (p: P) => (
  <svg {...base(p)}>
    <path d="M14.2 3.5c.4 2.4 1.9 3.9 4.3 4.2v2.8c-1.6 0-3-.5-4.3-1.4v6.1a5.6 5.6 0 1 1-5.6-5.6c.3 0 .7 0 1 .1v2.9a2.7 2.7 0 1 0 1.8 2.6V3.5h2.8Z" />
  </svg>
);

export const IconMail = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="5.5" width="18" height="13" rx="2" />
    <path d="m3.8 7 8.2 6 8.2-6" />
  </svg>
);

export const IconPin = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

export const IconPhone = (p: P) => (
  <svg {...base(p)}>
    <path d="M6.2 3.8h3l1.4 3.8-2 1.5a12.6 12.6 0 0 0 6.3 6.3l1.5-2 3.8 1.4v3c0 1-.8 1.9-1.9 1.8C10 19 5 14 4.4 5.7c-.1-1 .8-1.9 1.8-1.9Z" />
  </svg>
);
