export default function RuleSetBadgeCard({name, version}: {name: string, version: string}) {
    return (
        <div>
          <strong>Référentiel</strong>
          <span>
            {name} {version}
          </span>
        </div>
    )
}