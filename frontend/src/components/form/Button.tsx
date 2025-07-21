import { colorRoles } from "@/config/colors";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from '@heroicons/react/24/solid'


export default function Button({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
    const borderColor = colorRoles.accent;

    const style = {
        borderColor: borderColor,
        borderWidth: "4px",
        borderStyle: "solid",
        borderRadius: "15px",
        padding: "10px 15px",
        backgroundColor: colorRoles.dark,
        color: colorRoles.light,
        textDecoration: "none",
        fontSize: "1.5rem",
        fontWeight: "500",
        fontFamily: "var(--font-heading)",
        display: "flex",
        alignItems: "center",
        gap: "15px",
    }

  return (
    <a
      href={href}
      style={style}
    >
        <ClipboardDocumentCheckIcon className="w-8 h-8" />
      {children}
    </a>
  );
}
