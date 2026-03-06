import { CreateScreenPayload } from "../mutations/useCreateProject";

export function getDefaultScreensByRuleSet(
  ruleSetName?: string,
): CreateScreenPayload[] {
  if (
    ruleSetName === "RGAA" ||
    ruleSetName === "RGAA 25" ||
    ruleSetName === undefined
  ) {
    return [
      { name: "Accueil", url: "/", rank: 1 },
      { name: "Contact", url: "/contact", rank: 2 },
      { name: "Mentions légales", url: "/mentions-legales", rank: 3 },
      {
        name: "Déclaration d'accessibilité",
        url: "/declaration-accessibilite",
        rank: 4,
      },
      { name: "Plan du site", url: "/plan-du-site", rank: 5 },
      { name: "Aide", url: "/aide", rank: 6 },
      { name: "Authentification", url: "/login", rank: 7 },
    ];
  }

  if (ruleSetName === "RAPDF") {
    return [{ name: "Document", url: "", rank: 1 }];
  }

  if (ruleSetName === "RAAM") {
    return [
      { name: "Accueil", url: "", rank: 1 },
      { name: "Mentions légales", url: "", rank: 2 },
      { name: "Authentification", url: "", rank: 3 },
      { name: "Contact", url: "", rank: 4 },
      { name: "Documentation", url: "", rank: 5 },
    ];
  }

  return [{ name: "Accueil", url: "/", rank: 1 }];
}
