import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Linking,
} from "react-native";
import { useCrisisStore } from "@/stores/crisisStore";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";

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
 * - Acesso ao contato de emergência
 * - Sem elementos piscando ou animações complexas
 */
export function CrisisCardModal() {
  const { messages, contacts, activeMessageId, setActiveMessage } =
    useCrisisStore();
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (!activeMessageId || messages.length === 0) return 0;
    const index = messages.findIndex((m) => m.id === activeMessageId);
    return index >= 0 ? index : 0;
  });

  const scrollViewRef = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();
  const { trigger } = useHapticFeedback();

  const currentMessage = messages[currentIndex];

  // Navegação por gesto (swipe horizontal)
  const handleScroll = (event: ScrollViewEvent) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    if (index !== currentIndex && index >= 0 && index < messages.length) {
      setCurrentIndex(index);
      setActiveMessage(messages[index].id);
    }
  };

  // Ligar para contato de emergência
  const handleEmergencyCall = () => {
    trigger("success");
    const emergencyContact = contacts[0];
    if (emergencyContact?.phone) {
      Linking.openURL(`tel:${emergencyContact.phone}`);
    }
  };

  // Enviar mensagem para contato de emergência
  const handleEmergencyMessage = () => {
    trigger("light");
    const emergencyContact = contacts[0];
    if (emergencyContact?.phone) {
      const message = encodeURIComponent(currentMessage?.content || "");
      Linking.openURL(`sms:${emergencyContact.phone}?body=${message}`);
    }
  };

  if (!currentMessage) return null;

  return (
    <View style={styles.container}>
      {/* Indicador de página sutil */}
      {messages.length > 1 && (
        <View style={styles.pageIndicator}>
          <Text style={styles.pageIndicatorText}>
            {currentIndex + 1} / {messages.length}
          </Text>
        </View>
      )}

      {/* Mensagens com navegação por gesto */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {messages.map((message) => (
          <View key={message.id} style={[styles.messageContainer, { width }]}>
            <View style={styles.messageContentWrapper}>
              <Text style={styles.messageTitle}>{message.title}</Text>
              <View style={styles.divider} />
              <Text style={styles.messageContent}>{message.content}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Botões de emergência */}
      {contacts[0] && (
        <View style={styles.emergencyActions}>
          <Pressable
            style={styles.emergencyButton}
            onPress={handleEmergencyCall}
            accessibilityLabel={`Ligar para ${contacts[0].name}`}
          >
            <Text style={styles.emergencyButtonText}>
              Ligar para {contacts[0].name}
            </Text>
          </Pressable>

          <Pressable
            style={styles.emergencyButtonSecondary}
            onPress={handleEmergencyMessage}
            accessibilityLabel={`Enviar mensagem para ${contacts[0].name}`}
          >
            <Text style={styles.emergencyButtonSecondaryText}>
              Enviar mensagem
            </Text>
          </Pressable>
        </View>
      )}

      {/* Instrução de navegação sutil */}
      {messages.length > 1 && (
        <Text style={styles.swipeHint}>
          Deslize para ver mais mensagens
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1D23",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  pageIndicator: {
    alignItems: "center",
    marginBottom: 16,
  },
  pageIndicatorText: {
    color: "#8A8782",
    fontSize: 14,
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 32,
  },
  messageContentWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
    paddingHorizontal: 8,
  },
  messageTitle: {
    color: "#7B9EA8",
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 24,
    textAlign: "left",
    lineHeight: 44,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  divider: {
    width: 60,
    height: 4,
    backgroundColor: "#7B9EA8",
    borderRadius: 2,
    marginBottom: 32,
  },
  messageContent: {
    color: "#E8E6E3",
    fontSize: 26,
    lineHeight: 40,
    textAlign: "left",
    fontWeight: "600",
    flexWrap: "wrap",
    flexShrink: 1,
  },
  emergencyActions: {
    gap: 12,
    marginTop: 32,
  },
  emergencyButton: {
    backgroundColor: "#7B9EA8",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  emergencyButtonText: {
    color: "#1A1D23",
    fontSize: 18,
    fontWeight: "700",
  },
  emergencyButtonSecondary: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#7B9EA8",
  },
  emergencyButtonSecondaryText: {
    color: "#7B9EA8",
    fontSize: 16,
    fontWeight: "600",
  },
  swipeHint: {
    color: "#8A8782",
    fontSize: 14,
    textAlign: "center",
    marginTop: 16,
  },
});
