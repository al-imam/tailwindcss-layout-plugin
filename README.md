# tailwind-layout

This Tailwind CSS layout plugin provides an alternative to the standard container and offers increased flexibility in defining layout strategies.

## Installation

Install the plugin from npm:

```sh

npm install -D tailwind-layout
yarn add -D tailwind-layout
pnpm add -D tailwind-layout

```

Then add the plugin to your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  theme: {
    // ...
  },
  plugins: [
    require("tailwind-layout"),
    // ...
  ],
}
```

## Basic usage

[**View the live demo**](https://tailwind-layout.vercel.app/)

Initiate tailwindcss-layout

```js
module.exports = {
  // other options

  plugins: [
    require("tailwind-layout")({
      strategy: "container",
      gap: {
        DEFAULT: "1rem",
        sm: "2rem",
        md: "3rem",
      },
      content: {
        "2xl": { max: "1440px", width: "1440px" },
      },
    }),
  ],
}
```

Apply generated classes in markup

```html
<main class="content">
  <div class="content-full"></div>
  <div class="content-expand"></div>
  <div class="content-feature"></div>
  <div class="content-popout"></div>
</main>
```

Here's an explanation for each class used in the provided HTML:

- `content` The main container class that encapsulates various layout elements. It serves as the overarching container for the entire layout structure.

- `content-full` This class defines a content element that takes up the full width of its parent container but it's children's will maintain the layout. It is useful for components or sections that should span the entire width of the layout to change background appearance.

- `content-expand` This class defines a content element as `content-full` but children's will not maintain any layout they are completely unstyled.

- `content-popout` This class defines a content element that takes up `content-width` and additional popout value default is `2rem`.

- `content-feature` This class defines a content element that takes up `content-width` and `popout` and additional feature value default is `5rem`.

## Options

### strategy

Specifies the layout strategy to be used.

- Type: `"container"` | `"auto"`
- Default: `"auto"`

### content

This setting defines the layout for the content area. The provided value will only be applied if the strategy is set to `container`. Otherwise, it will exclusively work for `screen` size specifications. Additionally, it automatically defaults to `theme("screens")`, and your configuration will override this default.

- Type: `ScreensMedia`
  - `DEFAULT`: Default screen size for content.
  - `sm`, `md`, `lg`, `xl`, `2xl`: Responsive screen sizes for content.
  - `sm: { max: CSSValue; width: CSSValue } | CSSValue`: Directly set a custom size using a CSS value.

### popout

This sets up the layout for `popout` elements. The given value will be added to the `content` width to determine the final value.

- Type: `Screens | CSSValue`
  - `DEFAULT`: Default size for popout.
  - `sm`, `md`, `lg`, `xl`, `2xl`: Responsive sizes for popout.
  - `CSSValue`: Directly set a custom size using a CSS value.

### feature

This sets up the layout for `feature` elements. The given value will be added to the `content` width and previous `popout` value to determine the final value.

- Type: `Screens | CSSValue`
  - `DEFAULT`: Default size for featured elements.
  - `sm`, `md`, `lg`, `xl`, `2xl`: Responsive sizes for featured elements.
  - `CSSValue`: Directly set a custom size using a CSS value.

### gap

Specifies the `padding-inline` value `gap` will not apply to `content-expand`.

- Type: `Screens | CSSValue`
  - `DEFAULT`: Default gap size.
  - `sm`, `md`, `lg`, `xl`, `2xl`: Responsive gap sizes.
  - `CSSValue`: Directly set a custom gap size using a CSS value.

### maxWidth

Sets the maximum width for the layout. **Note - `maxWidth` only work with `strategy: "auto"`**

- Type: `CSSValue`
- Default: `"900px"`

### prefix

The prefix option allows you to append a prefix to all generated class names. This feature proves beneficial when you need multiple instances of the tailwindcss-layout with different configurations.

- Type: `string`
- Default: `""`

---

**Contributions Welcome!**

Thank you for considering contributing to the project! If you have ideas, improvements, or bug fixes, feel free to open an issue or submit a pull request. I appreciate your support in making this project better for everyone.
