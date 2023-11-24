const plugin = require("tailwindcss/plugin")

const content = plugin.withOptions(function (options = { strategy: "auto" }) {
  return function ({ addBase, addComponents, theme }) {
    const rules = [
      {
        ".content": {
          "--content-max-width": "900px",
          "--padding-inline": "1rem",
          "--popout-extra-width": "2rem",
          "--feature-extra-width": "2rem",

          "--gap": "var(--padding-inline, 1rem)",
          "--full": "minmax(var(--gap), 1fr)",
          "--content": "min(var(--content-max-width, 70ch), 100% - var(--gap) * 2);",
          "--popout": "minmax(0, var(--popout-extra-width, 2rem))",
          "--feature": "minmax(0, var(--feature-extra-width, 5rem))",

          display: "grid",
          columnGap: "0 !important",
          gridTemplateColumns: `
            [full-start] 
              var(--full)
                [feature-start] 
                  var(--feature)
                    [popout-start] 
                      var(--popout)
                        [content-start] 
                          var(--content) 
                        [content-end]
                      var(--popout) 
                    [popout-end]
                  var(--feature) 
                [feature-end]
              var(--full) 
            [full-end]
          `,
        },
      },

      {
        [[
          ".content > :not(.content-popout, .content-feature, .content-full-width, .content-full-width-grow)",
          ".content-full-width > :not(.content-popout, .content-feature, .content-full-width, .content-full-width-grow)",
        ]]: {
          gridColumn: "content",
        },

        ".content > .content-popout": {
          gridColumn: "popout",
        },

        ".content > .content-feature": {
          gridColumn: "feature",
        },

        ".content > .content-full-width": {
          gridColumn: "full",
          columnGap: "0 !important",
          display: "grid",
          gridTemplateColumns: "inherit",
        },

        ".content > .content-full-width-grow": {
          gridColumn: "full",
        },
      },
    ]

    addComponents(rules)
  }
})

module.exports = content
