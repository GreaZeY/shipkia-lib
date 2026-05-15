import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        surface: {
          "1": "hsl(var(--surface-1))",
          "2": "hsl(var(--surface-2))",
          "3": "hsl(var(--surface-3))",
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      boxShadow: {
        premium: "var(--shadow-premium)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        skeleton: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
        "accordion-up": "accordion-up 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
        skeleton: "skeleton 2s ease-in-out infinite",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        dashboard: "24px",
        "card-lg": "16px",
      },
      spacing: {
        view: "16px",
        "layout-gap": "16px",
        "header-h": "64px",
        "sidebar-collapsed": "60px",
        "sidebar-expanded": "220px",
      },
      fontSize: {
        "display-large": [
          "2.25rem",
          { lineHeight: "2.5rem", letterSpacing: "-0.02em", fontWeight: "800" },
        ],
        "display-medium": [
          "1.875rem",
          {
            lineHeight: "2.25rem",
            letterSpacing: "-0.01em",
            fontWeight: "700",
          },
        ],
        "title-large": [
          "1.25rem",
          { lineHeight: "1.75rem", letterSpacing: "0", fontWeight: "700" },
        ],
        "title-medium": [
          "1rem",
          { lineHeight: "1.5rem", letterSpacing: "0.01em", fontWeight: "600" },
        ],
        "body-large": [
          "0.875rem",
          { lineHeight: "1.25rem", letterSpacing: "0.02em", fontWeight: "400" },
        ],
        "body-medium": [
          "0.75rem",
          { lineHeight: "1rem", letterSpacing: "0.01em", fontWeight: "400" },
        ],
        "label-small": [
          "0.625rem",
          { lineHeight: "1rem", letterSpacing: "0.05em", fontWeight: "700" },
        ],
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "Inter", "Manrope", "sans-serif"],
      },
    },
  },
  plugins: [tailwindAnimate],
} satisfies Config;
