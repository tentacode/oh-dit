import Button from "@/components/form/Button";
import CheckListIllustration from "./CheckListIllustration.svg";
import PenStroke from "./PenStroke";
import HeroClipPath from "./HeroClipPath";

export default function Hero() {
  return (
    <HeroClipPath>
      <div className="px-6 py-24" style={{ paddingBottom: "150px" }}>
        <div className="mx-auto max-w-6xl text-center flex">
          <div className="flex-6 flex flex-col justify-center">
            <h1 className="text-6xl font-semibold tracking-tight text-balance">
              L&apos;audit d&apos;accessibilité numérique,{" "}
              <PenStroke>facilement</PenStroke>.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-2xl text-pretty">
              Ohdit vous offre tout les outils pour auditer vos sites web et
              applications mobiles en toute sérénité.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button href="#">Je teste Ohdit !</Button>
            </div>
          </div>

          <CheckListIllustration />
        </div>
      </div>
    </HeroClipPath>
  );
}
