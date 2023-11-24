module.exports = {
  content: ["./index.html", "./kitchen-sink.html"],
  theme: {
    extend: {
      //
    },
  },
  plugins: [
    require("./src")({
      strategy: "auto",
      gap: {
        DEFAULT: "1rem",
        sm: "2rem",
        md: "3rem",
      },
    }),
  ],
}
