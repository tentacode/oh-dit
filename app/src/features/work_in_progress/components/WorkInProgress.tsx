import styles from '../styles/work_in_progress.module.css';
import WorkInProgressIllustration from './WorkInProgressIllustration';

export default function WorkInProgress({children, illustration}: {children: React.ReactNode, illustration?: React.ReactNode}) {
  return (
    <div className={styles.wipContainer}>
        <div className={styles.wipText}>{children}</div>
        <div className={styles.wipIllustrationContainer}>
            {illustration || <WorkInProgressIllustration />}
        </div>
    </div>
  );
}