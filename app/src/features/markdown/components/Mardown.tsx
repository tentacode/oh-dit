import "highlight.js/styles/a11y-dark.css";
import MarkdownToJsx from "markdown-to-jsx";
import MarkdownHeadingTag from "./MarkdownHeadingTag";
import markdownStyles from '@/src/features/markdown/styles/markdown.module.css';
import MarkdownCode from "./MarkdownCode";

export default function Markdown({
  children,
  minimalHeadingLevel,
}: {
  children: string;
  minimalHeadingLevel?: number;
}) {
  return (
      <MarkdownToJsx
        className={markdownStyles.issueMarkdown}
        options={{ overrides: { 
          code: MarkdownCode,
          h1: { component: MarkdownHeadingTag, props: { level: 1, minimalLevel: minimalHeadingLevel || 1 } },
          h2: { component: MarkdownHeadingTag, props: { level: 2, minimalLevel: minimalHeadingLevel || 1 } },
          h3: { component: MarkdownHeadingTag, props: { level: 3, minimalLevel: minimalHeadingLevel || 1 } },
          h4: { component: MarkdownHeadingTag, props: { level: 4, minimalLevel: minimalHeadingLevel || 1 } },
          h5: { component: MarkdownHeadingTag, props: { level: 5, minimalLevel: minimalHeadingLevel || 1 } },
          h6: { component: MarkdownHeadingTag, props: { level: 6, minimalLevel: minimalHeadingLevel || 1 } },
        } }}
      >
        {children}
      </MarkdownToJsx>
  );
}