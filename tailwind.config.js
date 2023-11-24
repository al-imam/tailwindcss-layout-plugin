module.exports = {
  content: ["./index.html", "./kitchen-sink.html"],
  theme: {
    extend: {
      //
    },
  },
  plugins: [
    require("./src")({
      strategy: "container",
      gap: {
        DEFAULT: "1rem",
        sm: "2rem",
        md: "3rem",
      },
      content: {
        "2xl": { max: "1236px", width: "100px" },
      },
    }),
  ],
}
