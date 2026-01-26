import badgeStyles from '@/src/components/badge/styles/badge.module.css';

export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className={`${badgeStyles.badge}`}>
        {children}
    </span>
  );
}