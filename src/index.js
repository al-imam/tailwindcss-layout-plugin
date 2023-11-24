const plugin = require('tailwindcss/plugin')

const content = plugin.withOptions(function (options = { strategy: undefined }) {
  return function ({ addBase, addComponents, theme }) {
    const rules = [
      {
        '.content-grid': {
          '--padding-inline': '1rem',
          '--content-max-width': '900px',
          '--breakout-max-width': '1200px',

          '--breakout-size': `calc(
            (var(--breakout-max-width) - var(--content-max-width)) / 2
          )`,

          display: 'grid',
          gridTemplateColumns: `
            [full-width-start] 
              minmax(var(--padding-inline), 1fr)
                [breakout-start] 
                  minmax(0, var(--breakout-size))
                    [content-start] 
                      min(100% - (var(--padding-inline) * 2),var(--content-max-width))
                    [content-end]
                  minmax(0, var(--breakout-size)) 
                [breakout-end]
              minmax(var(--padding-inline), 1fr)
            [full-width-end]
          `,
        },
      },

      {
        [[
          '.content-grid > :not(.breakout, .full-width)',
          '.full-width > :not(.breakout, .full-width)',
        ]]: {
          gridColumn: 'content',
        },
      },

      {
        '.content-grid > .breakout': {
          gridColumn: 'breakout',
        },
      },

      {
        '.content-grid > .full-width': {
          gridColumn: 'full-width',

          display: 'grid',
          gridTemplateColumns: 'inherit',
        },
      },
    ]

    addComponents(rules)
  }
})

module.exports = content
