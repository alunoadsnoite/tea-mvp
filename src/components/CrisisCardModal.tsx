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
    contentOffset: {
      x: number;
    };
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
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (!activeMessageId || messages.length === 0) return 0;
    const index = messages.findIndex((m) => m.id === activeMessageId);
    return index >= 0 ? index : 0;
  });

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
      setCurrentIndex(index);
      setActiveMessage(messages[index].id);
    }
  };

  // Sincroniza o índice com a mensagem ativa persistida (reabertura da tela).
  useEffect(() => {
    if (!activeMessageId || messages.length === 0) return;
    const index = messages.findIndex((m) => m.id === activeMessageId);
    if (index >= 0) {
      setCurrentIndex((prev) => (prev === index ? prev : index));
    }
  }, [activeMessageId, messages]);

  // Mantém o scroll na página correta quando o viewport muda (montagem e rotação).
  useEffect(() => {
    const node = scrollViewRef.current;
    if (!node || viewportWidth === 0 || messages.length === 0) return;
    const index = Math.min(
      currentIndex,
      Math.max(0, messages.length - 1)
    );
    node.scrollTo({ x: index * viewportWidth, animated: false });
    // Também acompanha a hidratação da mensagem ativa na abertura fria.
  }, [viewportWidth, messages.length, currentIndex]);

  const openEmergencyLink = async (url: string, action: string) => {
    setActionError(null);
    try {
      await Linking.openURL(url);
    } catch {
      setActionError(
        `Não foi possível abrir ${action}. Verifique se há um aplicativo disponível.`
      );
    }
  };

  // Ligar para contato de emergência
  const handleEmergencyCall = () => {
    if (emergencyContact?.phone) {
      trigger("success");
      void openEmergencyLink(`tel:${emergencyContact.phone}`, "o telefone");
    }
  };

  // Enviar mensagem para contato de emergência
  const handleEmergencyMessage = () => {
    if (emergencyContact?.phone) {
      trigger("light");
      const message = encodeURIComponent(currentMessage?.content || "");
      void openEmergencyLink(
        `sms:${emergencyContact.phone}?body=${message}`,
        "o aplicativo de mensagens"
      );
    }
  };


  return (
    <ScrollView style={styles.outerScroll} contentContainerStyle={styles.container}>
      {!currentMessage && (
        <View style={styles.emptyState}>
          <Text style={styles.pageIndicatorText}>Nenhuma mensagem visível. Escolha uma mensagem nas configurações. Os contatos cadastrados aparecem abaixo.</Text>
          <Link href="/crisis-settings" asChild>
            <Pressable style={styles.emergencyButtonSecondary} accessibilityRole="button" accessibilityLabel="Escolher mensagens do cartão">
              <Text style={styles.emergencyButtonSecondaryText}>Escolher mensagens</Text>
            </Pressable>
          </Link>
        </View>
      )}
      {/* Indicador de página sutil */}
      {messages.length > 1 && (
        <View style={styles.pageIndicator}>
          <Text style={styles.pageIndicatorText}>
            {safeIndex + 1} / {messages.length}
          </Text>
        </View>
      )}

      {/* Instrução de navegação sutil */}
      {messages.length > 1 && (
        <Text style={styles.swipeHint}>
          Deslize para ver mais mensagens
        </Text>
      )}

      {/* Mensagens com navegação por gesto */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        onLayout={(event) => setViewportWidth(event.nativeEvent.layout.width)}
      >
        {messages.map((message) => (
          <View key={message.id} style={[styles.messageContainer, { width: viewportWidth }]}>
            <View style={styles.messageContentWrapper}>
              <Text style={styles.messageTitle}>{message.title}</Text>
              <View style={styles.divider} />
              <Text style={styles.messageContent}>{message.content}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {actionError && (
        <Text
          style={styles.actionError}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          {actionError}
        </Text>
      )}

      {/* Botões de emergência */}
      {emergencyContact && (
        <View style={styles.emergencyActions}>
          <Pressable
            style={styles.emergencyButton}
            onPress={handleEmergencyCall}
            accessibilityRole="button"
            accessibilityLabel={`Ligar para ${emergencyContact.name}`}
            accessibilityHint="Abre o telefone para discar"
          >
            <Text style={styles.emergencyButtonText}>
              Ligar para {emergencyContact.name}
            </Text>
          </Pressable>

          <Pressable
            style={styles.emergencyButtonSecondary}
            onPress={handleEmergencyMessage}
            accessibilityRole="button"
            accessibilityLabel={`Enviar mensagem para ${emergencyContact.name}`}
            disabled={!currentMessage}
            accessibilityState={{ disabled: !currentMessage }}
            accessibilityHint="Abre o aplicativo de mensagens com o texto visível no cartão"
          >
            <Text style={styles.emergencyButtonSecondaryText}>
              Enviar mensagem
            </Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors, fontSize: (size: number) => number) =>
  StyleSheet.create({
    outerScroll: { flex: 1, backgroundColor: colors.background },
    container: {
      flexGrow: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 32,
    },
    scrollView: {
      flexGrow: 1,
      flexShrink: 0,
      minHeight: 300,
    },
    pageIndicator: {
      alignItems: "center",
      marginBottom: 16,
    },
    pageIndicatorText: {
      color: colors.textMuted,
      fontSize: fontSize(14),
    },
    messageContainer: {
      flexShrink: 0,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyState: { gap: 16 },
    messageContentWrapper: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "flex-start",
      width: "100%",
      maxWidth: 560,
      paddingHorizontal: 8,
    },
    messageTitle: {
      color: colors.accent,
      fontSize: fontSize(36),
      fontWeight: "800",
      marginBottom: 24,
      textAlign: "left",
      lineHeight: fontSize(44),
      textShadowColor: colors.shadow,
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    divider: {
      width: 60,
      height: 4,
      backgroundColor: colors.accent,
      borderRadius: 2,
      marginBottom: 32,
    },
    messageContent: {
      color: colors.text,
      fontSize: fontSize(26),
      lineHeight: fontSize(40),
      textAlign: "left",
      fontWeight: "600",
      flexShrink: 1,
    },
    emergencyActions: {
      gap: 12,
      marginTop: 32,
    },
    emergencyButton: {
      backgroundColor: colors.accent,
      paddingVertical: 18,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: "center",
    },
    emergencyButtonText: {
      color: colors.accentText,
      fontSize: fontSize(18),
      fontWeight: "700",
    },
    emergencyButtonSecondary: {
      backgroundColor: "transparent",
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.accent,
    },
    emergencyButtonSecondaryText: {
      color: colors.accent,
      fontSize: fontSize(16),
      fontWeight: "600",
    },
    swipeHint: {
      color: colors.textMuted,
      fontSize: fontSize(14),
      textAlign: "center",
      marginBottom: 16,
    },
    actionError: {
      color: colors.warm,
      fontSize: fontSize(14),
      lineHeight: fontSize(20),
      textAlign: "center",
      marginTop: 12,
    },
  });
