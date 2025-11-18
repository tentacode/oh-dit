import { XMarkIcon } from "@heroicons/react/24/outline";
import styles from "./styles/drawer.module.css";
    
export default function Drawer({ children, onClose, closeLabel }: { children: React.ReactNode, onClose: () => void, closeLabel: string }) {
    // @TODO : handle escape key to close drawer

    return (
        <div className={styles.drawerContainer}>
            <button aria-label={closeLabel} className={styles.closeHandle} onClick={onClose}>
                <XMarkIcon />
            </button>
            {children}
        </div>
    );
}