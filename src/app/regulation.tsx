import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { useCopingCardsStore } from "@/stores/copingCardsStore";
import { CopingCardCategory } from "@/types/coping";
import { useThemeMode } from "@/hooks/useThemeMode";

/**
 * CopingCardsScreen — Central de Cartões de Regulação
 * 
 * Permite navegar por cartões de coping, filtrar por categoria e favoritar.
 */
export default function CopingCardsScreen() {
  const router = useRouter();
  const cards = useCopingCardsStore((state) => state.cards);
  const toggleFavorite = useCopingCardsStore((state) => state.toggleFavorite);
  const { colors } = useThemeMode();
  
  const [selectedCategory, setSelectedCategory] = useState<CopingCardCategory | "all">("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const categories: { key: CopingCardCategory | "all"; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "grounding", label: "Ancoragem" },
    { key: "breathing", label: "Respiração" },
    { key: "custom", label: "Personalizados" },
  ];

  const filteredCards = cards.filter((card) => {
    const categoryMatch = selectedCategory === "all" || card.category === selectedCategory;
    const favoriteMatch = !showFavoritesOnly || card.isFavorite;
    return categoryMatch && favoriteMatch;
  });

  // Ordenar: favoritos primeiro
  const sortedCards = [...filteredCards].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return 0;
  });

  const handleCardPress = (cardId: string) => {
    router.push(`/coping-card/${cardId}`);
  };

  return (
    <SafeAreaView style={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Estratégias de Calma",
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
          style={[
            styles.favoriteFilter,
            showFavoritesOnly && styles.favoriteFilterActive,
          ]}
          onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
        >
          <Text
            style={[
              styles.favoriteFilterText,
              showFavoritesOnly && styles.favoriteFilterTextActive,
            ]}
          >
            {showFavoritesOnly ? "★ Favoritos" : "☆ Favoritos"}
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {sortedCards.length === 0 ? (
          <Text style={styles.emptyText}>
            Nenhum cartão encontrado
          </Text>
        ) : (
          sortedCards.map((card) => (
            <View key={card.id} style={styles.cardContainer}>
              <Pressable
                style={styles.card}
                onPress={() => handleCardPress(card.id)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{card.title}</Text>
                  <Pressable
                    style={styles.favoriteButton}
                    onPress={() => toggleFavorite(card.id)}
                    accessibilityLabel={card.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                  >
                    <Text style={styles.favoriteIcon}>
                      {card.isFavorite ? "★" : "☆"}
                    </Text>
                  </Pressable>
                </View>
                <Text style={styles.cardDescription}>{card.description}</Text>
                <Text style={styles.cardSteps}>
                  {card.steps.length} passos
                </Text>
              </Pressable>
            </View>
          ))
        )}

        {/* Atalho para respiração guiada */}
        <Pressable
          style={styles.breathingShortcut}
          onPress={() => router.push("/breathing-guide")}
        >
          <Text style={styles.breathingShortcutTitle}>
            Exercício de Respiração Guiada
          </Text>
          <Text style={styles.breathingShortcutDescription}>
            Técnicas 4-4-4-4 e 4-7-8 para acalmar
          </Text>
        </Pressable>

        {/* Novo cartão */}
        <Pressable style={styles.newCardButton} onPress={() => router.push("/coping-card/new")}>
          <Text style={styles.newCardButtonText}>+ Novo cartão personalizado</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filters: {
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2F38",
  },
  categoryFilters: {
    flexDirection: "row",
    gap: 8,
  },
  categoryButton: {
    backgroundColor: "#22262E",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3A3F47",
  },
  categoryButtonActive: {
    backgroundColor: "#7B9EA8",
    borderColor: "#7B9EA8",
  },
  categoryButtonText: {
    color: "#B8B5B0",
    fontSize: 14,
  },
  categoryButtonTextActive: {
    color: "#1A1D23",
  },
  favoriteFilter: {
    alignSelf: "flex-start",
    backgroundColor: "#22262E",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3A3F47",
  },
  favoriteFilterActive: {
    backgroundColor: "#C4A882",
    borderColor: "#C4A882",
  },
  favoriteFilterText: {
    color: "#B8B5B0",
    fontSize: 14,
  },
  favoriteFilterTextActive: {
    color: "#1A1D23",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  emptyText: {
    color: "#8A8782",
    fontSize: 16,
    textAlign: "center",
    marginTop: 32,
  },
  cardContainer: {
    marginBottom: 4,
  },
  card: {
    backgroundColor: "#22262E",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#3A3F47",
    gap: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitle: {
    color: "#E8E6E3",
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  favoriteButton: {
    padding: 4,
  },
  favoriteIcon: {
    color: "#C4A882",
    fontSize: 20,
  },
  cardDescription: {
    color: "#B8B5B0",
    fontSize: 14,
    lineHeight: 20,
  },
  cardSteps: {
    color: "#8A8782",
    fontSize: 12,
  },
  breathingShortcut: {
    backgroundColor: "#22262E",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#7B9EA8",
    marginTop: 8,
    gap: 4,
  },
  breathingShortcutTitle: {
    color: "#7B9EA8",
    fontSize: 16,
    fontWeight: "600",
  },
  breathingShortcutDescription: {
    color: "#8A8782",
    fontSize: 14,
  },
  newCardButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#7B9EA8",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  newCardButtonText: {
    color: "#7B9EA8",
    fontSize: 16,
    fontWeight: "600",
  },
});
