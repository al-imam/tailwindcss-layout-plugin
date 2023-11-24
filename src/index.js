const plugin = require("tailwindcss/plugin")

function getMediaQuery({ gap, feature, popout, maxWidth, content, strategy }) {
  const apply = strategy === "container"

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

function sanitizeClassName(_className) {
  return _className.replace(/[^a-z0-9_-]/gi, "")
}

function prefixClassName(_fix, _className) {
  if (!_fix) return `.${sanitizeClassName(_className)}`
  return `.${_fix}-${sanitizeClassName(_className)}`
}

const defaultScreensSize = {
  DEFAULT: { max: "0rem", width: "100%" },
  sm: { max: "640px", width: "640px" },
  md: { max: "768px", width: "768px" },
  lg: { max: "1024px", width: "1024px" },
  xl: { max: "1280px", width: "1280px" },
  "2xl": { max: "1536px", width: "1536px" },
}

function formatScreensValue(_value) {
  return Object.keys(defaultScreensSize).map((key) => ({ [key]: _value }))
}

function formatMediaScreensSize(_value, _screen) {
  if (!_value)
    return { max: defaultScreensSize[_screen].max, width: defaultScreensSize[_screen].width }
  if (typeof _value === "string") return { max: defaultScreensSize[_screen].max, width: _value }
  if (typeof _value === "object" && _value.max && _value.width) {
    return { max: _value.max, width: _value.width }
  }

  throw new Error(`${JSON.stringify(_value)} is not valid screen size value`)
}

function getScreensValue(_value) {
  if (typeof _value === "string") return formatScreensValue(_value)
  if (typeof _value === "object") {
    for (const key in _value) {
      if (typeof _value[key] !== "string") {
        throw new Error(`${JSON.stringify(_value[key])} is not string`)
      }
    }

    const obj = {}

    obj.DEFAULT = _value.DEFAULT ?? "1rem"
    obj.sm = _value.sm ?? obj.DEFAULT
    obj.md = _value.md ?? obj.sm
    obj.lg = _value.lg ?? obj.md
    obj.xl = _value.xl ?? obj.lg
    obj["2xl"] = _value["2xl"] ?? obj.xl

    return obj
  }

  throw new Error(`${JSON.stringify(_value ?? null)} is not valid screen value`)
}

function getMediaScreensSizes(_value) {
  if (typeof _value === "object") {
    for (const key in _value) {
      if (typeof _value[key] !== "string" && !(_value instanceof Object)) {
        throw new Error(`${JSON.stringify(_value[key])} is not valid screen value`)
      }
    }

    const obj = {}

    obj.DEFAULT = formatMediaScreensSize(_value.DEFAULT, "DEFAULT")
    obj.sm = formatMediaScreensSize(_value.sm, "sm")
    obj.md = formatMediaScreensSize(_value.md, "md")
    obj.lg = formatMediaScreensSize(_value.lg, "lg")
    obj.xl = formatMediaScreensSize(_value.xl, "xl")
    obj["2xl"] = formatMediaScreensSize(_value["2xl"], "2xl")

    return obj
  }

  throw new Error(`'${JSON.stringify(_value ?? null)}' is not valid media screen size value`)
}

const content = plugin.withOptions(function (options = {}) {
  return function ({ addComponents, theme }) {
    options.strategy ??= "auto"
    options.gap = getScreensValue(options.gap ?? theme("container.padding") ?? "1rem")
    options.maxWidth ??= "56.25rem"
    options.content = getMediaScreensSizes(
      options.content ?? theme("screens") ?? defaultScreensSize
    )
    options.popout = getScreensValue(options.popout ?? "2rem")
    options.feature = getScreensValue(options.feature ?? "5rem")

    if (options.prefix && /^[a-z][-a-z0-9_]*[0-9a-z]$/i.test(options.prefix) === false) {
      throw new Error(`Invalid prefix '${options.prefix}'. Prefix must be a valid CSS class name.`)
    }

    const classContent = prefixClassName(options.prefix, "content")
    const classPopout = prefixClassName(options.prefix, "content-popout")
    const classFeature = prefixClassName(options.prefix, "content-feature")
    const classFull = prefixClassName(options.prefix, "content-full")
    const classExpand = prefixClassName(options.prefix, "content-expand")

    const notContentClassName = `${classPopout}, ${classFeature}, ${classFull}, ${classExpand}`

    const rules = [
      {
        [classContent]: Object.assign(
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
          getMediaQuery(options)
        ),
      },

      {
        [[
          `${classContent} > :not(${notContentClassName})`,
          `${classFull} > :not(${notContentClassName})`,
        ]]: {
          gridColumn: "content",
        },

        [`${classContent} > ${classPopout}`]: {
          gridColumn: "popout",
        },

        [`${classContent} > ${classFeature}`]: {
          gridColumn: "feature",
        },

        [`${classContent} > ${classFull}`]: {
          gridColumn: "full",
          columnGap: "0 !important",
          display: "grid",
          gridTemplateColumns: "inherit",
        },

        [`${classContent} > ${classExpand}`]: {
          gridColumn: "full",
        },
      },
    ]

    addComponents(rules)
  }
})

module.exports = content
