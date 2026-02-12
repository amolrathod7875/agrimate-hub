import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Category-specific colors
        agri: {
          DEFAULT: "hsl(var(--agri))",
          foreground: "hsl(var(--agri-foreground))",
          light: "hsl(var(--agri-light))",
          dark: "hsl(var(--agri-dark))",
        },
        horti: {
          DEFAULT: "hsl(var(--horti))",
          foreground: "hsl(var(--horti-foreground))",
          light: "hsl(var(--horti-light))",
          dark: "hsl(var(--horti-dark))",
        },
        florist: {
          DEFAULT: "hsl(var(--florist))",
          foreground: "hsl(var(--florist-foreground))",
          light: "hsl(var(--florist-light))",
          dark: "hsl(var(--florist-dark))",
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, rgba(34, 77, 23, 0.85) 0%, rgba(56, 103, 43, 0.75) 50%, rgba(76, 125, 40, 0.8) 100%)',
        'hero-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        'neumorphic-light': 'linear-gradient(145deg, #ffffff 0%, #e6e6e6 100%)',
        'neumorphic-dark': 'linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)',
      },
      boxShadow: {
        'neumorphic': '20px 20px 60px #d1d9e6, -20px -20px 60px #ffffff',
        'neumorphic-sm': '10px 10px 30px #d1d9e6, -10px -10px 30px #ffffff',
        'neumorphic-inset': 'inset 10px 10px 30px #d1d9e6, inset -10px -10px 30px #ffffff',
        'agri': '0 4px 14px rgba(101, 67, 33, 0.3)',
        'horti': '0 4px 14px rgba(255, 140, 0, 0.3)',
        'florist': '0 4px 14px rgba(219, 112, 147, 0.3)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        'neumorphic': '30px',
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "scan-line": {
          '0%': {
            top: '0%',
          },
          '100%': {
            top: '100%',
          },
        },
        "pulse-glow": {
          '0%, 100%': {
            boxShadow: '0 0 5px rgba(255, 255, 255, 0.5)',
          },
          '50%': {
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.8)',
          },
        },
        "float": {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        "marquee": {
          '0%': {
            transform: 'translateX(0)',
          },
          '100%': {
            transform: 'translateX(-50%)',
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "scan-line": "scan-line 2s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "marquee": "marquee 30s linear infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
