'use client';

import tabStyles from "../../rule_set/styles/rule_tab.module.css";

export default function CommentsDetail({
  ruleUuid,
  screenUuid,
}: {
  ruleUuid: string;
  screenUuid: string;
}) {
  return (
    <div className={tabStyles.tabContainer}>
      <h4 className="h4">Discussion</h4>
      <p style={{fontSize: '20px', marginTop: '10px', marginBottom: '10px'}}>La fonctionnalité de discussion est <strong>en cours de développement</strong>.</p>
      <p style={{fontSize: '20px', marginBottom: '10px'}}>Cet espace sera utile pour la prise de notes ou la discussion entre auditeur•ices sur un critère particulier.</p>
      <p style={{fontSize: '20px', margin: '0'}}>Les discussions seront visibles uniquement par les auditeur•ices et non par l'équipe technique ou le client.</p>
    </div>
  );
}
