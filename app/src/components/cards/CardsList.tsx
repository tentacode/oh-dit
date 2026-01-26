import cardStyles from "@/src/components/cards/styles/cards.module.css";

export default function CardsList({children}: {children: React.ReactNode}) {
    return (
        <ul className={cardStyles.cardsList}>
            {children}
        </ul>
    )
}