package com.teamvp.app

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews

/**
 * Widget de acesso rápido ao Cartão de Crise.
 *
 * Um toque abre o app direto na rota `/crisis-card`, sem passar pela Home.
 * O widget é estático de propósito: em momento de sobrecarga ele precisa ser um
 * alvo previsível, sem lista, sem rolagem e sem conteúdo que mude sozinho.
 *
 * Nenhum dado sensível é exposto aqui — só o título e a instrução de toque.
 * Os textos e as cores vivem no layout e em `res/values/crisis_widget.xml`.
 *
 * Os recursos são resolvidos por nome em vez de por `R.layout`/`R.id`: o AGP 8
 * usa `nonFinalResIds` por padrão e os campos gerados em `R` não são
 * garantidos para recursos injetados por config plugin.
 */
class CrisisWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            appWidgetManager.updateAppWidget(appWidgetId, buildRemoteViews(context, appWidgetId))
        }
    }

    private fun buildRemoteViews(context: Context, appWidgetId: Int): RemoteViews {
        val views = RemoteViews(
            context.packageName,
            context.resources.getIdentifier(LAYOUT_NAME, "layout", context.packageName)
        )

        val rootId = context.resources.getIdentifier(ROOT_ID_NAME, "id", context.packageName)
        views.setOnClickPendingIntent(rootId, openCrisisCardIntent(context, appWidgetId))

        return views
    }

    /**
     * Deep link `tea://crisis-card`, resolvido pelo Expo Router para a rota
     * `/crisis-card`. `setPackage` mantém o PendingIntent dentro do próprio app,
     * sem depender de outra activity responder pelo scheme.
     */
    private fun openCrisisCardIntent(context: Context, appWidgetId: Int): PendingIntent {
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(DEEP_LINK)).apply {
            setPackage(context.packageName)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
        }

        // FLAG_IMMUTABLE é obrigatório a partir do Android 12 (API 31).
        return PendingIntent.getActivity(
            context,
            appWidgetId,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
    }

    private companion object {
        const val DEEP_LINK = "tea://crisis-card"
        const val LAYOUT_NAME = "crisis_widget"
        const val ROOT_ID_NAME = "crisis_widget_root"
    }
}
