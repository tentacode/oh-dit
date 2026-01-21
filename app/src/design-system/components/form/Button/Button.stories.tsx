import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Design System/Form/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
## Conformite RGAA

Ce composant respecte les criteres RGAA suivants :

- **RGAA 11.9** : Les boutons ont un nom accessible (via le contenu ou \`aria-label\`)
- **RGAA 12.8** : Le focus est visible (bordure coloree + outline)
- **RGAA 3.2** : Contraste de couleur suffisant (noir sur fond clair)

### Exemple d'utilisation

\`\`\`tsx
<Button type="submit">Se connecter</Button>

<Button variant="small" onClick={handleSave}>
  <SaveIcon /> Enregistrer
</Button>

// Pour un bouton avec icone uniquement
<Button ariaLabel="Supprimer">
  <TrashIcon />
</Button>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: ["button", "submit", "reset"],
    },
    variant: {
      control: "select",
      options: ["default", "small"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Se connecter",
    type: "submit",
  },
};

export const Small: Story = {
  args: {
    children: "Enregistrer",
    variant: "small",
    type: "button",
  },
};

export const Disabled: Story = {
  args: {
    children: "Envoyer",
    disabled: true,
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        Ajouter
      </>
    ),
    type: "button",
  },
};

export const IconOnly: Story = {
  args: {
    children: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        style={{ margin: 0 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
        />
      </svg>
    ),
    ariaLabel: "Supprimer",
    type: "button",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pour les boutons avec uniquement une icone, utilisez `ariaLabel` pour fournir un nom accessible.",
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Button>Default</Button>
        <Button variant="small">Small</Button>
      </div>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Button disabled>Disabled</Button>
        <Button variant="small" disabled>
          Small Disabled
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Vue d'ensemble de toutes les variantes de boutons.",
      },
    },
  },
};
