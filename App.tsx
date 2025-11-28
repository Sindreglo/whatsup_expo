import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import AgoraRTC, {
  AgoraRTCProvider,
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import { AGORA_APP_ID } from "@env";
import appJson from "./app.json";

// Theme colors
const PRIMARY_COLOR = "#0066FF";
const BACKGROUND_COLOR = "#1a1a2e";
const TEXT_COLOR = "#ffffff";
const TEXT_SECONDARY = "#a0a0a0";

// Get app version from app.json
const APP_VERSION = appJson.expo.version;

// Detect if running on web and on a mobile device
const isWeb = Platform.OS === "web";
const canDetectUserAgent = isWeb && typeof navigator !== "undefined";
const userAgent = canDetectUserAgent ? navigator.userAgent : "";
const isMobileWeb = canDetectUserAgent && /iPhone|iPad|iPod|Android/i.test(userAgent);
const isIOSWeb = canDetectUserAgent && /iPhone|iPad|iPod/i.test(userAgent);
const isAndroidWeb = canDetectUserAgent && /Android/i.test(userAgent);

// Fixed channel name
const CHANNEL_NAME = "main";

// Initialize Agora client
const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

function VideoCall() {
  const [isJoined, setIsJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = () => {
    if (!AGORA_APP_ID) {
      alert("Please set your AGORA_APP_ID in the .env file");
      return;
    }
    setIsJoining(true);
    setIsJoined(true);
  };

  const handleLeave = () => {
    setIsJoined(false);
    setIsJoining(false);
  };

  if (!isJoined) {
    return (
      <View style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.landingContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require("./assets/icons/icon-512.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* App Title */}
          <Text style={styles.title}>WhatsUp</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Connect with friends and family through video calls
          </Text>

          {/* Creator credit */}
          <Text style={styles.creatorText}>Created by Sindre Glomnes</Text>

          {/* Show different content based on platform */}
          {isMobileWeb ? (
            <View style={styles.installGuideContainer}>
              <View style={styles.installGuideTitleRow}>
                <Ionicons name="download-outline" size={20} color={TEXT_COLOR} />
                <Text style={styles.installGuideTitle}>Add to Home Screen</Text>
              </View>
              <Text style={styles.installGuideSubtitle}>
                For the best experience, install this app on your device
              </Text>
              
              {isIOSWeb ? (
                <View style={styles.guideSteps}>
                  <View style={styles.guideHeaderRow}>
                    <Ionicons name="logo-apple" size={18} color={TEXT_COLOR} />
                    <Text style={styles.guideHeader}>iOS (Safari)</Text>
                  </View>
                  <View style={styles.stepContainer}>
                    <Text style={styles.stepNumber}>1</Text>
                    <View style={styles.stepTextContainer}>
                      <Text style={styles.stepText}>
                        Tap the <Text style={styles.highlight}>Share</Text> button at the bottom of Safari
                      </Text>
                    </View>
                  </View>
                  <View style={styles.stepContainer}>
                    <Text style={styles.stepNumber}>2</Text>
                    <View style={styles.stepTextContainer}>
                      <Text style={styles.stepText}>
                        Scroll down and tap <Text style={styles.highlight}>"Add to Home Screen"</Text>
                      </Text>
                    </View>
                  </View>
                  <View style={styles.stepContainer}>
                    <Text style={styles.stepNumber}>3</Text>
                    <View style={styles.stepTextContainer}>
                      <Text style={styles.stepText}>
                        Tap <Text style={styles.highlight}>"Add"</Text> in the top right corner
                      </Text>
                    </View>
                  </View>
                </View>
              ) : isAndroidWeb ? (
                <View style={styles.guideSteps}>
                  <View style={styles.guideHeaderRow}>
                    <Ionicons name="logo-android" size={18} color={TEXT_COLOR} />
                    <Text style={styles.guideHeader}>Android (Chrome)</Text>
                  </View>
                  <View style={styles.stepContainer}>
                    <Text style={styles.stepNumber}>1</Text>
                    <View style={styles.stepTextContainer}>
                      <Text style={styles.stepText}>
                        Tap the <Text style={styles.highlight}>Menu</Text> button (three dots) in the top right
                      </Text>
                    </View>
                  </View>
                  <View style={styles.stepContainer}>
                    <Text style={styles.stepNumber}>2</Text>
                    <View style={styles.stepTextContainer}>
                      <Text style={styles.stepText}>
                        Tap <Text style={styles.highlight}>"Add to Home screen"</Text> or <Text style={styles.highlight}>"Install app"</Text>
                      </Text>
                    </View>
                  </View>
                  <View style={styles.stepContainer}>
                    <Text style={styles.stepNumber}>3</Text>
                    <View style={styles.stepTextContainer}>
                      <Text style={styles.stepText}>
                        Tap <Text style={styles.highlight}>"Add"</Text> to confirm
                      </Text>
                    </View>
                  </View>
                </View>
              ) : (
                <View style={styles.guideSteps}>
                  <Text style={styles.guideHeader}>Mobile Browser</Text>
                  <Text style={styles.stepText}>
                    Look for "Add to Home Screen" or "Install" option in your browser's menu
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <TouchableOpacity
              style={styles.joinButton}
              onPress={handleJoin}
              disabled={isJoining}
            >
              <MaterialIcons
                name="video-call"
                size={24}
                color={TEXT_COLOR}
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>
                {isJoining ? "Joining..." : "Join Call"}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* Footer with version */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Version {APP_VERSION}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <VideoRoom onLeave={handleLeave} />
    </View>
  );
}

interface VideoRoomProps {
  onLeave: () => void;
}

function VideoRoom({ onLeave }: VideoRoomProps) {
  // Camera and microphone state
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  // Get local camera and microphone tracks
  const { localCameraTrack, isLoading: isCameraLoading } =
    useLocalCameraTrack();
  const { localMicrophoneTrack, isLoading: isMicLoading } =
    useLocalMicrophoneTrack();

  // Get remote users
  const remoteUsers = useRemoteUsers();

  // Join the channel
  const { isConnected } = useJoin({
    appid: AGORA_APP_ID,
    channel: CHANNEL_NAME,
    token: null, // For testing only. In production, implement a token server for secure authentication.
  });

  // Publish local tracks
  usePublish([localMicrophoneTrack, localCameraTrack]);

  // Handle camera toggle
  useEffect(() => {
    if (localCameraTrack) {
      localCameraTrack.setEnabled(isCameraOn);
    }
  }, [isCameraOn, localCameraTrack]);

  // Handle microphone toggle
  useEffect(() => {
    if (localMicrophoneTrack) {
      localMicrophoneTrack.setEnabled(isMicOn);
    }
  }, [isMicOn, localMicrophoneTrack]);

  const toggleCamera = () => {
    setIsCameraOn((prev) => !prev);
  };

  const toggleMic = () => {
    setIsMicOn((prev) => !prev);
  };

  const isLoading = isCameraLoading || isMicLoading || !isConnected;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Connecting to channel...</Text>
      </View>
    );
  }

  // Calculate remote video height based on number of remote users
  const getRemoteVideoStyle = (index: number, total: number) => {
    if (total === 1) {
      // Single remote user takes full screen
      return styles.remoteVideoFull;
    } else if (total === 2) {
      // Two remote users split the screen vertically
      return styles.remoteVideoHalf;
    } else {
      // More than 2 users - show in grid
      return styles.remoteVideoGrid;
    }
  };

  return (
    <View style={styles.videoContainer}>
      {/* Remote Videos - Full Screen / Split Screen */}
      <View style={styles.remoteVideosContainer}>
        {remoteUsers.length === 0 ? (
          <View style={styles.waitingContainer}>
            <Text style={styles.waitingText}>
              Waiting for others to join...
            </Text>
          </View>
        ) : (
          remoteUsers.slice(0, 4).map((user, index) => (
            <View
              key={user.uid}
              style={getRemoteVideoStyle(
                index,
                Math.min(remoteUsers.length, 4)
              )}
            >
              <RemoteUser
                user={user}
                playVideo={true}
                playAudio={true}
                style={styles.remoteVideo}
              />
              <Text style={styles.remoteVideoLabel}>User {user.uid}</Text>
            </View>
          ))
        )}
      </View>

      {/* Local Video - Small in bottom right corner */}
      <View style={styles.localVideoContainer}>
        {localCameraTrack && isCameraOn ? (
          <LocalVideoTrack
            track={localCameraTrack}
            play={true}
            style={styles.localVideo}
          />
        ) : (
          <View
            style={styles.cameraOffPlaceholder}
            accessibilityLabel="Camera is off"
          >
            <MaterialIcons name="videocam-off" size={40} color="#fff" />
          </View>
        )}
        <Text style={styles.localVideoLabel}>You</Text>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, !isMicOn && styles.controlButtonOff]}
          onPress={toggleMic}
          accessibilityLabel={isMicOn ? "Mute microphone" : "Unmute microphone"}
          accessibilityRole="button"
        >
          <MaterialIcons
            name={isMicOn ? "mic" : "mic-off"}
            size={28}
            color={isMicOn ? "#fff" : "#ff5252"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.leaveButton}
          onPress={onLeave}
          accessibilityLabel="Leave call"
          accessibilityRole="button"
        >
          <FontAwesome
            name="phone"
            size={32}
            color="#fff"
            style={{ transform: [{ rotate: "135deg" }] }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, !isCameraOn && styles.controlButtonOff]}
          onPress={toggleCamera}
          accessibilityLabel={isCameraOn ? "Turn off camera" : "Turn on camera"}
          accessibilityRole="button"
        >
          <MaterialIcons
            name={isCameraOn ? "videocam" : "videocam-off"}
            size={28}
            color={isCameraOn ? "#fff" : "#ff5252"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function App() {
  // Load icon fonts for web reliability
  const [fontsLoaded] = useFonts({
    ...MaterialIcons.font,
    ...FontAwesome.font,
    ...Ionicons.font,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AgoraRTCProvider client={client}>
        <StatusBar style="light" backgroundColor={PRIMARY_COLOR} />
        <VideoCall />
      </AgoraRTCProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
  },
  landingContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    marginBottom: 16,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 24,
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
    marginBottom: 16,
    paddingHorizontal: 24,
    lineHeight: 24,
  },
  creatorText: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    marginBottom: 32,
  },
  channelInfo: {
    fontSize: 16,
    color: "#a0a0a0",
    marginBottom: 30,
  },
  joinButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    color: TEXT_COLOR,
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    width: "100%",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  installGuideContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 350,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  installGuideTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    gap: 8,
  },
  installGuideTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: TEXT_COLOR,
  },
  installGuideSubtitle: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    textAlign: "center",
    marginBottom: 20,
  },
  guideSteps: {
    backgroundColor: "rgba(0, 102, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
  },
  guideHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  guideHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT_COLOR,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  stepTextContainer: {
    flex: 1,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: PRIMARY_COLOR,
    color: TEXT_COLOR,
    textAlign: "center",
    lineHeight: 24,
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: TEXT_COLOR,
    lineHeight: 22,
  },
  highlight: {
    color: PRIMARY_COLOR,
    fontWeight: "600",
  },
  videoContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#000000",
  },
  remoteVideosContainer: {
    flex: 1,
    flexDirection: "column",
  },
  remoteVideoFull: {
    flex: 1,
    width: "100%",
  },
  remoteVideoHalf: {
    flex: 1,
    width: "100%",
  },
  remoteVideoGrid: {
    width: "50%",
    height: "50%",
  },
  remoteVideo: {
    width: "100%",
    height: "100%",
  },
  remoteVideoLabel: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    left: 16,
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  waitingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
  },
  waitingText: {
    color: "#a0a0a0",
    fontSize: 18,
    textAlign: "center",
  },
  localVideoContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    right: 16,
    width: 100,
    height: 140,
    backgroundColor: "#2d2d44",
    borderRadius: 12,
    overflow: "hidden",
    zIndex: 100,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  localVideo: {
    width: "100%",
    height: "100%",
  },
  localVideoLabel: {
    position: "absolute",
    bottom: 8,
    left: 8,
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cameraOffPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2d2d44",
  },
  cameraOffText: {
    fontSize: 32,
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 18,
  },
  controlsContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 50 : 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    zIndex: 100,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  controlButtonOff: {
    backgroundColor: "rgba(255,0,0,0.6)",
  },
  controlButtonText: {
    fontSize: 24,
  },
  leaveButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#f44336",
    justifyContent: "center",
    alignItems: "center",
  },
  leaveButtonText: {
    fontSize: 28,
    transform: [{ rotate: "135deg" }],
  },
});
