import type { Meta, StoryObj } from "@storybook/react";
import { FormField } from "./FormField";

const meta: Meta<typeof FormField> = {
  title: "Design System/Form/FormField",
  component: FormField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
## Conformite RGAA

Ce composant est le fondement du systeme de formulaires accessibles. Il gere automatiquement :

- **RGAA 11.1** : Association etiquette/champ via \`htmlFor\`/\`id\`
- **RGAA 11.2** : Indication des champs obligatoires (asterisque visuel + \`aria-required\`)
- **RGAA 11.10** : Association des erreurs via \`aria-describedby\`
- **RGAA 11.11** : Messages d'erreur avec \`role="alert"\`
- **RGAA 11.13** : Association du texte d'aide via \`aria-describedby\`

### Utilisation

\`\`\`tsx
<FormField label="Email" name="email" required error={errors.email}>
  {(props) => <input type="email" {...props} />}
</FormField>
\`\`\`

Le composant enfant recoit automatiquement les props necessaires pour l'accessibilite.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormField>;

const inputStyle = {
  padding: "10px 15px",
  border: "3px solid #010101",
  borderRadius: "10px",
  fontSize: "1rem",
  width: "100%",
  boxSizing: "border-box" as const,
};

export const Default: Story = {
  args: {
    label: "Nom du projet",
    name: "project-name",
    children: (props) => <input type="text" placeholder="Mon projet" style={inputStyle} {...props} />,
  },
};

export const Required: Story = {
  args: {
    label: "Email",
    name: "email",
    required: true,
    children: (props) => <input type="email" placeholder="exemple@domaine.fr" style={inputStyle} {...props} />,
  },
};

export const WithHelpText: Story = {
  args: {
    label: "URL du site",
    name: "site-url",
    helpText: "Entrez l'URL complete incluant https://",
    children: (props) => <input type="url" placeholder="https://exemple.fr" style={inputStyle} {...props} />,
  },
};

export const WithError: Story = {
  args: {
    label: "Email",
    name: "email",
    required: true,
    error: "L'email est obligatoire.",
    children: (props) => (
      <input
        type="email"
        value=""
        style={{
          ...inputStyle,
          borderColor: props["aria-invalid"] ? "#BA0303" : "#010101",
        }}
        {...props}
        readOnly
      />
    ),
  },
};

export const WithHelpAndError: Story = {
  args: {
    label: "Mot de passe",
    name: "password",
    required: true,
    helpText: "Minimum 8 caracteres avec au moins une majuscule.",
    error: "Le mot de passe ne respecte pas les criteres.",
    children: (props) => (
      <input
        type="password"
        value="abc"
        style={{
          ...inputStyle,
          borderColor: props["aria-invalid"] ? "#BA0303" : "#010101",
        }}
        {...props}
        readOnly
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Lorsqu'une erreur est presente, le texte d'aide est masque et seule l'erreur est affichee.",
      },
    },
  },
};
