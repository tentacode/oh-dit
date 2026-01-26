import cardStyles from "@/src/components/cards/styles/cards.module.css";
import { JSX } from "react/jsx-dev-runtime";

export default function CardTitle({
  children,
  headingLevel,
}: {
  children: React.ReactNode;
  headingLevel: number;
}) {
  const Heading = `h${headingLevel}` as keyof JSX.IntrinsicElements;

  return <Heading className={cardStyles.cardTitle}>{children}</Heading>;
}
