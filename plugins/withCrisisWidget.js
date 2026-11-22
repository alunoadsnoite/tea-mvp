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

// Os nomes de origem são distintos de propósito: layout e values só podem ter
// o mesmo nome no destino, e nomes iguais na origem faziam a cópia de values
// sobrescrever a de layout.
const RES_FILES = [
  ["res/layout/crisis_widget.xml", "crisis_widget_layout.xml"],
  ["res/drawable/crisis_widget_background.xml", "crisis_widget_background.xml"],
  ["res/xml/crisis_widget_info.xml", "crisis_widget_info.xml"],
  ["res/values/crisis_widget.xml", "crisis_widget_values.xml"],
  ["res/values-en/crisis_widget.xml", "crisis_widget_values_en.xml"],
  ["res/values-es/crisis_widget.xml", "crisis_widget_values_es.xml"],
  ["res/values-fr/crisis_widget.xml", "crisis_widget_values_fr.xml"],
];

function copyWidgetSources(projectRoot, packageName, scheme) {
  const resDir = path.join(projectRoot, "android/app/src/main");
  const javaDir = path.join(resDir, "java", ...packageName.split("."));

  fs.mkdirSync(javaDir, { recursive: true });
  const provider = fs.readFileSync(path.join(SOURCE_DIR, "CrisisWidgetProvider.kt"), "utf8");
  fs.writeFileSync(
    path.join(javaDir, "CrisisWidgetProvider.kt"),
    provider.replace("package com.teamvp.app", `package ${packageName}`)
      .replace("tea://crisis-card", `${scheme}://crisis-card`)
  );

  for (const [relative, fileName] of RES_FILES) {
    const target = path.join(resDir, ...relative.split("/"));
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(SOURCE_DIR, fileName), target);
  }

}

const withCrisisWidget = (config) => {
  const packageName = config.android.package;
  const scheme = config.scheme;
  const receiverName = ".CrisisWidgetProvider";

  config = withAndroidManifest(config, (cfg) => {
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
          "android:label": "@string/app_name",
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
      copyWidgetSources(cfg.modRequest.projectRoot, packageName, scheme);
      return cfg;
    },
  ]);

  return config;
};

module.exports = withCrisisWidget;
