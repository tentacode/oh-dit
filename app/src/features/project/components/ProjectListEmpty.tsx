import SleepyCat from "@/src/components/illustrations/SleepingCat";
import { ArrowUpRightIcon, FolderIcon } from "@heroicons/react/24/outline";

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
      alignItems: "center",
      justifyContent: "center",
      gap: "40px",
      border: "3px dashed #010101",
      borderRadius: "15px",
      padding: "40px",
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
  };

  return (
    <div style={styles.illustrationContainer}>
      <div style={styles.textBox}>
        <div>
          <FolderIcon aria-hidden="true" style={styles.icon} />
        </div>
        <div style={styles.text}>
          C'est ici que vous retrouverez tous vos beaux projets d'audit.
        </div>
      </div>
      <SleepyCat style={styles.illustration} />
    </div>
  );
}
