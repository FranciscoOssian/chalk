import { renderHook, act } from '@testing-library/react-native';
import useRewardedInterstitialAd from './index.ts';

jest.mock('react-native-google-mobile-ads', () => {
  return {
    RewardedInterstitialAd: {
      createForAdRequest: jest.fn(() => ({
        addAdEventListener: jest.fn(),
        load: jest.fn(),
        show: jest.fn(),
      })),
    },
    RewardedAdEventType: {
      LOADED: 'loaded',
      EARNED_REWARD: 'earned_reward',
    },
  };
});

describe('useRewardedInterstitialAd', () => {
  it('should show an ad', async () => {
    const adUnitId = 'YOUR_AD_UNIT_ID';
    const { result } = renderHook(() => useRewardedInterstitialAd(adUnitId));
    const { showAd } = result.current;

    // Simulate ad load
    await act(async () => {
      showAd();
    });
  });
});
