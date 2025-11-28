import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

// Theme colors
const PRIMARY_COLOR = "#0066FF";
const BACKGROUND_COLOR = "#1a1a2e";
const TEXT_COLOR = "#ffffff";
const TEXT_SECONDARY = "#a0a0a0";

interface HomeScreenProps {
  onStartChat?: () => void;
  onOpenSettings?: () => void;
}

export default function HomeScreen({
  onStartChat,
  onOpenSettings,
}: HomeScreenProps) {
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        {/* Logo/Icon */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="chatbubbles" size={64} color={TEXT_COLOR} />
          </View>
        </View>

        {/* App Title */}
        <Text style={styles.title}>WhatsUp</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Connect with friends and family through video calls
        </Text>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onStartChat}
            accessibilityLabel="Start a chat"
            accessibilityRole="button"
          >
            <MaterialIcons
              name="video-call"
              size={24}
              color={TEXT_COLOR}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Chats</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onOpenSettings}
            accessibilityLabel="Open settings"
            accessibilityRole="button"
          >
            <MaterialIcons
              name="settings"
              size={24}
              color={TEXT_COLOR}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: PRIMARY_COLOR,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: TEXT_COLOR,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: TEXT_SECONDARY,
    textAlign: "center",
    marginBottom: 48,
    paddingHorizontal: 24,
    lineHeight: 24,
  },
  buttonsContainer: {
    width: "100%",
    maxWidth: 300,
    gap: 16,
  },
  primaryButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: TEXT_COLOR,
  },
});
