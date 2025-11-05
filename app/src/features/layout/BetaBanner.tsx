import { colors } from "@/src/config/colors";

export default function BetaBanner() {
    const bannerContainerStyle = {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '8px 20px',
        backgroundColor: colors.darkPurple,
        color: colors.white,
    }

  return (
    <div style={bannerContainerStyle}>
      <p className="text-sm/6">
        <strong className="font-semibold">Ohdit est gratuit pendant toute la durée de la bêta</strong>, puis évoluera vers un
        modèle payant.
        <a href="/beta-faq" className="underline ml-1">
          [En savoir plus]
        </a>
        <span aria-hidden="true" className="mx-2">•</span>
        N'hésitez pas à nous faire part de vos retours à 
        <a href="mailto:support@ohdit.com" className="underline ml-1">
          support@ohdit.com
        </a>
      </p>
    </div>
  );
}
