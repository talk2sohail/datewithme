// Custom SVG icons for the app

interface IconProps {
  size?: number;
  className?: string;
}

export function HeartCalendarIcon({ size = 48, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Calendar body */}
      <rect
        x="8"
        y="14"
        width="48"
        height="42"
        rx="6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Calendar rings */}
      <circle cx="22" cy="8" r="4" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="42" cy="8" r="4" stroke="currentColor" strokeWidth="2.5" />
      {/* Calendar lines */}
      <path
        d="M8 26h48"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Days dots */}
      <circle cx="18" cy="34" r="2" fill="currentColor" opacity="0.3" />
      <circle cx="26" cy="34" r="2" fill="currentColor" opacity="0.3" />
      <circle cx="34" cy="34" r="2" fill="currentColor" opacity="0.3" />
      <circle cx="42" cy="34" r="2" fill="currentColor" opacity="0.3" />
      <circle cx="22" cy="42" r="2" fill="currentColor" opacity="0.3" />
      <circle cx="30" cy="42" r="2" fill="currentColor" opacity="0.3" />
      <circle cx="38" cy="42" r="2" fill="currentColor" opacity="0.3" />
      {/* Heart */}
      <path
        d="M41 42.5c0-2.5 2-4.5 4.5-4.5a4.7 4.7 0 0 1 4.5 4.5c0 4-4.5 7.5-4.5 7.5s-4.5-3.5-4.5-7.5z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}

export function LoveLetterIcon({ size = 48, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Envelope */}
      <rect
        x="5"
        y="18"
        width="54"
        height="38"
        rx="5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Flap */}
      <path
        d="M5 23L32 44L59 23"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M5 18L32 38L59 18"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Heart seal */}
      <path
        d="M32 30a1 1 0 0 1 1-1h0a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4v0a4 4 0 0 1 4-4h0a1 1 0 0 1 1 1z"
        fill="currentColor"
        opacity="0.5"
        transform="translate(0, 4)"
      />
    </svg>
  );
}

export function LocationPinIcon({ size = 16, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M8 1a5.5 5.5 0 0 0-5.5 5.5C2.5 10.5 8 15 8 15s5.5-4.5 5.5-8.5A5.5 5.5 0 0 0 8 1z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6.5" r="2" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export function ForkKnifeIcon({ size = 16, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Fork */}
      <path
        d="M3 1v5.5a1.5 1.5 0 1 0 3 0V1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M7.5 1V15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      {/* Knife */}
      <path
        d="M10.5 1h1.5l1 5.5a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2l1-5.5z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 8.5V15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronRightIcon({ size = 20, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M7 4l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LoveHeartIcon({ size = 64, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M32 54S14 40 14 28a10 10 0 0 1 18-6 10 10 0 0 1 18 6c0 12-18 26-18 26z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PhotoFrameIcon({ size = 48, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="6"
        y="10"
        width="52"
        height="44"
        rx="5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="28" r="6" stroke="currentColor" strokeWidth="2" />
      <path
        d="M6 46l14-14 14 14 14-18 10 18"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
