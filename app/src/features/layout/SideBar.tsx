import {
  BoltIcon,
  EnvelopeIcon,
  FolderIcon,
  HomeIcon,
  LifebuoyIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import OhditLogo from './OhditLogo';
import { colorRoles, colors } from '@/src/config/colors';

const navigation = [
  { name: 'Accueil', href: '#', icon: HomeIcon, current: true },
  { name: 'Dernier audit', href: '#', icon: BoltIcon, current: false },
  { name: 'Projets', href: '#', icon: FolderIcon, current: false },
  { name: 'Utilisateurs', href: '#', icon: UsersIcon, current: false },
  { name: 'Aide', href: '#', icon: LifebuoyIcon, current: false },
  { name: 'Contactez-nous', href: '#', icon: EnvelopeIcon, current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function SideBar() {
  const styles = {
    logoLink: {
      display: 'flex',
      marginTop: '20px',
      marginBottom: '20px',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      height: '30px',
    },
    sidebarContainer: { 
      padding: '0 20px',
    },
  };

  return (
    <div style={styles.sidebarContainer} className="border-r border-gray-200 bg-white">
      <a style={styles.logoLink} href={process.env.NEXT_PUBLIC_WWW_HOST}>
        <span className="sr-only">Ohdit, retour au site vitrine</span>
        <OhditLogo style={styles.logo} />
      </a>
      <nav>
        <ul role="list">
          {navigation.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className={classNames(
                  item.current
                    ? 'bg-gray-50 text-accent'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                  'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                )}
              >
                <item.icon
                  aria-hidden="true"
                  className={classNames(
                    item.current ? 'text-accent' : 'text-gray-400 group-hover:text-indigo-600',
                    'size-6 shrink-0',
                  )}
                />
                {item.name}
                {item.count ? (
                  <span
                    aria-hidden="true"
                    className="ml-auto w-9 min-w-max rounded-full bg-white px-2.5 py-0.5 text-center text-xs/5 font-medium whitespace-nowrap text-gray-600 outline-1 -outline-offset-1 outline-gray-200"
                  >
                    {item.count}
                  </span>
                ) : null}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#"
              className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-50"
            >
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-gray-500 outline -outline-offset-1 outline-black/5">
                <span className="text-l font-medium text-white">DV</span>
              </span>
              <span>Mon profil</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  )
}
