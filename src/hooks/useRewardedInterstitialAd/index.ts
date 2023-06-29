import { useCallback } from 'react';
import { RewardedInterstitialAd, RewardedAdEventType, RewardedAdReward } from 'react-native-google-mobile-ads';

interface RewardEarnedCallback {
  (reward: RewardedAdReward): void;
}

interface AdCallbacks {
  onLoad?: () => void;
  onEarn?: RewardEarnedCallback;
}

/**
 * Custom hook to use rewarded interstitial ads.
 *
 * #### Example
 *
 * ```js
 * import React, { useEffect } from 'react';
 * import useRewardedInterstitialAd from './useRewardedInterstitialAd';
 *
 * function MyComponent() {
 *   const adUnitId = 'YOUR_AD_UNIT_ID'; // Replace with your ad unit ID
 *   const { showAd } = useRewardedInterstitialAd(adUnitId);
 *
 *   useEffect(() => {
 *     showAd({
 *       onLoad: () => console.log('Ad loaded'),
 *       onEarn: reward => console.log('User earned reward of ', reward)
 *     });
 *   }, [showAd]);
 * }
 * ```
 *
 * @param {string} adUnitId - The ID of the ad unit to be loaded.
 * @returns {Object} - Returns an object with the 'showAd' function.
 * @returns {Function} .showAd - Function to show the ad. It accepts an optional object with 'onLoad' and 'onEarn' callbacks.
 */
export default function useRewardedInterstitialAd(adUnitId: string): { showAd: (callbacks?: AdCallbacks) => void } {
  const showAd = useCallback((callbacks?: AdCallbacks) => {
    const rewardedInterstitial = RewardedInterstitialAd.createForAdRequest(adUnitId);

    rewardedInterstitial.addAdEventListener(RewardedAdEventType.LOADED, () => {
      console.log('Ad loaded');
      rewardedInterstitial.show();
      callbacks?.onLoad?.();
    });

    rewardedInterstitial.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
      console.log('User earned reward of ', reward);
      callbacks?.onEarn?.(reward);
    });

    rewardedInterstitial.load();
  }, [adUnitId]);

  return { showAd };
}
