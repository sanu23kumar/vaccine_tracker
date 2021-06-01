import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from '@react-native-firebase/admob';
import { useEffect, useState } from 'react';

const useRewardAd = () => {
  const [loaded, setLoaded] = useState(false);
  const [earned, setEarned] = useState<number>(-1);
  const rewarded = RewardedAd.createForAdRequest(adUnitId);

  useEffect(() => {
    const eventListener = rewarded.onAdEvent((type, error, reward) => {
      if (type === RewardedAdEventType.LOADED) {
        console.log('Reward loaded');
        showRewardAd();
        setLoaded(true);
      } else if (type === RewardedAdEventType.EARNED_REWARD) {
        console.log('User earned reward of ', reward);
        setEarned(1);
      } else {
        setEarned(0);
      }
    });

    // Unsubscribe from events on unmount
    return () => {
      eventListener();
    };
  }, []);

  const loadAd = () => {
    try {
      rewarded.load();
    } catch (e) {
      console.error('Could not load the ad because: ', e);
    }
  };

  return { loadAd, showRewardAd, loaded, earned };
};

export default useRewardAd;
