import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from "react";
import { Textarea } from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "Design System/Form/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
## Conformite RGAA

Ce composant respecte les criteres RGAA suivants :

- **RGAA 11.1** : Chaque champ de formulaire a une etiquette associee (\`htmlFor\`/\`id\`)
- **RGAA 11.2** : Les champs obligatoires sont indiques visuellement et via \`aria-required\`
- **RGAA 11.10** : Les erreurs sont associees via \`aria-describedby\`
- **RGAA 11.11** : Les messages d'erreur sont presentes de maniere accessible (\`role="alert"\`)

### Exemple d'utilisation

\`\`\`tsx
<Textarea
  label="Description"
  name="description"
  required
  helpText="Decrivez le probleme rencontre."
  rows={5}
/>
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    label: "Description",
    name: "description",
    placeholder: "Entrez une description...",
  },
};

export const Required: Story = {
  args: {
    label: "Description du probleme",
    name: "issue-description",
    required: true,
    placeholder: "Decrivez le probleme rencontre...",
    rows: 5,
  },
};

export const WithHelpText: Story = {
  args: {
    label: "Commentaire",
    name: "comment",
    helpText: "Vous pouvez utiliser la syntaxe Markdown pour formater votre texte.",
    placeholder: "Ajoutez un commentaire...",
    rows: 4,
  },
};

export const WithError: Story = {
  args: {
    label: "Description",
    name: "description",
    required: true,
    error: "La description est obligatoire.",
    value: "",
  },
};

export const Disabled: Story = {
  args: {
    label: "Description (lecture seule)",
    name: "description-readonly",
    value: "Ce contenu ne peut pas etre modifie.",
    disabled: true,
    rows: 3,
  },
};

export const LongContent: Story = {
  args: {
    label: "Contenu de la page",
    name: "page-content",
    rows: 8,
    placeholder: "Entrez le contenu complet de la page...",
    helpText: "Ce champ peut contenir un contenu plus long.",
  },
};

export const Interactive: Story = {
  render: function InteractiveTextarea() {
    const [value, setValue] = useState("");
    const [error, setError] = useState<string | undefined>();
    const maxLength = 500;

    const handleChange = (newValue: string) => {
      setValue(newValue);
      if (newValue.length > maxLength) {
        setError(`La description ne peut pas depasser ${maxLength} caracteres.`);
      } else {
        setError(undefined);
      }
    };

    return (
      <div>
        <Textarea
          label="Description"
          name="description"
          required
          value={value}
          onChange={handleChange}
          error={error}
          helpText={`${value.length}/${maxLength} caracteres`}
          placeholder="Entrez une description..."
          rows={5}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Exemple interactif avec compteur de caracteres et validation.",
      },
    },
  },
};
