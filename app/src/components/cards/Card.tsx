import cardStyles from "@/src/components/cards/styles/cards.module.css";
import buttonStyles from "@/src/design-system/styles/button/button.module.css";
import Button from "@/src/design-system/components/button/Button";
import { useEffect, useRef, useState } from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function Card({
  label,
  children,
  maxCardHeight = 300,
}: {
  label: string;
  children: React.ReactNode;
  maxCardHeight?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const [cardHeight, setCardHeight] = useState(0);
  const [cardTooBig, setCardTooBig] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const cardHeight = card.scrollHeight;
    setCardHeight(cardHeight);
    if (cardHeight !== null && cardHeight > maxCardHeight) {
      setCardTooBig(true);
    }
  }, [setCardTooBig, maxCardHeight]);

  return (
    <div
      style={{
        maxHeight: isExpanded ? `${cardHeight}px` : `${maxCardHeight}px`,
        overflow: isExpanded ? "visible" : "hidden",
      }}
      className={`${cardStyles.cardContainer} ${cardTooBig && !isExpanded ? cardStyles.cardContainerCanExpand : ""}`}
      ref={cardRef}
    >
      {children}

      {cardTooBig && (
        <Button
          className={`${cardStyles.expandButton} ${buttonStyles.smallButton}`}
          onClick={() => setIsExpanded((isExpanded) => !isExpanded)}
          ariaLabel={isExpanded ? `Réduire ${label}` : `Voir plus ${label}`}
        >
          {isExpanded && <MinusIcon />}
          {!isExpanded && <PlusIcon />}
          {isExpanded ? "Réduire" : "Voir plus"}
        </Button>
      )}
    </div>
  );
}
