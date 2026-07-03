/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
        digital: ["Space Grotesk", "sans-serif"],
      },
      colors: {
        primary: "#F5C518",
        dark: "#0A0A0A",
        success: "#22C55E",
        error: "#EF4444",
        pending: "#F59E0B",
        // Premium global design system colors
        brand: {
          bg: "var(--brand-bg)",
          surface: "var(--brand-surface)",
          elevated: "var(--brand-elevated)",
          primary: "var(--brand-primary)",
          secondary: "var(--brand-secondary)",
          success: "var(--brand-success)",
          danger: "var(--brand-danger)",
          textPrimary: "var(--brand-text-primary)",
          textSecondary: "var(--brand-text-secondary)",
          textMuted: "var(--brand-text-muted)",
        }
      },
    },
  },
  plugins: [],
};

