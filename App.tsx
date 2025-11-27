import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import AgoraRTC, {
  AgoraRTCProvider,
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
  useRTCClient,
} from 'agora-rtc-react';
import { AGORA_APP_ID } from '@env';

// Fixed channel name
const CHANNEL_NAME = 'main';

// Initialize Agora client
const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

function VideoCall() {
  const [isJoined, setIsJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = () => {
    if (!AGORA_APP_ID) {
      alert('Please set your AGORA_APP_ID in the .env file');
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
            {isJoining ? 'Joining...' : 'Join Call'}
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
  const agoraClient = useRTCClient();
  
  // Get local camera and microphone tracks
  const { localCameraTrack, isLoading: isCameraLoading } = useLocalCameraTrack();
  const { localMicrophoneTrack, isLoading: isMicLoading } = useLocalMicrophoneTrack();
  
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

  const isLoading = isCameraLoading || isMicLoading || !isConnected;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Connecting to channel...</Text>
      </View>
    );
  }

  return (
    <View style={styles.videoContainer}>
      <Text style={styles.channelTitle}>Channel: {CHANNEL_NAME}</Text>
      
      {/* Local Video */}
      <View style={styles.localVideoContainer}>
        <Text style={styles.videoLabel}>You</Text>
        {localCameraTrack && (
          <LocalVideoTrack
            track={localCameraTrack}
            play={true}
            style={styles.localVideo}
          />
        )}
      </View>
      
      {/* Remote Videos */}
      <View style={styles.remoteVideosContainer}>
        {remoteUsers.length === 0 ? (
          <Text style={styles.waitingText}>Waiting for others to join...</Text>
        ) : (
          remoteUsers.map((user) => (
            <View key={user.uid} style={styles.remoteVideoWrapper}>
              <Text style={styles.videoLabel}>User {user.uid}</Text>
              <RemoteUser
                user={user}
                playVideo={true}
                playAudio={true}
                style={styles.remoteVideo}
              />
            </View>
          ))
        )}
      </View>
      
      {/* Leave Button */}
      <TouchableOpacity style={styles.leaveButton} onPress={onLeave}>
        <Text style={styles.buttonText}>Leave Call</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <AgoraRTCProvider client={client}>
      <VideoCall />
    </AgoraRTCProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  channelInfo: {
    fontSize: 16,
    color: '#a0a0a0',
    marginBottom: 30,
  },
  joinButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  videoContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#1a1a2e',
    padding: 10,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  channelTitle: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  localVideoContainer: {
    height: 200,
    backgroundColor: '#2d2d44',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  localVideo: {
    width: '100%',
    height: '100%',
  },
  videoLabel: {
    position: 'absolute',
    top: 10,
    left: 10,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  remoteVideosContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  remoteVideoWrapper: {
    width: '48%',
    aspectRatio: 4 / 3,
    backgroundColor: '#2d2d44',
    borderRadius: 10,
    overflow: 'hidden',
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
  },
  waitingText: {
    color: '#a0a0a0',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 18,
  },
  leaveButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
});
