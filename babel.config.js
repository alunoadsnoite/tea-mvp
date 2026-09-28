/* eslint-disable no-undef */
const path = require("path");

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      "babel-preset-expo",
    ],
    plugins: [
      // NativeWind 2.0 — deve vir por último
      path.resolve(__dirname, "node_modules/nativewind/babel"),
      // Resolver aliases @/ -> ./src/
      [
        "module-resolver",
        {
          root: ["./src"],
          alias: {
            "@": "./src",
          },
        },
      ],
    ],
  };
};
