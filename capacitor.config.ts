import type { CapacitorConfig } from '@capacitor/cli';

// Configuration for Help2Earn APK
// The app connects to the hosted backend for all data

const config: CapacitorConfig = {
  appId: 'com.helppe.dailyearn',
  appName: 'Help2Earn',
  webDir: 'out',
  
  // Connect to hosted app (change URL when deployed)
  server: {
    // For production: uncomment and set your deployed URL
    // url: 'https://your-app.vercel.app',
    // cleartext: true,
    androidScheme: 'https'
  },
  
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#f97316',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    Geolocation: {
      enableHighAccuracy: true
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#f97316'
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true
    },
    StatusBar: {
      style: 'Dark',
      backgroundColor: '#f97316'
    },
    App: {
      launchUrl: ''
    }
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#ffffff',
    captureInput: true,
    webContentsDebuggingEnabled: false
  },
  ios: {
    scheme: 'Help2Earn',
    contentInset: 'automatic'
  }
};

export default config;
