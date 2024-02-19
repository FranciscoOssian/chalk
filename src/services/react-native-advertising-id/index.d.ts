declare module 'react-native-advertising-id' {
  export const getAdvertisingId: () => Promise<{
    advertisingId: string;
    isLimitAdTrackingEnabled: boolean;
  }>;
}
