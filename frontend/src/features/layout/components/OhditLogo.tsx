export default function OhditLogo() {
  return (
    <svg
      viewBox="0 0 150 60"
      xmlns="http://www.w3.org/2000/svg"
      className="h-16 w-auto"
    >
      {/* Main O with surprised face */}
      <g>
        {/* Face background */}
        <ellipse
          cx="18"
          cy="28"
          rx="11"
          ry="11"
          fill="#FFFFFF"
          stroke="#FFFFFF"
          strokeWidth="3.5"
        />
        {/* Left eye: > */}
        <polyline
          points="12,23 15,25 12,27"
          fill="none"
          stroke="#000"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Right eye: < */}
        <polyline
          points="24,23 21,25 24,27"
          fill="none"
          stroke="#000"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Mouth */}
        <path
          d="M13 31
     a5 8 0 1 0 10 0
     Z"
          fill="#000"
          stroke="#000"
          strokeWidth="0"
        />
      </g>

      {/* Text: h!Dit */}
      <text
        x="33"
        y="40"
        fontFamily="Arial, sans-serif"
        fontSize="32"
        fontWeight="800"
        fill="#FFFFFF"
      >
        h
      </text>
      <text
        x="53"
        y="40"
        fontFamily="Arial, sans-serif"
        fontSize="36"
        fontWeight="800"
        fill="#FCC2DA"
      >
        !
      </text>
      <text
        x="65"
        y="40"
        fontFamily="Arial, sans-serif"
        fontSize="36"
        fontWeight="800"
        fill="#FFFFFF"
      >
        Dit
      </text>
      <text
        x="114"
        y="40"
        fontFamily="Arial, sans-serif"
        fontSize="36"
        fontWeight="800"
        fill="#FCC2DA"
      >
        &apos;
      </text>
    </svg>
  );
}
