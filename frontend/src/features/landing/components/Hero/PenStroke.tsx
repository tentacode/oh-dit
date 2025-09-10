import { colorRoles } from "@/config/colors";

export default function PenStroke({ children }: { children: React.ReactNode }) {
  const wrapperStyle = {
    color: colorRoles.accent,
    position: "relative" as const,
  };

  const penStrokeStyle = {
    position: "absolute" as const,
    bottom: "-8px",
    left: "0",
    width: "100%",
    height: "10px",
  };

  return (
    <span style={wrapperStyle}>
        {children}
        <svg
        style={penStrokeStyle}
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
        >
        <path
            d="M0,5 Q25,2 50,5 T100,5"
            stroke={colorRoles.light}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
        />
        </svg>
    </span>
  );
}