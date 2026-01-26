import cardStyles from "@/src/components/cards/styles/cards.module.css";

export default function CardsGroups({children}: {children: React.ReactNode}) {
    return (
        <div className={cardStyles.cardsGroupsContainer}>
            {children}
        </div>
    )
}