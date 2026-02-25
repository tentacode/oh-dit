import typographyStyle from "@/src/design-system/styles/typography.module.css";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

export default function MarkdownExternalLink({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  const linkText = Array.isArray(children)
    ? children.filter((c) => typeof c === "string").join("")
    : typeof children === "string"
      ? children
      : undefined;

  return (
    <a
      {...props}
      aria-label={`${linkText}, nouvelle fenêtre`}
      className={typographyStyle.externalLink}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <ArrowTopRightOnSquareIcon />
    </a>
  );
}
