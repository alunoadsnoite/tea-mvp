const fs = require("node:fs/promises");
const path = require("node:path");
const { AndroidConfig, withAndroidManifest, withDangerousMod } = require("@expo/config-plugins");

const rulesName = "tea_data_extraction_rules";
const privateDomains = [
  "root", "file", "database", "sharedpref", "external",
];
const exclusions = privateDomains.map((domain) =>
  `    <exclude domain="${domain}" path="." />`
).join("\n");

module.exports = function withAndroidPrivacy(config) {
  config = withAndroidManifest(config, (config) => {
    const application = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);
    application.$["android:dataExtractionRules"] = `@xml/${rulesName}`;
    return config;
  });

  return withDangerousMod(config, ["android", async (config) => {
    const folder = path.join(config.modRequest.platformProjectRoot, "app/src/main/res/xml");
    await fs.mkdir(folder, { recursive: true });
    await fs.writeFile(path.join(folder, `${rulesName}.xml`), `<?xml version="1.0" encoding="utf-8"?>
<data-extraction-rules>
  <cloud-backup>
${exclusions}
  </cloud-backup>
  <device-transfer>
${exclusions}
  </device-transfer>
</data-extraction-rules>
`);
    return config;
  }]);
};
