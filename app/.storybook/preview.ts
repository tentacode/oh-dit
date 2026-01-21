import type { Preview } from "@storybook/nextjs-vite";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'error' - fail CI on a11y violations (RGAA compliance)
      test: "error",
    },
    backgrounds: {
      default: "ohdit",
      values: [
        { name: "ohdit", value: "#FFF5F3" },
        { name: "white", value: "#FFFFFF" },
        { name: "dark", value: "#010101" },
      ],
    },
  },
};

export default preview;