const plugin = require("tailwindcss/plugin")

/**
 * @param {Array<{ key: string, screen: any, gap: any, feature: any, popout: any, content: any }>} store
 * @returns {{
 *    [x: string]: {
 *        "--padding-inline": string;
 *        "--popout-extra-width": string;
 *        "--feature-extra-width": string;
 *        "--content-max-width": string;
 *    };
 * }}
 */
function getMediaQuery(store) {
  return store
    .map(({ screen, gap, feature, popout, content }) => {
      return {
        [`@media (min-width: ${screen})`]: {
          "--padding-inline": gap,
          "--popout-extra-width": feature,
          "--feature-extra-width": popout,
          "--content-max-width": content,
        },
      }
    })
    .reduce((acc, curr) => {
      return Object.assign(acc, curr)
    }, {})
}

/**
 * @param {string} _className
 * @returns {string}
 */
function sanitizeClassName(_className) {
  return _className.replace(/[^a-z0-9_-]/gi, "")
}

/**
 * @param {string} _className
 * @returns {string}
 */
function prefixClassName(_fix, _className) {
  if (!_fix) return `.${sanitizeClassName(_className)}`
  return `.${_fix}-${sanitizeClassName(_className)}`
}

const defaultScreensSize = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
}

const defaultScreens = Object.keys(defaultScreensSize)

const defaultContentSizes = {
  DEFAULT: "100%",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
}

/**
 * @param {string} _value
 * @returns {{ DEFAULT: string, sm: string, md: string, lg: string, xl: string, "2xl": string }}
 */
function getDefaults(_value) {
  return { DEFAULT: _value, sm: _value, md: _value, lg: _value, xl: _value, "2xl": _value }
}

/**
 * @param {string | Object | undefined} _value
 * @param {string | Object | undefined} _default
 * @returns {{ DEFAULT: string, sm: string, md: string, lg: string, xl: string, "2xl": string }}
 */
function getScreensValue(_value, _default) {
  if (typeof _value === "string") return getDefaults(_value)
  if (!_value && typeof _default === "string") return getDefaults(_default)

  const value = Object.assign({}, _default, _value)

  for (const key in value) {
    if (typeof value[key] !== "string") {
      throw new Error(`${JSON.stringify(value[key])} is not valid screen value`)
    }
  }

  const computed = {}

  computed.DEFAULT = value.DEFAULT ?? "1rem"
  computed.sm = value.sm ?? computed.DEFAULT
  computed.md = value.md ?? computed.sm
  computed.lg = value.lg ?? computed.md
  computed.xl = value.xl ?? computed.lg
  computed["2xl"] = computed["2xl"] ?? computed.xl

  return computed
}

/**
 * @param {Object} _value
 * @param {Object} _default
 *
 * @returns {{ sm: string, md: string, lg: string, xl: string, "2xl": string }}
 */
function getMediaScreensSizes(_value, _default) {
  if (!_value) return Object.assign(defaultScreensSize, _default)
  if (typeof _value !== "object") throw new Error("Invalid screen value")
  return Object.assign(defaultScreensSize, _value)
}

const tailContent = plugin.withOptions(function (options = {}) {
  return function ({ addComponents, theme }) {
    const screen = getMediaScreensSizes(options.screens, theme("screens"))
    const content = getScreensValue(options.content, defaultContentSizes)
    const feature = getScreensValue(options.feature, "5rem")
    const popout = getScreensValue(options.popout, "2rem")
    const gap = getScreensValue(options.gap, theme("container.padding") ?? "1rem")

    const store = []

    for (const key in screen) {
      store.push({
        key: key,
        screen: screen[key],
        gap: gap[key],
        feature: feature[key],
        popout: popout[key],
        content: content[key],
      })
    }

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
            "--content-max-width": content.DEFAULT,
            "--padding-inline": gap.DEFAULT,
            "--popout-extra-width": popout.DEFAULT,
            "--feature-extra-width": feature.DEFAULT,

            "--gap": "var(--padding-inline, 1rem)",
            "--full": "minmax(var(--gap), 1fr)",
            "--content": "min(var(--content-max-width, 70ch), 100% - var(--gap) * 2)",
            "--popout": "minmax(0, var(--popout-extra-width, 2rem))",
            "--feature": "minmax(0, var(--feature-extra-width, 5rem))",

            display: "grid",
            columnGap: "0 !important",
            gridAutoRows: "max-content",
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
          getMediaQuery(store.filter(({ key }) => defaultScreens.includes(key)))
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

module.exports = tailContent
