module.exports = ({ config }) => {
  if (process.env.TEA_EDITION !== "pro") return config;

  return {
    ...config,
    name: "TEA Passos",
    scheme: "tea-autonomia-pro",
    android: { ...config.android, package: "com.teamvp.app.pro" },
    ios: { ...config.ios, bundleIdentifier: "com.teamvp.app.pro" },
    extra: { router: config.extra.router, edition: "pro" },
  };
};
