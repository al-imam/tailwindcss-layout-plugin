declare function plugin(options?: Partial<{ strategy: 'container' | 'auto' }>): {
  handler: () => void
}

declare namespace plugin {
  const __isOptionsFunction: true
}

export = plugin
