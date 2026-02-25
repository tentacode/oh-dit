import Markdown from "markdown-to-jsx";
import { useFetchRuleHelp } from "../../queries/useFetchRuleHelp";
import tabStyles from "../../styles/rule_tab.module.css";
import helpStyles from "../../styles/rule_help.module.css";
import MarkdownExternalLink from "@/src/features/markdown/components/MarkdownExternalLink";

export default function RuleHelp({ ruleUuid }: { ruleUuid: string }) {
  const { data: ruleHelp, isLoading, isError } = useFetchRuleHelp(ruleUuid);

  if (isLoading || isError || !ruleHelp) {
    return null;
  }

  return (
    <Markdown
      options={{ overrides: { 
        a: { component: MarkdownExternalLink },
      } }}
      className={`${tabStyles.tabContainer} ${helpStyles.markdownContainer}`}
    >
      {ruleHelp.content}
    </Markdown>
  );
}
