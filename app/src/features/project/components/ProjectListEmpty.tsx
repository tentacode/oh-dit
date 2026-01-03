import SleepyCat from "@/src/components/illustrations/SleepingCat";
import { FolderIcon } from "@heroicons/react/24/outline";

export default function ProjectListEmpty() {
  const styles = {
    illustrationContainer: {
      display: "flex",
      flexDirection: "row" as const,
      alignItems: "flex-start",
      justifyContent: "center",
      gap: "40px",
    },
    textBox: {
      flex: 2,
      display: "flex",
      flexDirection: "row" as const,
      alignItems: "flex-start",
      justifyContent: "center",
      gap: "40px",
      border: "3px dashed #010101",
      borderRadius: "15px",
      padding: "40px",
      paddingTop: "30px",
    },
    icon: {
        width: "70px",
    },
    text: {
      flex: 1,
      fontSize: "1.75em",
      fontFamily: "Lexend Deca, sans-serif",
    },
    illustration: {
      flex: 1,
    },
    textTitle: {
      fontSize: "1.2em",
      fontWeight: 600,
      margin: '0',
    },
    paragraph: {
      marginTop: "20px",
      marginBottom: "0",
      fontSize: "0.8em",
    },
  };

  return (
    <div style={styles.illustrationContainer}>
      <div style={styles.textBox}>
        <div>
          <FolderIcon aria-hidden="true" style={styles.icon} />
        </div>
        <div style={styles.text}>
          <h2 style={styles.textTitle}>Bienvenue sur Ohdit ! <span aria-hidden="true">🎉</span></h2>
          <p style={styles.paragraph}>
            C'est ici que vous retrouverez tous vos beaux projets d'audit.
          </p>
          <p style={styles.paragraph}>
            <strong>Avant de créer votre premier audit</strong>, sachez que vos données sont protégées et ne quittent pas Ohdit.
            Nous avons rédigé un <a href={`${process.env.NEXT_PUBLIC_WWW_HOST}/politique-de-securisation-des-donnees`} target="_blank">guide simple et lisible sur notre politique de sécurisation des données</a> que nous vous invitons à consulter.
          </p>
          <p style={styles.paragraph}>Sur ce, <strong>ohditez bien !</strong></p>
        </div>
      </div>
      <SleepyCat style={styles.illustration} />
    </div>
  );
}
