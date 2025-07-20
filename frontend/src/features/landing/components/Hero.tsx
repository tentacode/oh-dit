import { colorRoles } from "@/config/colors";

export default function Hero() {


  const accentClipPath = "polygon(0 0, 100% 0, 100% 86%, 0 98%)";
  const clipPath = "polygon(0 0, 100% 0, 100% 86%, 0 98%)";

  const accentTextStyle = {
    color: colorRoles.accent,
    position: "relative" as const,
  }

  return (
    <div style={{paddingBottom: "20px", marginBottom: "40px", backgroundColor: colorRoles.accent, clipPath: accentClipPath}}>
    <div className="relative isolate overflow-hidden bg-gray-900" style={{backgroundColor: colorRoles.dark, color: colorRoles.light, clipPath: clipPath}} >
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className='text-6xl font-semibold tracking-tight text-balance text-white'>
            L&apos;audit d&apos;accessibilité numérique, <span style={accentTextStyle}>facilement
              <svg 
                style={{
                  position: "absolute",
                  bottom: "-8px",
                  left: "0",
                  width: "100%",
                  height: "9px",
                  overflow: "visible"
                }}
                viewBox="0 0 100 7"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,4 Q15,-2 30,4 Q50,8 70,4 Q85,0 100,4"
                  stroke={colorRoles.light}
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.9"
                />
              </svg>
            </span>.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-2xl text-pretty text-gray-300">
            OhDit vous offre tout les outils pour auditer vos sites web et applications mobiles en toute sérénité.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#"
              className="rounded-md bg-white/15 px-3.5 py-2.5 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Get started
            </a>
            <a
              href="#"
              className="text-sm/6 font-semibold text-white hover:text-gray-300"
            >
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
      </div>
      {/* <svg
        viewBox="0 0 1024 1024"
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -z-10 size-256 -translate-x-1/2 mask-[radial-gradient(closest-side,white,transparent)]"
      >
        <circle
          r={512}
          cx={512}
          cy={512}
          fill="url(#8d958450-c69f-4251-94bc-4e091a323369)"
          fillOpacity="0.7"
        />
        <defs>
          <radialGradient id="8d958450-c69f-4251-94bc-4e091a323369">
            <stop stopColor="#BE185D" />
            <stop offset={1} stopColor="#EC4899" />
          </radialGradient>
        </defs>
      </svg> */}
    </div>
  );
}
