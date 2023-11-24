type CSSValue = `${number}px` | `${number}em` | `${number}rem` | `${number}%` | `var(--${string})`

interface Screens {
  DEFAULT: CSSValue
  sm: CSSValue
  md: CSSValue
  lg: CSSValue
  xl: CSSValue
  "2xl": CSSValue
}

declare function plugin(
  options?: Partial<{
    strategy: "container" | "auto"
    content: Screens | CSSValue
    popout: Screens | CSSValue
    feature: Screens | CSSValue
    gap: Screens | CSSValue
  }>
): {
  handler: () => void
}

declare namespace plugin {
  const __isOptionsFunction: true
}

export = plugin
