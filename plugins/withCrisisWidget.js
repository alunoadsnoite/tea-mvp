#!/usr/bin/env node
/**
 * Config plugin local — Widget de acesso rápido ao Cartão de Crise (Android).
 *
 * O projeto usa managed workflow e `android/` está no `.gitignore`, então o
 * widget não pode viver diretamente na pasta nativa: ela seria apagada no
 * próximo `expo prebuild`. Os arquivos-fonte ficam versionados em
 * `widget/android/` e este plugin os copia para o projeto gerado.
 *
 * O que é injetado:
 * - `android/app/src/main/java/<pkg>/CrisisWidgetProvider.kt`
 * - `android/app/src/main/res/layout/crisis_widget.xml`
 * - `android/app/src/main/res/drawable/crisis_widget_background.xml`
 * - `android/app/src/main/res/xml/crisis_widget_info.xml`
 * - `android/app/src/main/res/values/crisis_widget.xml` (cores do tema)
 * - `<receiver>` do AppWidgetProvider no AndroidManifest
 *
 * O widget é acessória: se o prebuild falhar, o app e o Cartão de Crise
 * continuam funcionando sem ele.
 */

const fs = require("fs");
const path = require("path");
const { withAndroidManifest, withDangerousMod } = require("@expo/config-plugins");

const SOURCE_DIR = path.join(__dirname, "..", "widget", "android");

const RES_FILES = [
  ["res/layout/crisis_widget.xml", "crisis_widget.xml"],
  ["res/drawable/crisis_widget_background.xml", "crisis_widget_background.xml"],
  ["res/xml/crisis_widget_info.xml", "crisis_widget_info.xml"],
  ["res/values/crisis_widget.xml", "crisis_widget.xml"],
];

/** Lê o pacote real do projeto nativo para não duplicar o applicationId. */
function readPackageName(projectRoot) {
  const manifestPath = path.join(
    projectRoot,
    "android/app/src/main/AndroidManifest.xml"
  );
  const manifest = fs.readFileSync(manifestPath, "utf8");
  const match = manifest.match(/<manifest[^>]*\spackage="([^"]+)"/);
  return match ? match[1] : "com.teamvp.app";
}

function copyWidgetSources(projectRoot) {
  const packageName = readPackageName(projectRoot);
  const resDir = path.join(projectRoot, "android/app/src/main");
  const javaDir = path.join(resDir, "java", ...packageName.split("."));

  fs.mkdirSync(javaDir, { recursive: true });
  fs.copyFileSync(
    path.join(SOURCE_DIR, "CrisisWidgetProvider.kt"),
    path.join(javaDir, "CrisisWidgetProvider.kt")
  );

  for (const [relative, fileName] of RES_FILES) {
    const target = path.join(resDir, ...relative.split("/"));
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(SOURCE_DIR, fileName), target);
  }

  return packageName;
}

const withCrisisWidget = (config) => {
  config = withAndroidManifest(config, (cfg) => {
    const packageName = cfg.android?.package ?? "com.teamvp.app";
    const provider = `${packageName}.CrisisWidgetProvider`;

    const receiverName = `.${provider.split(".").pop()}`;
    const application = cfg.modResults.manifest.application?.[0];

    // Não duplica o receiver se o prebuild rodar mais de uma vez.
    const alreadyRegistered = application?.receiver?.some(
      (r) => r.$?.["android:name"] === receiverName
    );
    if (alreadyRegistered) return cfg;

    if (!application) {
      throw new Error("withCrisisWidget: elemento <application> não encontrado no manifest.");
    }

    application.receiver = [
      ...(application.receiver ?? []),
      {
        $: {
          "android:name": receiverName,
          "android:exported": "true",
          "android:label": "TEA Autonomia",
        },
        "intent-filter": [
          {
            action: [
              { $: { "android:name": "android.appwidget.action.APPWIDGET_UPDATE" } },
            ],
          },
        ],
        "meta-data": [
          {
            $: {
              "android:name": "android.appwidget.provider",
              "android:resource": "@xml/crisis_widget_info",
            },
          },
        ],
      },
    ];

    return cfg;
  });

  config = withDangerousMod(config, [
    "android",
    (cfg) => {
      copyWidgetSources(cfg.modRequest.projectRoot);
      return cfg;
    },
  ]);

  return config;
};

module.exports = withCrisisWidget;
