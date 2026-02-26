import Link from "next/link";
import styles from "./styles/filters.module.css";
import clsx from "clsx";
import {
  createSerializer,
  useQueryStates,
} from "nuqs";
import { IssuesFilters, issuesFiltersParsers } from "@/src/features/issue/types/IssuesFilters";

const serialize = createSerializer(issuesFiltersParsers);

type FilterLinkProps = {
  filters: Partial<IssuesFilters>;
  children: React.ReactNode;
  isActive: boolean;
};

export default function FilterLink({
  filters: newFilters,
  isActive,
  children,
}: FilterLinkProps) {
  const [currentFilters, setFilters] = useQueryStates(issuesFiltersParsers);
  const href = serialize({ ...currentFilters, ...newFilters });

  const finalHref = href === "" || href === "?" ? "?" : href;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setFilters(newFilters);
  };

  return (
    <Link
      className={clsx(styles.filterLink, isActive && styles.filterLinkActive)}
      prefetch={false}
      href={finalHref}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
