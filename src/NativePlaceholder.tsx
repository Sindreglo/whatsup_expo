/**
 * NativePlaceholder.tsx - Placeholder component for native platforms (iOS/Android)
 *
 * This component is displayed when the app runs on native platforms where
 * the web-based Agora SDK (agora-rtc-react) is not supported.
 *
 * The web Agora SDK depends on browser APIs (window.addEventListener, document, etc.)
 * that do not exist in React Native environments.
 *
 * For native video calling support, consider:
 * - Using react-native-agora package: https://github.com/AgoraIO-Community/react-native-agora
 * - Implementing a WebView-based solution
 *
 * @see https://docs.agora.io/en/video-calling/get-started/get-started-sdk
 */
import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";

/**
 * Logs a warning when web-only features are accessed on native platforms.
 * This is called when the native placeholder is rendered.
 */
function logNativePlatformWarning(): void {
  const platform = Platform.OS === "ios" ? "iOS" : "Android";
  const warningMessage = [
    `[whatsup_expo] Video calling feature is not available on ${Platform.OS}.`,
    "",
    "The Agora web SDK (agora-rtc-react) only works in browser environments.",
    `This app is currently running in Expo on ${platform}.`,
    "",
    "To enable video calling on native platforms, consider these alternatives:",
    "1. Use react-native-agora package: https://github.com/AgoraIO-Community/react-native-agora",
    "2. Implement a WebView-based solution",
    "3. Use Expo's native module system with EAS Build",
    "",
    "For more information, see:",
    "- Agora React Native SDK: https://docs.agora.io/en/video-calling/get-started/get-started-sdk?platform=react-native",
    "- Expo with native modules: https://docs.expo.dev/modules/overview/",
  ].join("\n");
  
  console.warn(warningMessage);
}

export default function NativePlaceholder() {
  // Log warning on mount
  useEffect(() => {
    logNativePlatformWarning();
  }, []);

  const openAgoraDocs = () => {
    Linking.openURL(
      "https://docs.agora.io/en/video-calling/get-started/get-started-sdk?platform=react-native"
    );
  };

  const openExpoDocs = () => {
    Linking.openURL("https://docs.expo.dev/modules/overview/");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Icon */}
      <View style={styles.iconContainer}>
        <MaterialIcons name="videocam-off" size={64} color="#a0a0a0" />
      </View>

      {/* Title */}
      <Text style={styles.title}>Video Calling Unavailable</Text>

      {/* Description */}
      <Text style={styles.description}>
        Video calling is only available in the web version of this app.
      </Text>

      <Text style={styles.platformInfo}>
        Running on: {Platform.OS === "ios" ? "iOS" : "Android"}
      </Text>

      {/* Explanation */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Why?</Text>
        <Text style={styles.infoText}>
          This app uses the Agora web SDK which requires browser APIs not
          available in React Native.
        </Text>
      </View>

      {/* Alternatives */}
      <View style={styles.alternativesBox}>
        <Text style={styles.alternativesTitle}>For native support:</Text>
        <Text style={styles.alternativeItem}>• Use react-native-agora</Text>
        <Text style={styles.alternativeItem}>• Implement WebView solution</Text>
        <Text style={styles.alternativeItem}>• Build with EAS + native modules</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.docsButton} onPress={openAgoraDocs}>
          <Text style={styles.docsButtonText}>Agora RN Docs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.docsButton, styles.secondaryButton]}
          onPress={openExpoDocs}
        >
          <Text style={styles.docsButtonText}>Expo Native Modules</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#2d2d44",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#a0a0a0",
    textAlign: "center",
    marginBottom: 8,
  },
  platformInfo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
  },
  infoBox: {
    backgroundColor: "#2d2d44",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#a0a0a0",
    lineHeight: 20,
  },
  alternativesBox: {
    backgroundColor: "#2d2d44",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    marginBottom: 24,
  },
  alternativesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 12,
  },
  alternativeItem: {
    fontSize: 14,
    color: "#a0a0a0",
    marginBottom: 6,
  },
  buttonContainer: {
    flexDirection: "column",
    gap: 12,
    width: "100%",
  },
  docsButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#3d3d5c",
  },
  docsButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
