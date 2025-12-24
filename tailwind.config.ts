import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        soft: "0 10px 40px -20px rgba(0,0,0,0.35)",
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(800px 400px at 10% 10%, rgba(255,255,255,0.16), transparent 60%), radial-gradient(900px 500px at 90% 0%, rgba(255,201,141,0.22), transparent 55%), radial-gradient(700px 500px at 50% 100%, rgba(164,210,255,0.16), transparent 60%)",
        "mesh-light":
          "linear-gradient(135deg, rgba(255,242,230,0.8), rgba(255,255,255,0.6)), radial-gradient(circle at 20% 20%, rgba(255,221,179,0.8), transparent 60%)",
        "mesh-dark":
          "linear-gradient(140deg, rgba(12,18,30,1), rgba(20,28,42,1)), radial-gradient(circle at 20% 10%, rgba(255,178,120,0.2), transparent 60%)",
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "float-slow": "float-slow 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
