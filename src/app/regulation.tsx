import { localizeCopingCard } from "@/lib/localizedContent";
import { useTranslation } from "@/hooks/useTranslation";
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { useCopingCardsStore } from "@/stores/copingCardsStore";
import { CopingCardCategory } from "@/types/coping";
import { useFontScale } from "@/hooks/useFontScale";
import { useThemeMode } from "@/hooks/useThemeMode";
import { ThemeColors } from "@/constants/theme";

/**
 * CopingCardsScreen — Central de Cartões de Regulação
 *
 * Permite navegar por cartões de coping, filtrar por categoria e favoritar.
 */
export default function CopingCardsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { fontSize } = useFontScale();
  const { colors } = useThemeMode();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const cards = useCopingCardsStore((state) => state.cards);
  const toggleFavorite = useCopingCardsStore((state) => state.toggleFavorite);
  const deleteCard = useCopingCardsStore((state) => state.deleteCard);
  const resetToDefaults = useCopingCardsStore((state) => state.resetToDefaults);

  const [selectedCategory, setSelectedCategory] = useState<CopingCardCategory | "all">("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const categories: { key: CopingCardCategory | "all"; label: string }[] = [
    { key: "all", label: t("Todos") },
    { key: "grounding", label: t("Ancoragem") },
    { key: "breathing", label: t("Respiração") },
    { key: "custom", label: t("Personalizados") },
  ];

  const filteredCards = useMemo(() => {
    const matches = cards.filter((card) => {
      const categoryMatch = selectedCategory === "all" || card.category === selectedCategory;
      const favoriteMatch = !showFavoritesOnly || card.isFavorite;
      return categoryMatch && favoriteMatch;
    });

    // Ordenar: favoritos primeiro
    return [...matches].sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return 0;
    });
  }, [cards, selectedCategory, showFavoritesOnly]);

  const handleDeleteCard = (id: string, title: string) => {
    Alert.alert(
      t("Excluir cartão"),
      t("O cartão \"{0}\" será removido. Deseja continuar?", title),
      [
        { text: t("Cancelar"), style: "cancel" },
        { text: t("Excluir"), style: "destructive", onPress: () => deleteCard(id) },
      ]
    );
  };

  const handleReset = () => {
    Alert.alert(
      t("Restaurar padrões"),
      t("Isso irá remover os cartões personalizados e restaurar os cartões padrão. Seus favoritos são mantidos. Deseja continuar?"),
      [
        { text: t("Cancelar"), style: "cancel" },
        { text: t("Restaurar"), style: "destructive", onPress: resetToDefaults },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: t("Estratégias de Calma"),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />

      <View style={styles.filters}>
        {/* Filtro de categoria */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categoryFilters}>
            {categories.map((cat) => (
              <Pressable
                key={cat.key}
                style={[
                  styles.categoryButton,
                  selectedCategory === cat.key && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(cat.key)}
                accessibilityRole="radio"
                accessibilityLabel={cat.label}
                accessibilityState={{ selected: selectedCategory === cat.key }}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === cat.key && styles.categoryButtonTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* Filtro de favoritos */}
        <Pressable
          style={[styles.favoriteFilter, showFavoritesOnly && styles.favoriteFilterActive]}
          onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
          accessibilityRole="checkbox"
          accessibilityLabel={t("Mostrar apenas favoritos")}
          accessibilityState={{ checked: showFavoritesOnly }}
        >
          <Text
            style={[
              styles.favoriteFilterText,
              showFavoritesOnly && styles.favoriteFilterTextActive,
            ]}
          >
            {showFavoritesOnly ? t("★ Favoritos") : t("☆ Favoritos")}
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {filteredCards.length === 0 ? (
          <Text style={[styles.emptyText, { fontSize: fontSize(16) }]}>{t("Nenhum cartão encontrado")}</Text>
        ) : (
          filteredCards.map((card) => localizeCopingCard(card, t)).map((card) => (
            <View key={card.id} style={styles.card}>
              <View style={styles.cardHeader}>
                {/* A área textual é o alvo de navegação; o favorito é irmão,
                    não filho, para evitar Pressable aninhado (toque ambíguo
                    no Android). */}
                <Pressable
                  style={styles.cardPressable}
                  onPress={() => router.push(`/coping-card/${card.id}`)}
                  accessibilityRole="button"
                  accessibilityLabel={card.title}
                  accessibilityHint={t(card.steps.length === 1 ? "Abre o cartão com {0} passo" : "Abre o cartão com {0} passos", card.steps.length)}
                >
                  <Text style={[styles.cardTitle, { fontSize: fontSize(18) }]}>{card.title}</Text>
                  <Text style={[styles.cardDescription, { fontSize: fontSize(14) }]}>
                    {card.description}
                  </Text>
                  <Text style={[styles.cardSteps, { fontSize: fontSize(12) }]}>{t(card.steps.length === 1 ? "{0} passo" : "{0} passos", card.steps.length)}</Text>
                </Pressable>

                <Pressable
                  style={styles.favoriteButton}
                  onPress={() => toggleFavorite(card.id)}
                  accessibilityRole="checkbox"
                  accessibilityLabel={`${card.title}: ${card.isFavorite ? t("remover dos favoritos") : t("adicionar aos favoritos")}`}
                  accessibilityState={{ checked: card.isFavorite }}
                >
                  <Text style={styles.favoriteIcon}>{card.isFavorite ? "★" : "☆"}</Text>
                </Pressable>
              </View>

              {!card.isDefault && (
                <View style={styles.manageRow}>
                  <Pressable
                    style={styles.manageButton}
                    onPress={() => router.push(`/coping-card/new?id=${card.id}`)}
                    accessibilityRole="button"
                    accessibilityLabel={t("Editar cartão {0}", card.title)}
                  >
                    <Text style={[styles.manageButtonText, { fontSize: fontSize(14) }]}>{t("Editar")}</Text>
                  </Pressable>
                  <Pressable
                    style={styles.manageButton}
                    onPress={() => handleDeleteCard(card.id, card.title)}
                    accessibilityRole="button"
                    accessibilityLabel={t("Excluir cartão {0}", card.title)}
                  >
                    <Text style={[styles.manageButtonTextDelete, { fontSize: fontSize(14) }]}>{t("Excluir")}</Text>
                  </Pressable>
                </View>
              )}
            </View>
          ))
        )}

        {/* Atalho para respiração guiada */}
        <Pressable
          style={styles.breathingShortcut}
          onPress={() => router.push("/breathing-guide")}
          accessibilityRole="button"
          accessibilityLabel={t("Exercício de Respiração Guiada")}
          accessibilityHint={t("Abre as técnicas de respiração 4-4-4-4 e 4-7-8")}
        >
          <Text style={[styles.breathingShortcutTitle, { fontSize: fontSize(16) }]}>{t("Exercício de Respiração Guiada")}</Text>
          <Text style={[styles.breathingShortcutDescription, { fontSize: fontSize(14) }]}>{t("Técnicas 4-4-4-4 e 4-7-8 para acalmar")}</Text>
        </Pressable>

        {/* Novo cartão */}
        <Pressable
          style={styles.newCardButton}
          onPress={() => router.push("/coping-card/new")}
          accessibilityRole="button"
          accessibilityLabel={t("Criar novo cartão personalizado")}
        >
          <Text style={[styles.newCardButtonText, { fontSize: fontSize(16) }]}>{t("+ Novo cartão personalizado")}</Text>
        </Pressable>

        {/* Reset */}
        <Pressable
          style={styles.resetButton}
          onPress={handleReset}
          accessibilityRole="button"
          accessibilityLabel={t("Restaurar cartões padrão")}
          accessibilityHint={t("Remove cartões personalizados e volta aos cartões padrão, mantendo favoritos")}
        >
          <Text style={[styles.resetButtonText, { fontSize: fontSize(16) }]}>{t("Restaurar padrões")}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    filters: {
      padding: 16,
      gap: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderSubtle,
    },
    categoryFilters: {
      flexDirection: "row",
      gap: 8,
    },
    categoryButton: {
      backgroundColor: colors.surface,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    categoryButtonActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    categoryButtonText: {
      color: colors.textSecondary,
    },
    categoryButtonTextActive: {
      color: colors.accentText,
    },
    favoriteFilter: {
      alignSelf: "flex-start",
      backgroundColor: colors.surface,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    favoriteFilterActive: {
      backgroundColor: colors.warm,
      borderColor: colors.warm,
    },
    favoriteFilterText: {
      color: colors.textSecondary,
    },
    favoriteFilterTextActive: {
      color: colors.accentText,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 16,
      gap: 12,
      paddingBottom: 80, // Espaço para o EmergencyFab
    },
    emptyText: {
      color: colors.textMuted,
      textAlign: "center",
      marginTop: 32,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 8,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
    },
    cardPressable: {
      flex: 1,
      gap: 8,
    },
    cardTitle: {
      color: colors.text,
      fontWeight: "600",
    },
    favoriteButton: {
      padding: 8,
    },
    favoriteIcon: {
      color: colors.warm,
      fontSize: 20,
    },
    cardDescription: {
      color: colors.textSecondary,
      lineHeight: 20,
    },
    cardSteps: {
      color: colors.textMuted,
    },
    manageRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 16,
      marginTop: 4,
    },
    manageButton: {
      paddingVertical: 8,
      paddingHorizontal: 8,
    },
    manageButtonText: {
      color: colors.accent,
    },
    manageButtonTextDelete: {
      color: colors.warm,
    },
    breathingShortcut: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.accent,
      marginTop: 8,
      gap: 4,
    },
    breathingShortcutTitle: {
      color: colors.accent,
      fontWeight: "600",
    },
    breathingShortcutDescription: {
      color: colors.textMuted,
    },
    newCardButton: {
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: colors.accent,
      borderRadius: 8,
      paddingVertical: 14,
      alignItems: "center",
      marginTop: 8,
    },
    newCardButtonText: {
      color: colors.accent,
      fontWeight: "600",
    },
    resetButton: {
      backgroundColor: "transparent",
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.warm,
      marginTop: 8,
    },
    resetButtonText: {
      color: colors.warm,
    },
  });