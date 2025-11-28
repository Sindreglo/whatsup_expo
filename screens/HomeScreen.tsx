/**
 * HomeScreen.tsx
 * 
 * Improved home screen UI for WhatsUp app.
 * Features:
 * - Centered logo with app branding
 * - Primary action buttons styled with theme colors
 * - SafeAreaView for notch/status bar handling
 * - Consistent styling with the app theme (#0066FF primary, #1a1a2e background)
 * 
 * To customize:
 * - Replace the "W" icon with your app logo by changing the MaterialIcons component
 * - Adjust THEME_COLORS to match your brand guidelines
 */

import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

// Theme colors - update these to match your brand
const THEME_COLORS = {
  primary: "#0066FF",
  background: "#1a1a2e",
  surface: "#2d2d44",
  textPrimary: "#ffffff",
  textSecondary: "#a0a0a0",
  success: "#4CAF50",
};

interface HomeScreenProps {
  onJoinCall: () => void;
}

export default function HomeScreen({ onJoinCall }: HomeScreenProps) {
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom", "left", "right"]}>
      <View style={styles.content}>
        {/* Logo and App Title */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <MaterialIcons name="videocam" size={48} color={THEME_COLORS.textPrimary} />
          </View>
          <Text style={styles.appTitle}>WhatsUp</Text>
          <Text style={styles.subtitle}>Connect with anyone, anywhere</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={onJoinCall}
            accessibilityLabel="Join a video call"
            accessibilityRole="button"
          >
            <FontAwesome5 name="video" size={24} color={THEME_COLORS.textPrimary} />
            <Text style={styles.buttonText}>Join Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => {
              // Placeholder for settings/create functionality
              // This can be connected to navigation or modal in future
            }}
            accessibilityLabel="Open settings"
            accessibilityRole="button"
          >
            <MaterialIcons name="settings" size={24} color={THEME_COLORS.textPrimary} />
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Footer info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Secure video calls powered by WebRTC
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: THEME_COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    // Shadow for iOS
    shadowColor: THEME_COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 8,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: THEME_COLORS.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: THEME_COLORS.textSecondary,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
    gap: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 12,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Elevation for Android
    elevation: 5,
  },
  primaryButton: {
    backgroundColor: THEME_COLORS.success,
  },
  secondaryButton: {
    backgroundColor: THEME_COLORS.surface,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: THEME_COLORS.textPrimary,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: THEME_COLORS.textSecondary,
    textAlign: "center",
  },
});
