import cardStyles from "@/src/components/cards/styles/cards.module.css";

export default function CardsList({children}: {children: React.ReactNode}) {
    return (
        <div className={cardStyles.cardsList}>
            {children}
        </div>
    )
}