import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

export default function ProjectListEmpty() {
  const styles = {
    emtpyContainer: {
      display: "flex",
      flexDirection: "row" as const,
      alignItems: "center",
      justifyContent: "center",
      gap: "40px",
      border: "3px dashed #010101",
      borderRadius: "15px",
      padding: "40px",
    },
    illustration: {
        width: "70px",
    },
    text: {
      flex: 1,
      fontSize: "1.75em",
      fontFamily: "Lexend Deca, sans-serif",
    },
  };

  return (
    <div style={styles.emtpyContainer}>
      <div>
        <ArrowUpRightIcon style={styles.illustration} />
      </div>
      <div style={styles.text}>
        C'est ici que vous retrouverez tous vos beaux projets.<br />
        Vous pouvez cliquer là-haut pour créer votre premier audit.
      </div>
    </div>
  );
}
