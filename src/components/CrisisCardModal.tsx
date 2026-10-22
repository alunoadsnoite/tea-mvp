import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Linking,
} from "react-native";
import { Link } from "expo-router";
import { useCrisisStore } from "@/stores/crisisStore";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import { useThemeMode } from "@/hooks/useThemeMode";
import { useFontScale } from "@/hooks/useFontScale";
import { ThemeColors } from "@/constants/theme";

interface ScrollViewEvent {
  nativeEvent: {
    contentOffset: { x: number };
  };
}

/**
 * CrisisCardModal — Cartão de Comunicação de Crise
 *
 * Características:
 * - Modo cheio e alto contraste (texto grande, fundo escuro)
 * - Texto centralizado na tela para fácil leitura
 * - Reage automaticamente à rotação do celular
 * - Navegação por gestos simples (swipe horizontal para alternar mensagens)
 * - Acesso ao contato de emergência primário
 * - Sem elementos piscando ou animações complexas
 */
export function CrisisCardModal() {
  const { messages: allMessages, contacts, activeMessageId, setActiveMessage, primaryContactId } =
    useCrisisStore();
  const messages = useMemo(() => allMessages.filter((message) => !message.hidden), [allMessages]);
  const { colors } = useThemeMode();
  const selectedIndex = messages.findIndex((message) => message.id === activeMessageId);
  const currentIndex = Math.max(0, selectedIndex);

  const scrollViewRef = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();
  const [viewportWidth, setViewportWidth] = useState(width);
  const { trigger } = useHapticFeedback();
  const { fontSize } = useFontScale();
  const styles = useMemo(() => createStyles(colors, fontSize), [colors, fontSize]);
  const [actionError, setActionError] = useState<string | null>(null);

  // Contato exibido e acionado: o primário quando definido, senão o primeiro.
  const emergencyContact = useMemo(
    () => contacts.find((c) => c.id === primaryContactId) ?? contacts[0],
    [contacts, primaryContactId]
  );

  // Protege contra uma lista de mensagens encurtada enquanto a tela está aberta.
  const safeIndex = Math.min(currentIndex, Math.max(0, messages.length - 1));
  const currentMessage = messages[safeIndex];

  // Navegação por gesto (swipe horizontal)
  const handleScroll = (event: ScrollViewEvent) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / viewportWidth);
    if (index !== safeIndex && index >= 0 && index < messages.length) {
      setActiveMessage(messages[index].id);
    }
  };

  // Mantém o scroll na página correta quando o viewport muda (montagem e rotação).
  useEffect(() => {
    const node = scrollViewRef.current;
    if (!node || viewportWidth === 0 || messages.length === 0) return;
    const index = Math.min(
      currentIndex,
      Math.max(0, messages.length - 1)
    );
    node.scrollTo({ x: index * viewportWidth, animated: false });
  }, [currentIndex, messages.length, node, viewportWidth]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nenhuma mensagem</Text>
            <Text style={styles.emptyDescription}>
              Não há mensagens disponíveis no momento.
            </Text>
          </View>
        ) : (
          messages.map((message, index) => (
            <View key={message.id} style={styles.messageContainer}>
              <Text style={styles.messageTitle}>{message.title}</Text>
              <View style={styles.messageContentWrapper}>
                <Text style={styles.messageContent}>{message.text}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ThemeColors, fontSize: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingVertical: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyState: { gap: 16 },
    messageContainer: {
      flexGrow: 1,
      paddingVertical: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    messageContentWrapper: {
      justifyContent: "center",
      alignItems: "flex-start",
      width: "100%",
      maxWidth: 560,
      paddingHorizontal: 8,
    },
    messageTitle: {
      color: colors.accent,
      fontSize: fontSize(36),
    },
    messageContent: {
      color: colors.text,
      fontSize: fontSize(16),
      lineHeight: fontSize(22),
    },
  });
