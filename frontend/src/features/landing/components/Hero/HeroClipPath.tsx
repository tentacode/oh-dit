import { colorRoles, colors } from "@/config/colors";

export default function HeroClipPath({
  children,
}: {
  children: React.ReactNode;
}) {
  const clipPath = "polygon(0 0, 100% 0, 100% 86%, 0 98%)";

  const backgroundColor = colorRoles.dark;
  const textColor = colorRoles.light;

  return (
    <div
      style={{
        paddingBottom: "20px",
        marginBottom: "40px",
        backgroundColor: colorRoles.accent,
        clipPath: clipPath,
      }}
    >
      <div
        style={{
          paddingBottom: "5px",
          backgroundColor: colors.green,
          clipPath: clipPath,
        }}
      >
        <div
          style={{
            backgroundColor: backgroundColor,
            color: textColor,
            clipPath: clipPath,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
