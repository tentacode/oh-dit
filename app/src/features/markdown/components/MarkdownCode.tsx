import "highlight.js/styles/a11y-dark.css";
import { useEffect, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/a11y-dark.css";
import markdownStyles from '@/src/features/markdown/styles/markdown.module.css';

export default function MarkdownCode({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const codeRef = useRef<HTMLElement>(null);
  
  const isBlock = className?.startsWith("lang-") || className?.startsWith("language-");
  const code = String(children).trim();

  useEffect(() => {
    if (isBlock && codeRef.current) {
      codeRef.current.removeAttribute("data-highlighted");
      hljs.highlightElement(codeRef.current);
    }
  }, [children, isBlock]);

  if (isBlock) {
    return (
      <pre>
        <code
          ref={codeRef}
          className={`${className} ${markdownStyles.blockCode}`}
        >
          {code}
        </code>
      </pre>
    );
  }

  return (
    <code className={markdownStyles.inlineCode} ref={codeRef}>
      {children}
    </code>
  );
}