const { withGradleProperties } = require("@expo/config-plugins");

// Persist release optimization whenever Expo regenerates the Android project.
module.exports = function withReleaseOptimization(config) {
  return withGradleProperties(config, (cfg) => {
    const properties = {
      "android.enableProguardInReleaseBuilds": "true",
      "android.enableShrinkResourcesInReleaseBuilds": "true",
    };
    cfg.modResults = cfg.modResults.filter(
      (entry) => entry.type !== "property" || !(entry.key in properties)
    );
    for (const [key, value] of Object.entries(properties)) {
      cfg.modResults.push({ type: "property", key, value });
    }
    return cfg;
  });
};
