import admob, { MaxAdContentRating } from '@react-native-firebase/admob';
import { useEffect } from 'react';

const setupAdmob = () => {
  admob()
    .setRequestConfiguration({
      maxAdContentRating: MaxAdContentRating.PG,
      tagForChildDirectedTreatment: true,
      tagForUnderAgeOfConsent: true,
    })
    .then(() => {
      // Request config successfully set!
    });
};

const useAdmob = () => {
  useEffect(() => {
    setupAdmob();
  }, []);
};

export default useAdmob;
