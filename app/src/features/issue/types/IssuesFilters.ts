import { parseAsArrayOf, parseAsString, parseAsStringEnum } from "nuqs";

export const issuesFiltersParsers = {
  status: parseAsStringEnum(['all', 'pending', 'fixed']).withDefault('all'),
  sort: parseAsStringEnum(['date', 'screen', 'rule', 'severity']).withDefault('severity'),
  group: parseAsStringEnum(['screen', 'rule', 'severity']).withDefault('screen'),
  severity: parseAsArrayOf(parseAsStringEnum(['low', 'moderate', 'blocking'])).withDefault([]),
  screen: parseAsString,
  rule: parseAsString,
}

export type IssuesFilters = {
  status: "all" | "pending" | "fixed";
  sort: "date" | "screen" | "rule" | "severity";
  group: "screen" | "rule" | "severity";
  severity: string[];
  screen: string | null;
  rule: string | null;
};