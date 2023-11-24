const plugin = require("tailwindcss/plugin")

function responsiveValues({ gap, feature, popout, maxWidth, content, strategy }) {
  const apply = strategy === "container"

  return {
    "@media (min-width: 640px)": {
      "--padding-inline": gap.sm,
      "--popout-extra-width": feature.sm,
      "--feature-extra-width": popout.sm,
      "--content-max-width": apply ? content.sm : maxWidth,
    },

    "@media (min-width: 768px)": {
      "--padding-inline": gap.md,
      "--popout-extra-width": feature.md,
      "--feature-extra-width": popout.md,
      "--content-max-width": apply ? content.md : maxWidth,
    },
    "@media (min-width: 1024px)": {
      "--padding-inline": gap.lg,
      "--popout-extra-width": feature.lg,
      "--feature-extra-width": popout.lg,
      "--content-max-width": apply ? content.lg : maxWidth,
    },

    "@media (min-width: 1280px)": {
      "--padding-inline": gap.xl,
      "--popout-extra-width": feature.xl,
      "--feature-extra-width": popout.xl,
      "--content-max-width": apply ? content.lg : maxWidth,
    },

    "@media (min-width: 1536px)": {
      "--padding-inline": gap["2xl"],
      "--popout-extra-width": feature["2xl"],
      "--feature-extra-width": popout["2xl"],
      "--content-max-width": apply ? content["2xl"] : maxWidth,
    },
  }
}

function mapScreenSizes(value) {
  return { DEFAULT: value, md: value, sm: value, lg: value, xl: value, "2xl": value }
}

function getScreenSizes(gap) {
  if (typeof gap === "string") return mapScreenSizes(gap)
  if (typeof gap === "object") {
    for (const key in gap) {
      if (typeof gap[key] !== "string") {
        throw new Error("Gap value is not valid")
      }
    }

    const computedGap = {}

    computedGap.DEFAULT = gap.DEFAULT ?? "1rem"
    computedGap.sm = gap.sm ?? computedGap.DEFAULT
    computedGap.md = gap.md ?? computedGap.sm
    computedGap.lg = gap.lg ?? computedGap.md
    computedGap.xl = gap.xl ?? computedGap.lg
    computedGap["2xl"] = gap["2xl"] ?? computedGap.xl

    return computedGap
  }

  throw new Error("Gap value is not valid")
}

const content = plugin.withOptions(function (options = {}) {
  return function ({ addBase, addComponents, theme }) {
    options.strategy ??= "auto"
    options.gap = getScreenSizes(options.gap ?? theme("container.padding") ?? "1rem")
    options.maxWidth ??= "56.25rem"
    options.content = getScreenSizes(
      options.content ?? {
        DEFAULT: "100%",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      }
    )
    options.popout = getScreenSizes(options.popout ?? "2rem")
    options.feature = getScreenSizes(options.feature ?? "5rem")

    const rules = [
      {
        ".content": Object.assign(
          {
            "--content-max-width":
              options.strategy === "auto" ? options.maxWidth : options.content.DEFAULT,
            "--padding-inline": options.gap.DEFAULT,
            "--popout-extra-width": options.popout.DEFAULT,
            "--feature-extra-width": options.feature.DEFAULT,

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
          responsiveValues(options)
        ),
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
