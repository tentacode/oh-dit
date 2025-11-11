
import Link from 'next/link';
import styles from './styles/buttons.module.css';

export default function CallToActionLink({children, href}: {children: React.ReactNode, href: string}) {
  return (
    <Link prefetch={false} href={href} role="button" tabIndex={0} className={styles.callToAction}>
      {children}
    </Link>
  );
}