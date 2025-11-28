# whatsup_expo

An Expo project with Agora video calling using `agora-rtc-react` (WebRTC only, no eject).

## Features

- Video calling using Agora RTC SDK
- Fixed video channel called "main"
- Local and remote video streams display
- Works on iOS, Android, and Web platforms

## Platform Support

| Platform | Video Calling | Notes |
|----------|---------------|-------|
| **Web** | ✅ Full support | Uses agora-rtc-react web SDK |
| **iOS** | ⚠️ Placeholder | Shows informative message with migration guidance |
| **Android** | ⚠️ Placeholder | Shows informative message with migration guidance |

> **Note:** The `agora-rtc-react` package is a web-only SDK that requires browser APIs. Native platforms (iOS/Android) display a placeholder with instructions for enabling native support via `react-native-agora`.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure your Agora App ID:
   - Sign up at [Agora Console](https://console.agora.io/)
   - Create a new project
   - Copy your App ID
   - Open the `.env` file and add your App ID:
```
AGORA_APP_ID="your-agora-app-id-here"
```

3. Run the app:
```bash
# For web
npm run web

# For iOS
npm run ios

# For Android
npm run android
```

## Testing in Expo

### Web Platform (Full functionality)
```bash
npm run web
# Opens in browser at http://localhost:8081
# You should see the "Agora Video Call" screen with "Join Call" button
```

### Native Platform (iOS/Android - Placeholder)
```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Or use Expo Go
expo start
# Then scan QR code with Expo Go app
```

**Expected behavior on native:**
- The app should NOT crash (previously crashed with "TypeError: window.addEventListener is not a function")
- You will see a "Video Calling Unavailable" placeholder screen
- Console will show a warning with migration guidance
- Links to Agora React Native SDK and Expo Native Modules documentation are provided

### Verifying the Fix
1. Start Expo: `npm start` or `expo start`
2. Run on iOS simulator or Android emulator
3. Verify:
   - ✅ No crash on startup
   - ✅ Placeholder screen is displayed
   - ✅ Console warning appears with migration instructions
   - ✅ Documentation links work when tapped

## Environment Variables

| Variable | Description |
|----------|-------------|
| `AGORA_APP_ID` | Your Agora application ID from the Agora Console |

## Project Structure

```
├── App.tsx              # Main app with platform-specific component loading
├── src/
│   ├── VideoCallWeb.tsx    # Web-only video call implementation
│   └── NativePlaceholder.tsx # Native placeholder with migration info
├── index.ts             # Entry point with window polyfill for native
├── .env                 # Environment variables (add your AGORA_APP_ID here)
├── babel.config.js      # Babel configuration for env variables
├── env.d.ts             # TypeScript declarations for env variables
├── app.json             # Expo configuration
└── package.json         # Dependencies and scripts
```

## Native Video Calling Support

To enable full video calling on native platforms, consider these options:

1. **react-native-agora** (Recommended)
   - Native Agora SDK wrapper for React Native
   - Full feature parity with web SDK
   - Requires EAS Build or ejecting from Expo managed workflow
   - [Documentation](https://docs.agora.io/en/video-calling/get-started/get-started-sdk?platform=react-native)
   - [GitHub](https://github.com/AgoraIO-Community/react-native-agora)

2. **WebView-based Solution**
   - Run the web video calling interface inside a WebView
   - Works within Expo managed workflow
   - May have performance limitations

3. **Expo Modules**
   - Build custom native module using Expo's module system
   - [Expo Modules Overview](https://docs.expo.dev/modules/overview/)

## Notes

- This project uses `agora-rtc-react` which is WebRTC-based and works without ejecting from Expo
- For production, you should implement a token server for secure authentication
- Camera and microphone permissions are required for video calls
- The native placeholder includes runtime warnings and migration guidance