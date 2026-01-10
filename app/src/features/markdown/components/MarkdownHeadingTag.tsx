import type { JSX } from 'react';
import markdownStyles from '@/src/features/markdown/styles/markdown.module.css';

export default function MarkdownHeadingTag({
  level,
  minimalLevel,
  children,
}: {
  level: number;
  minimalLevel: number;
  children: React.ReactNode;
}) {
  const overrideLevel = level + (minimalLevel - 1);

  let Tag = `h${overrideLevel}` as keyof JSX.IntrinsicElements;
  if (overrideLevel > 6) {
    Tag = 'span';
  }

  return <Tag className={markdownStyles[`h${level}`]}>{children}</Tag>;
}