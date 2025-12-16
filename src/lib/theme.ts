import { cva, type VariantProps } from "class-variance-authority"

// Base gaming theme configuration
export const gamingTheme = {
  colors: {
    primary: "var(--gaming-primary)",
    secondary: "var(--gaming-secondary)",
    accent: "var(--gaming-accent)",
    success: "var(--gaming-success)",
    warning: "var(--gaming-warning)",
    danger: "var(--gaming-danger)",
    dark: "var(--gaming-dark)",
    light: "var(--gaming-light)",
    cardBg: "var(--gaming-card-bg)",
    cardHover: "var(--gaming-card-hover)",
  },
  borderRadius: "0.5rem",
  fontFamily: "var(--font-cairo)",
}

// Common gaming variant patterns for components
export const createGamingVariants = (baseClasses: string) => cva(baseClasses, {
  variants: {
    variant: {
      default: "",
      gaming: `border-[var(--gaming-primary)] bg-[var(--gaming-dark)] text-[var(--foreground)] focus:ring-[var(--gaming-primary)] focus:border-[var(--gaming-primary)]`,
      "gaming-secondary": `border-[var(--gaming-secondary)] bg-[var(--gaming-dark)] text-[var(--foreground)] focus:ring-[var(--gaming-secondary)] focus:border-[var(--gaming-secondary)]`,
      "gaming-accent": `border-[var(--gaming-accent)] bg-[var(--gaming-dark)] text-[var(--foreground)] focus:ring-[var(--gaming-accent)] focus:border-[var(--gaming-accent)]`,
      "gaming-success": `border-[var(--gaming-success)] bg-[var(--gaming-dark)] text-[var(--foreground)] focus:ring-[var(--gaming-success)] focus:border-[var(--gaming-success)]`,
      "gaming-warning": `border-[var(--gaming-warning)] bg-[var(--gaming-dark)] text-[var(--foreground)] focus:ring-[var(--gaming-warning)] focus:border-[var(--gaming-warning)]`,
      "gaming-danger": `border-[var(--gaming-danger)] bg-[var(--gaming-dark)] text-[var(--foreground)] focus:ring-[var(--gaming-danger)] focus:border-[var(--gaming-danger)]`,
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

// Size variants for form components
export const sizeVariants = cva("", {
  variants: {
    size: {
      default: "h-10 px-3 py-2",
      sm: "h-9 px-2 py-1 text-sm",
      lg: "h-11 px-4 py-3",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

// RTL utility functions
export const getRTLClass = (dir?: "rtl" | "ltr" | "auto") => {
  switch (dir) {
    case "rtl":
      return "rtl-text-right"
    case "ltr":
      return "rtl-text-left"
    default:
      return ""
  }
}

export const getRTLMarginClass = (side: "left" | "right", size: "2" | "4" = "2") => {
  if (side === "left") {
    return size === "4" ? "rtl-ml-4" : "rtl-ml-2"
  }
  return size === "4" ? "rtl-mr-4" : "rtl-mr-2"
}

// Gaming animation classes
export const gamingAnimations = {
  hover: "hover:scale-105 transition-transform duration-200",
  glow: "hover:shadow-lg hover:shadow-[var(--gaming-primary)]/50 transition-shadow duration-300",
  pulse: "animate-pulse",
  bounce: "animate-bounce",
}

// Export common gaming variant types
export type GamingVariantProps = VariantProps<ReturnType<typeof createGamingVariants>>
export type SizeVariantProps = VariantProps<typeof sizeVariants>