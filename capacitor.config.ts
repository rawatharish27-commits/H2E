import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.help2earn.app',
  appName: 'Help2Earn',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#f97316',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
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
    }
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#ffffff',
    buildOptions: {
      keystorePath: 'keystore.jks',
      keystorePassword: process.env.KEYSTORE_PASSWORD,
      keystoreAlias: 'helppe',
      keystoreAliasPassword: process.env.KEYSTORE_ALIAS_PASSWORD,
      signingType: 'apksigner'
    }
  },
  ios: {
    scheme: 'Help2Earn',
    contentInset: 'automatic'
  }
};

export default config;
