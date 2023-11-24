type CSSValue = `${number}px` | `${number}em` | `${number}rem` | `${number}%` | `var(--${string})`

type Screens = Partial<{
  DEFAULT: CSSValue
  sm: CSSValue
  md: CSSValue
  lg: CSSValue
  xl: CSSValue
  "2xl": CSSValue
}>

type MediaValue = { max: CSSValue; width: CSSValue } | CSSValue

type ScreensMedia = Partial<{
  DEFAULT: MediaValue
  sm: MediaValue
  md: MediaValue
  lg: MediaValue
  xl: MediaValue
  "2xl": MediaValue
}>

declare function plugin(
  options?: Partial<{
    strategy: "container" | "auto"
    content: ScreensMedia
    popout: Screens | CSSValue
    feature: Screens | CSSValue
    gap: Screens | CSSValue
    maxWidth: CSSValue
    prefix: string
  }>
): {
  handler: () => void
}

declare namespace plugin {
  const __isOptionsFunction: true
}

export = plugin
