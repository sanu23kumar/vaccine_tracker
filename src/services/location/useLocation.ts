import Geocoder from '@timwangdev/react-native-geocoder';
import { useState } from 'react';
import { PermissionsAndroid, ToastAndroid } from 'react-native';
import GetLocation from 'react-native-get-location';

const useLocation = () => {
  const [postalCode, setPostalCode] = useState('');
  const [isLoading, setIsLoading] = useState(-1);
  const getLocation = async () => {
    let granted;
    try {
      granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Vaccine Tracker Location Permission',
          message:
            'Vaccine Tracker needs access to your location ' +
            'so you can track vaccine centers.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setIsLoading(1);
        ToastAndroid.show('Fetching your current location', ToastAndroid.SHORT);
        const location = await GetLocation.getCurrentPosition({
          enableHighAccuracy: false,
          timeout: 15000,
        });
        const geocodedLocation = await Geocoder.geocodePosition({
          lat: location.latitude,
          lng: location.longitude,
        });
        console.log('The location is: ', geocodedLocation);
        setPostalCode(geocodedLocation[0]?.postalCode);
      } else {
        ToastAndroid.show('Permission denied', ToastAndroid.SHORT);
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
      ToastAndroid.show('Could not get your location', ToastAndroid.SHORT);
    }
    setIsLoading(0);
  };
  return { postalCode, isLoading, getLocation };
};
export default useLocation;
