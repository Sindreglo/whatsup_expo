/**
 * App.tsx - Main application entry point
 *
 * This file conditionally loads the appropriate component based on the platform:
 * - Web: Loads VideoCallWeb component with full Agora video calling functionality
 * - Native (iOS/Android): Loads NativePlaceholder with informative message
 *
 * The web Agora SDK (agora-rtc-react) depends on browser APIs (window.addEventListener, etc.)
 * that do not exist in React Native environments. This conditional loading pattern
 * prevents the web SDK from being executed on native platforms.
 *
 * MIGRATION NOTE: For full native support, consider migrating to react-native-agora.
 * @see https://github.com/AgoraIO-Community/react-native-agora
 */
import React from "react";
import { Platform } from "react-native";

// Import native placeholder directly (it has no web dependencies)
import NativePlaceholder from "./src/NativePlaceholder";

// Conditionally import web-only component
// Using require() with Platform check to prevent the web SDK from loading on native
let VideoCallWeb: React.ComponentType | null = null;

if (Platform.OS === "web") {
  // Only load the web SDK on web platform
  // This prevents agora-rtc-react from being bundled/executed on native
  VideoCallWeb = require("./src/VideoCallWeb").default;
}

export default function App() {
  // Render platform-specific component
  if (Platform.OS === "web" && VideoCallWeb) {
    return <VideoCallWeb />;
  }

  // Native platforms: show placeholder with migration guidance
  return <NativePlaceholder />;
}
