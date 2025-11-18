import styles from '../styles/beta_banner.module.css';

export default function BetaBanner() {

  return (
    <div className={styles.bannerContainer}>
      <p className="text-sm/6">
        <strong className="font-semibold">Ohdit est gratuit pendant toute la durée de la bêta</strong>, puis évoluera vers un
        modèle payant.
        <a href="/beta" className={styles.link}>
          [En savoir plus]
        </a>
        <span aria-hidden="true" className="mx-2">•</span>
        N&apos;hésitez pas à nous faire part de vos retours à
        <a href="mailto:support@ohdit.com" className={styles.link}>
          support@ohdit.com
        </a>
      </p>
    </div>
  );
}
