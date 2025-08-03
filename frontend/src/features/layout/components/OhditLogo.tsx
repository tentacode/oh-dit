import { colorRoles } from "@/config/colors";

export default function OhditLogo() {
  const mainColor = colorRoles.light;
  const backgroundColor = colorRoles.dark;
  const alternateColor = colorRoles.accent;
  const fontFamily = "Lexend Deca, Lexend Deca Fallback, Arial, sans-serif";
  const fontSize = "32";
  const fontWeight = "700";

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
          fill={ mainColor }
          stroke={ mainColor }
          strokeWidth="3.5"
        />
        {/* Left eye: > */}
        <polyline
          points="12,23 15,25 12,27"
          fill="none"
          stroke={backgroundColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Right eye: < */}
        <polyline
          points="24,23 21,25 24,27"
          fill="none"
          stroke={backgroundColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Mouth */}
        <path
          d="M13 31
     a5 8 0 1 0 10 0
     Z"
          fill={backgroundColor}
          stroke={backgroundColor}
          strokeWidth="0"
        />
      </g>

      {/* Text: h!Dit */}
      <text
        x="33"
        y="40"
        fontFamily={fontFamily}
        fontSize={fontSize}
        fontWeight={fontWeight}
        fill={ mainColor }
      >
        h
      </text>
      <text
        x="54"
        y="40"
        fontFamily={fontFamily}
        fontSize={fontSize}
        fontWeight={fontWeight}
        fill={alternateColor}
      >
        !
      </text>
      <text
        x="65"
        y="40"
        fontFamily={fontFamily}
        fontSize={fontSize}
        fontWeight={fontWeight}
        fill={ mainColor }
      >
        dit
      </text>
      <text
        x="111"
        y="40"
        fontFamily={fontFamily}
        fontSize={fontSize}
        fontWeight={fontWeight}
        fill={alternateColor}
      >
        &apos;
      </text>
    </svg>
  );
}
