# whatsup_expo

An Expo project with Agora video calling using `agora-rtc-react` (WebRTC only, no eject).

## Features

- Video calling using Agora RTC SDK
- Fixed video channel called "main"
- Local and remote video streams display
- Works on iOS, Android, and Web platforms

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

## Environment Variables

| Variable | Description |
|----------|-------------|
| `AGORA_APP_ID` | Your Agora application ID from the Agora Console |

## Project Structure

```
├── App.tsx          # Main app component with video call functionality
├── .env             # Environment variables (add your AGORA_APP_ID here)
├── babel.config.js  # Babel configuration for env variables
├── env.d.ts         # TypeScript declarations for env variables
├── app.json         # Expo configuration
└── package.json     # Dependencies and scripts
```

## Notes

- This project uses `agora-rtc-react` which is WebRTC-based and works without ejecting from Expo
- For production, you should implement a token server for secure authentication
- Camera and microphone permissions are required for video calls