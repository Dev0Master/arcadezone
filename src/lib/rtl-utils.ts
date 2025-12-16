// RTL utility functions and constants

export type Direction = "rtl" | "ltr" | "auto"

/**
 * Get text alignment class based on direction
 */
export const getTextAlignClass = (dir?: Direction): string => {
  switch (dir) {
    case "rtl":
      return "rtl-text-right"
    case "ltr":
      return "rtl-text-left"
    default:
      return ""
  }
}

/**
 * Get margin class for RTL layouts
 */
export const getMarginClass = (
  side: "left" | "right",
  size: "2" | "4" = "2"
): string => {
  const prefix = side === "left" ? "rtl-ml" : "rtl-mr"
  return `${prefix}-${size}`
}

/**
 * Get flex direction class for RTL
 */
export const getFlexDirectionClass = (dir?: Direction): string => {
  return dir === "rtl" ? "flex-row-reverse" : ""
}

/**
 * Check if current layout should be RTL
 * This can be enhanced with locale detection or user preferences
 */
export const shouldUseRTL = (locale?: string): boolean => {
  // Default to RTL for Arabic locales
  if (!locale) return true
  return locale.startsWith("ar") || locale.startsWith("he")
}

/**
 * Get border radius classes that work well with RTL
 */
export const getBorderRadiusClass = (size: "sm" | "md" | "lg" = "md"): string => {
  switch (size) {
    case "sm":
      return "rounded"
    case "md":
      return "rounded-md"
    case "lg":
      return "rounded-lg"
  }
}