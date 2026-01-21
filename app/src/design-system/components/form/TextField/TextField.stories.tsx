import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from "react";
import { TextField } from "./TextField";

const meta: Meta<typeof TextField> = {
  title: "Design System/Form/TextField",
  component: TextField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
## Conformite RGAA

Ce composant respecte les criteres RGAA suivants :

- **RGAA 11.1** : Chaque champ de formulaire a une etiquette associee (\`htmlFor\`/\`id\`)
- **RGAA 11.2** : Les champs obligatoires sont indiques visuellement et via \`aria-required\`
- **RGAA 11.5** : Le type de saisie est indique via l'attribut \`type\` et \`autoComplete\`
- **RGAA 11.10** : Les erreurs sont associees via \`aria-describedby\`
- **RGAA 11.11** : Les messages d'erreur sont presentes de maniere accessible (\`role="alert"\`)

### Exemple d'utilisation

\`\`\`tsx
<TextField
  label="Email"
  name="email"
  type="email"
  required
  error="L'email est obligatoire"
  onChange={(value) => setEmail(value)}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "url", "tel", "search"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  args: {
    label: "Nom du projet",
    name: "project-name",
    placeholder: "Mon projet",
  },
};

export const Email: Story = {
  args: {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "exemple@domaine.fr",
    autoComplete: "email",
  },
};

export const Password: Story = {
  args: {
    label: "Mot de passe",
    name: "password",
    type: "password",
    autoComplete: "current-password",
  },
};

export const Required: Story = {
  args: {
    label: "Email",
    name: "email",
    type: "email",
    required: true,
    placeholder: "exemple@domaine.fr",
  },
};

export const WithHelpText: Story = {
  args: {
    label: "URL du site",
    name: "site-url",
    type: "url",
    helpText: "Entrez l'URL complete incluant https://",
    placeholder: "https://exemple.fr",
  },
};

export const WithError: Story = {
  args: {
    label: "Email",
    name: "email",
    type: "email",
    required: true,
    error: "L'email est obligatoire.",
    value: "",
  },
};

export const Disabled: Story = {
  args: {
    label: "Email (desactive)",
    name: "email-disabled",
    type: "email",
    value: "readonly@exemple.fr",
    disabled: true,
  },
};

export const Interactive: Story = {
  render: function InteractiveTextField() {
    const [value, setValue] = useState("");
    const [error, setError] = useState<string | undefined>();

    const handleChange = (newValue: string) => {
      setValue(newValue);
      // Simple email validation
      if (newValue && !newValue.includes("@")) {
        setError("L'email doit contenir un @");
      } else {
        setError(undefined);
      }
    };

    return (
      <TextField
        label="Email"
        name="email"
        type="email"
        required
        value={value}
        onChange={handleChange}
        error={error}
        helpText="Entrez une adresse email valide."
        placeholder="exemple@domaine.fr"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Exemple interactif avec validation en temps reel.",
      },
    },
  },
};
