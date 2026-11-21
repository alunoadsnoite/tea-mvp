module.exports = ({ config }) => {
  if (process.env.TEA_EDITION !== "pro") return config;

  return {
    ...config,
    name: "TEA Passos",
    version: "1.0.20",
    icon: "./assets/passos-icon.png",
    splash: { ...config.splash, image: "./assets/passos-icon.png" },
    scheme: "tea-autonomia-pro",
    android: {
      ...config.android,
      package: "com.teamvp.app.pro",
      versionCode: 20,
      adaptiveIcon: {
        ...config.android.adaptiveIcon,
        foregroundImage: "./assets/passos-icon.png",
      },
    },
    ios: { ...config.ios, bundleIdentifier: "com.teamvp.app.pro", icon: "./assets/passos-icon.png" },
    extra: { router: config.extra.router, edition: "pro" },
  };
};
