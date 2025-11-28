/**
 * VideoCallWeb.tsx - Web-only video call implementation using Agora RTC SDK
 *
 * IMPORTANT: This file should ONLY be imported/loaded on web platform (Platform.OS === 'web').
 * The agora-rtc-react package depends on browser APIs (window.addEventListener, etc.)
 * that do not exist in React Native environments.
 *
 * For native iOS/Android support, consider:
 * - Using react-native-agora package
 * - Implementing a WebView-based solution
 *
 * @see https://docs.agora.io/en/video-calling/get-started/get-started-sdk
 */
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
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
        <Text style={styles.title}>Agora Video Call</Text>
        <Text style={styles.channelInfo}>Channel: {CHANNEL_NAME}</Text>
        <TouchableOpacity
          style={styles.joinButton}
          onPress={handleJoin}
          disabled={isJoining}
        >
          <Text style={styles.buttonText}>
            {isJoining ? "Joining..." : "Join Call"}
          </Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <VideoRoom onLeave={handleLeave} />
      <StatusBar style="auto" />
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

export default function VideoCallWeb() {
  return (
    <AgoraRTCProvider client={client}>
      <VideoCall />
    </AgoraRTCProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
  },
  channelInfo: {
    fontSize: 16,
    color: "#a0a0a0",
    marginBottom: 30,
  },
  joinButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
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
