const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./index.html', './kitchen-sink.html'],
  theme: {
    extend: {
      //
    },
  },
  plugins: [require('./src')],
}
