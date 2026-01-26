import cardStyles from "@/src/components/cards/styles/cards.module.css";

export default function CardsGroup({children}: {children: React.ReactNode}) {
    return (
        <section className={cardStyles.cardsGroup}>
            {children}
        </section>
    )
}