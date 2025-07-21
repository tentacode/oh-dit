import Button from "@/components/form/Button";
import { colorRoles } from "@/config/colors";

export default function Hero() {
  const accentClipPath = "polygon(0 0, 100% 0, 100% 86%, 0 98%)";
  const clipPath = "polygon(0 0, 100% 0, 100% 86%, 0 98%)";

  const backgroundColor = colorRoles.dark;
  const textColor = colorRoles.light;
  const accentColor = colorRoles.accent;

  const accentTextStyle = {
    color: accentColor,
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
    <div
      style={{
        paddingBottom: "20px",
        marginBottom: "40px",
        backgroundColor: accentColor,
        clipPath: accentClipPath,
      }}
    >
      <div
        className="relative isolate overflow-hidden bg-gray-900"
        style={{
          backgroundColor: backgroundColor,
          color: textColor,
          clipPath: clipPath,
        }}
      >
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-6xl font-semibold tracking-tight text-balance">
              L&apos;audit d&apos;accessibilité numérique,{" "}
              <span style={accentTextStyle}>
                facilement
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
              .
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-2xl text-pretty">
              OhDit vous offre tout les outils pour auditer vos sites web et
              applications mobiles en toute sérénité.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button href="#">Je teste Ohdit !</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
