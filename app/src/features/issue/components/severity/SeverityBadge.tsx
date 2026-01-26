import Badge from "@/src/components/badge/Badge";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  NoSymbolIcon,
} from "@heroicons/react/24/outline";

const mapSeverity = (severity: string) => {
  switch (severity) {
    case "low":
      return "mineur";
    case "moderate":
      return "moyen";
    case "blocking":
      return "bloquant";
    default:
      return severity;
  }
};

export default function SeverityBadge({
  severity,
}: {
  severity: "low" | "moderate" | "blocking";
}) {
  const iconComponent =
    severity === "low" ? (
      <ChevronDownIcon />
    ) : severity === "moderate" ? (
      <ChevronUpIcon />
    ) : (
      <NoSymbolIcon />
    );

  return (
    <Badge>
      {iconComponent}
      impact&nbsp;{mapSeverity(severity)}
    </Badge>
  );
}
