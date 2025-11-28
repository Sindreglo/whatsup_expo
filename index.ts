import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';

/**
 * TEMPORARY COMPATIBILITY SHIM
 * 
 * This polyfill ensures window.addEventListener and window.removeEventListener
 * exist as no-op functions in native environments (iOS/Android) where they are undefined.
 * 
 * The web Agora SDK (agora-rtc-react / agora-rtc-sdk-ng) depends on browser APIs like
 * window.addEventListener which don't exist in React Native. This causes a crash:
 * "TypeError: window.addEventListener is not a function"
 * 
 * This is a temporary workaround. For production native apps, consider:
 * - Migrating to react-native-agora for native support
 * - Using conditional imports to load different implementations per platform
 * - Using WebView for web-only features on native
 * 
 * @see https://docs.agora.io/en/video-calling/get-started/get-started-sdk
 */

if (Platform.OS !== 'web') {
  // Get reference to global object (window in RN, global as fallback)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globalObj: any = typeof window !== 'undefined' ? window : global;
  
  // Polyfill window.addEventListener if not present
  if (typeof globalObj.addEventListener !== 'function') {
    globalObj.addEventListener = () => {
      // No-op: native environments don't support window event listeners
    };
  }
  
  // Polyfill window.removeEventListener if not present
  if (typeof globalObj.removeEventListener !== 'function') {
    globalObj.removeEventListener = () => {
      // No-op: native environments don't support window event listeners
    };
  }
}

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
