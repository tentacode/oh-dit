---
layout: ../../layouts/LegalPagesLayout.astro
lastUpdatedAt: "4 novembre 2025"
pageTitle: "🤖 Est-ce qu'on peut automatiser un audit d'accessibilité numérique ? Réponse : c'est compliqué… - Le blog Ohdit"
metaDescription: ""
---

# 🤖 Est-ce qu'on peut automatiser un audit d'accessibilité numérique ? Réponse : c'est compliqué…

Aujourd'hui on voit fleurir des solutions qui promettent de faire un audit RGAA (référentiel général d’amélioration de l’accessibilité) à votre place, à grand renfort d'automatisation et de LLM (large language model, comme Claude ou ChatGPT). La promesse est intéressante car un audit demande du temps, une certaine expertise et un coût si vous voulez passer par une entreprise spécialisée.

Mais aujourd'hui il est impossible d'automatiser les 106 critères du RGAA : certains demandent forcément un regard humain. Prenons quelques exemples :

<dl>
    <dt>critère 8.4 "Pour chaque page web ayant une langue par défaut, le code de langue est-il pertinent ?"</dt>
    <dd>
        Ici on veut vérifier que si le contenu de la page est en français, on a bien renseigné l'attribut `lang="fr"` sur la balise `&lt;html&gt;` pour que le lecteur d'écran puisse lire le site dans la bonne langue (un oubli et votre site en français sera lu en anglais ce qui rend la compréhension du contenu impossible). On peut tout à fait imaginer qu'un LLM puisse nous indiquer si ce critère est respecté, les LLM sont cappables de détecter la langue d'une page et de vérifier que l'attribut "lang" correspond à cette langue.
    </dd>
</dl>

<dl>
    <dt>critère 8.7 "Dans chaque page web, chaque changement de langue est-il indiqué dans le code source (hors cas particuliers) ?"</dt>
    <dd>
        Ici c'est un peu plus compliqué : on doit vérifier si la page contient des mots ou phrases qui sont dans une autre langue que la langue principale (un article de blog écrit en anglais sur un site en français par exemple), et si à chaque fois on renseigne bien l'attribut "lang" sur le texte correspondant. Encore une fois on peut imaginer qu'un LLM avec un bon prompt soit cappable de le détecter, mais sur des gros volumes de texte il y a une marge d'erreur et d'halucination significative. A priori une verification manuelle s'impose de toute manière.
    </dd>
</dl>

<dl>
    <dt>critère 10.4 "Dans chaque page web, le texte reste-t-il lisible lorsque la taille des caractères est augmentée jusqu’à 200 %, au moins (hors cas particuliers) ?"</dt>
    <dd>
        Là on rentre dans les critères purement visuels où une attention au détail est importantes. Il est difficile de valider ces critères en lisant le code html uniquement et à ce que je sache on a pas d'IA assez maligne aujourd'hui pour tester tout les cas limites de ce genres de critères (différentes résolutions, vérifier que ce critère reste bien valide avec toutes les intéractions dans une page complexe, etc.).
    </dd>
</dl>

Donc comme on peut le voir, a priori, une IA ne remplace pas un humain sur un audit RGAA. Au mieux elle peut "prémacher" le travail. Ce n'est pas forcément une mauvaise chose mais je pense qu'il y a un très gros risque à ce que l'auditeur soit tenté de prendre le résultat fournit par l'IA comme argent comptant et à ne pas pousser l'analyse plus loin, d'autant plus si le site est audité par une personne non experte.

Sur [Ohdit](https://ohdit.com) j'ai décidé de me focaliser sur l'interface de saisie des audits et de ne pas proposer d'automatisation pour le moment, l'idée est de faire gagner du temps à l'auditeur·ice tout en lui laissant la responsabilité de l'audit. J'aimerais aussi arriver à proposer une documentation augmentée des critères pour que les équipes techniques qui manquent d'expérience en accessibilité numérique puisse quand même comprendre les critères plus complexes : à quoi ils servent (et pour qui !), comment les tester efficacement et avec des exemples d'erreur courrantes qu'on peut trouver dans le code.

Pour autant je n'ai rien contre l'IA, au contraire ! Je l'utilise au quotidien pour m'aider à résoudre des problématiques de développement ou pour automatiser certains processus, et si vous avez une démarche sincère sur l'accessibilité numérique et que vous pensez que l'automatisation peut vous aider à répondre à certains problèmes, n'hésitez pas ! Je pense notament à la conférence de [Virgil Roger](https://www.linkedin.com/in/virgil-roger-a4979a89/) : [“a11y” : aïe aïe aïe ?! Démystifier l'accessibilité pour améliorer nos produits](https://www.lyonjs.org/evenement/108-lyonjs-deconstruction-et-demystification-e_311188398) où il propose l'automatisation de certains critères dans l'intégration continue avec Cypress.

**Mais n'oubliez pas que le principal c'est que votre site soit accessible. Tous les audits et les outils ne remplaceront jamais une verrification manuelle avec les mêmes dispositifs que les personnes handicapées : navigation au clavier, et lecteur d'écran.**
