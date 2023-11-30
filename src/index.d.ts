type CSSValue = `${number}px` | `${number}em` | `${number}rem` | `${number}%` | `var(--${string})`

type Screens = Partial<{
  DEFAULT: CSSValue
  sm: CSSValue
  md: CSSValue
  lg: CSSValue
  xl: CSSValue
  "2xl": CSSValue
}>

declare function plugin(
  options?: Partial<{
    content: Screens | CSSValue
    popout: Screens | CSSValue
    feature: Screens | CSSValue
    gap: Screens | CSSValue
    screens: Screens
    prefix: string
  }>
): {
  handler: () => void
}

declare namespace plugin {
  const __isOptionsFunction: true
}

export = plugin
