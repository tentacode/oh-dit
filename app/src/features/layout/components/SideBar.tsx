import {
  // BoltIcon,
  EnvelopeIcon,
  FolderIcon,
  // HomeIcon,
  LifebuoyIcon,
  UserIcon,
  // UsersIcon,
} from '@heroicons/react/24/outline'
import OhditLogo from './OhditLogo';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

import styles from '../styles/sidebar.module.css';

const navigation = [
  // { name: 'Accueil', href: '#', icon: HomeIcon, current: true },
  // { name: 'Dernier audit', href: '#', icon: BoltIcon, current: false },
  { name: 'Audits', href: '/', icon: FolderIcon },
  // { name: 'Utilisateurs', href: '#', icon: UsersIcon },
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

export default function SideBar() {
  const currentPathname = usePathname();

  return (
    <div className={clsx("border-r border-gray-200 bg-white", styles.sidebarContainer)}>
      <a className={clsx(styles.logoLink)} href={process.env.NEXT_PUBLIC_WWW_HOST}>
        <span className="sr-only">Ohdit, retour au site vitrine</span>
        <OhditLogo className={clsx(styles.logo)} />
      </a>
      <nav>
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
    </div>
  )
}
