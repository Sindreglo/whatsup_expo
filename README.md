# whatsup_expo

An Expo project with Agora video calling using `agora-rtc-react` (WebRTC only, no eject).

## Features

- Video calling using Agora RTC SDK
- Fixed video channel called "main"
- Local and remote video streams display
- Works on iOS, Android, and Web platforms
- PWA support for web (add to home screen functionality)
- Safe area handling for notches and system bars

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
├── App.tsx              # Main app component with video call functionality
├── screens/
│   └── HomeScreen.tsx   # Home screen component with improved UI
├── assets/
│   ├── icons/           # PWA icons for web deployment
│   │   ├── favicon.png
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   ├── apple-touch-icon.png
│   │   └── README.md
│   └── ...
├── scripts/
│   ├── patch-dist-index.js  # Adds PWA support to web build
│   └── copy-404.js          # Creates 404.html for GitHub Pages
├── .env                 # Environment variables (add your AGORA_APP_ID here)
├── babel.config.js      # Babel configuration for env variables
├── env.d.ts             # TypeScript declarations for env variables
├── app.json             # Expo configuration
└── package.json         # Dependencies and scripts
```

## PWA Support

The web version supports PWA (Progressive Web App) features:

- **Add to Home Screen**: Users can add the app to their device's home screen
- **Theme Color**: Browser toolbar matches the app's primary color (#0066FF)
- **Custom Icons**: PWA-compatible PNG icons for various sizes

To build for PWA deployment:
```bash
npm run predeploy
```

This generates the `dist/` folder with:
- `manifest.json` - PWA manifest with icons and theme colors
- `assets/icons/` - All PWA icons copied from source
- Updated `index.html` with PWA meta tags

## GitHub Pages Deployment

The app is configured for deployment to GitHub Pages at a subpath (e.g., `https://username.github.io/repo-name/`).

### Configuration

- **Base URL**: The `experiments.baseUrl` in `app.json` is set to `/whatsup_expo` to ensure all bundled assets (JS, fonts, icons) are loaded from the correct subpath
- **Homepage**: The `homepage` field in `package.json` points to the GitHub Pages URL
- **Icon Fonts**: Icon fonts from `@expo/vector-icons` are preloaded using `expo-font` in `App.tsx` to ensure reliable rendering on web

### Deploy Commands

```bash
# Build for production
npm run build:web

# Run pre-deploy scripts (patches index.html, adds 404.html, etc.)
npm run predeploy

# Deploy to GitHub Pages
npm run deploy
```

### Customizing for Your Repository

If you fork this project, update the following:

1. In `app.json`, change `experiments.baseUrl` to match your repository name:
   ```json
   "experiments": {
     "baseUrl": "/your-repo-name"
   }
   ```

2. In `package.json`, update the `homepage` field:
   ```json
   "homepage": "https://your-username.github.io/your-repo-name"
   ```

## Notes

- This project uses `agora-rtc-react` which is WebRTC-based and works without ejecting from Expo
- For production, you should implement a token server for secure authentication
- Camera and microphone permissions are required for video calls
- The app uses `react-native-safe-area-context` for safe area handling