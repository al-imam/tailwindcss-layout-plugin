const plugin = require("tailwindcss/plugin")

function responsiveValues({ gap, feature, popout, maxWidth, content, strategy }) {
  const apply = strategy === "container"

  console.log(content)

  return {
    [`@media (min-width: ${content.sm.max})`]: {
      "--padding-inline": gap.sm,
      "--popout-extra-width": feature.sm,
      "--feature-extra-width": popout.sm,
      "--content-max-width": apply ? content.sm.width : maxWidth,
    },

    [`@media (min-width: ${content.md.max})`]: {
      "--padding-inline": gap.md,
      "--popout-extra-width": feature.md,
      "--feature-extra-width": popout.md,
      "--content-max-width": apply ? content.md.width : maxWidth,
    },
    [`@media (min-width: ${content.lg.max})`]: {
      "--padding-inline": gap.lg,
      "--popout-extra-width": feature.lg,
      "--feature-extra-width": popout.lg,
      "--content-max-width": apply ? content.lg.width : maxWidth,
    },

    [`@media (min-width: ${content.xl.max})`]: {
      "--padding-inline": gap.xl,
      "--popout-extra-width": feature.xl,
      "--feature-extra-width": popout.xl,
      "--content-max-width": apply ? content.xl.width : maxWidth,
    },

    [`@media (min-width: ${content["2xl"].max})`]: {
      "--padding-inline": gap["2xl"],
      "--popout-extra-width": feature["2xl"],
      "--feature-extra-width": popout["2xl"],
      "--content-max-width": apply ? content["2xl"].width : maxWidth,
    },
  }
}

const defaultScreenSizesObj = {
  DEFAULT: { max: "0rem", width: "100%" },
  sm: { max: "640px", width: "640px" },
  md: { max: "768px", width: "768px" },
  lg: { max: "1024px", width: "1024px" },
  xl: { max: "1280px", width: "1280px" },
  "2xl": { max: "1536px", width: "1536px" },
}

function mapScreenSizes(_value) {
  return { DEFAULT: _value, md: _value, sm: _value, lg: _value, xl: _value, "2xl": _value }
}

function mapMediaScreenSizes(value, screen) {
  if (!value)
    return { max: defaultScreenSizesObj[screen].max, width: defaultScreenSizesObj[screen].width }
  if (typeof value === "string") return { max: defaultScreenSizesObj[screen].max, width: value }
  if (typeof value === "object" && value.max && value.width) {
    return { max: value.max, width: value.width }
  }

  throw new Error(`${JSON.stringify(value)} is not valid screen size value`)
}

function getScreenSizes(_value) {
  if (typeof _value === "string") return mapScreenSizes(_value)
  if (typeof _value === "object") {
    for (const key in _value) {
      if (typeof _value[key] !== "string") {
        throw new Error(`${JSON.stringify(_value[key])} is not string`)
      }
    }

    const computedGap = {}

    computedGap.DEFAULT = _value.DEFAULT ?? "1rem"
    computedGap.sm = _value.sm ?? computedGap.DEFAULT
    computedGap.md = _value.md ?? computedGap.sm
    computedGap.lg = _value.lg ?? computedGap.md
    computedGap.xl = _value.xl ?? computedGap.lg
    computedGap["2xl"] = _value["2xl"] ?? computedGap.xl

    return computedGap
  }

  throw new Error(`${JSON.stringify(_value ?? null)} is not valid css value`)
}

function getMediaScreenSizes(_value) {
  if (typeof _value === "object") {
    for (const key in _value) {
      if (typeof _value[key] !== "string" && !(_value instanceof Object)) {
        throw new Error(`${JSON.stringify(_value)} is not valid`)
      }
    }

    const computedGap = {}

    computedGap.DEFAULT = mapMediaScreenSizes(_value.DEFAULT, "DEFAULT")
    computedGap.sm = mapMediaScreenSizes(_value.sm, "sm")
    computedGap.md = mapMediaScreenSizes(_value.md, "md")
    computedGap.lg = mapMediaScreenSizes(_value.lg, "lg")
    computedGap.xl = mapMediaScreenSizes(_value.xl, "xl")
    computedGap["2xl"] = mapMediaScreenSizes(_value["2xl"], "2xl")

    return computedGap
  }

  throw new Error(`'${JSON.stringify(_value ?? null)}' is not valid media screen size value`)
}

const content = plugin.withOptions(function (options = {}) {
  return function ({ addComponents, theme }) {
    options.strategy ??= "auto"
    options.gap = getScreenSizes(options.gap ?? theme("container.padding") ?? "1rem")
    options.maxWidth ??= "56.25rem"
    options.content = getMediaScreenSizes(
      options.content ?? theme("screens") ?? defaultScreenSizesObj
    )
    options.popout = getScreenSizes(options.popout ?? "2rem")
    options.feature = getScreenSizes(options.feature ?? "5rem")

    const rules = [
      {
        ".content": Object.assign(
          {
            "--content-max-width":
              options.strategy === "auto" ? options.maxWidth : options.content.DEFAULT.width,
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
