/** @type {import("@divriots/jampack/dist/config-types").Options} */

export default {
  image: {
    compress: true,
    webp: {
      options_lossless: {
        mode: "lossless",
        quality: 75
      }
    },
    svg: {
      optimization: true
    }
  }
}