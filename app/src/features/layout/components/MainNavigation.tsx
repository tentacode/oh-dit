import {
  EnvelopeIcon,
  FolderIcon,
  LifebuoyIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

import styles from '../styles/main_navigation.module.css';

const navigation = [
  { name: 'Audits', href: '/', icon: FolderIcon },
  { name: 'Aide', href: '/aide', icon: LifebuoyIcon },
  { name: 'Contactez-nous', href: '/contact', icon: EnvelopeIcon },
  { name: 'Mon profil', href: '/profil', icon: UserIcon },
]

function isCurrentPage(menuHref: string, currentPathname: string) {
  if (menuHref === '/') {
    return currentPathname === '/' || currentPathname.startsWith('/projet/');
  }

  return currentPathname === menuHref;
}

export default function MainNavigation() {
  const currentPathname = usePathname();

  return (
    <nav className={styles.navigationContainer}>
      <ul role="list">
        {navigation.map((item) => (
          <li key={item.name}>
            <a
              href={item.href}
              className={clsx([
                isCurrentPage(item.href, currentPathname) && styles.active,
                'group flex gap-x-3 p-2 text-sm/6 font-semibold',
                styles.navLink,
              ])}
            >
              <item.icon
                aria-hidden="true"
                className={'size-6 shrink-0'}
              />
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
