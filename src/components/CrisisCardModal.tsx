import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  Linking,
} from "react-native";
import { useCrisisStore } from "@/stores/crisisStore";

/**
 * CrisisCardModal — Cartão de Comunicação de Crise
 * 
 * Características:
 * - Modo cheio e alto contraste (texto grande, fundo escuro)
 * - Navegação por gestos simples (swipe horizontal para alternar mensagens)
 * - Acesso ao contato de emergência
 * - Sem elementos piscando ou animações complexas
 */
export function CrisisCardModal() {
  const { messages, contacts, activeMessageId, setActiveMessage } =
    useCrisisStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { width } = Dimensions.get("window");

  const currentMessage = messages[currentIndex] || messages[0];
  const emergencyContact = contacts[0]; // Primeiro contato de emergência

  // Navegação por gesto (swipe horizontal)
  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    if (index !== currentIndex && index >= 0 && index < messages.length) {
      setCurrentIndex(index);
      setActiveMessage(messages[index].id);
    }
  };

  // Ligar para contato de emergência
  const handleEmergencyCall = () => {
    if (emergencyContact?.phone) {
      Linking.openURL(`tel:${emergencyContact.phone}`);
    }
  };

  // Enviar mensagem para contato de emergência
  const handleEmergencyMessage = () => {
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
        {messages.map((message, index) => (
          <View key={message.id} style={[styles.messageContainer, { width }]}>
            <Text style={styles.messageTitle}>{message.title}</Text>
            <Text style={styles.messageContent}>{message.content}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Botões de emergência */}
      {emergencyContact && (
        <View style={styles.emergencyActions}>
          <Pressable
            style={styles.emergencyButton}
            onPress={handleEmergencyCall}
            accessibilityLabel={`Ligar para ${emergencyContact.name}`}
          >
            <Text style={styles.emergencyButtonText}>
              Ligar para {emergencyContact.name}
            </Text>
          </Pressable>

          <Pressable
            style={styles.emergencyButtonSecondary}
            onPress={handleEmergencyMessage}
            accessibilityLabel={`Enviar mensagem para ${emergencyContact.name}`}
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
    alignItems: "center",
    paddingHorizontal: 16,
  },
  messageTitle: {
    color: "#E8E6E3",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 40,
  },
  messageContent: {
    color: "#E8E6E3",
    fontSize: 24,
    lineHeight: 36,
    textAlign: "center",
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
    fontWeight: "600",
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
  },
  swipeHint: {
    color: "#8A8782",
    fontSize: 14,
    textAlign: "center",
    marginTop: 16,
  },
});
