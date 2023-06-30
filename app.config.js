export default {
  name: 'chalk',
  slug: 'chalk',
  version: '1.0.2',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON_IOS || './GoogleServices/google-services.json',
    bundleIdentifier: 'com.foln.chalk',
    buildNumber: '1',
  },
  android: {
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON_ANDROID || './GoogleServices/GoogleService-Info.plist',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
    package: 'com.foln.chalk',
    versionCode: 25,
  },
  plugins: [
    '@react-native-firebase/app',
    '@react-native-firebase/auth',
    'expo-notifications',
    '@react-native-google-signin/google-signin',
  ],
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    eas: {
      projectId: 'c9477469-1627-4eed-a592-bc082c70c70d',
    },
  },
  'react-native-google-mobile-ads': {
    android_app_id: 'ca-app-pub-8514165585360004~7612647851',
    ios_app_id: 'ca-app-pub-xxxxxxxx~xxxxxxxx',
  },
};