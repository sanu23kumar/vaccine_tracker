import Geocoder from '@timwangdev/react-native-geocoder';
import { useEffect, useState } from 'react';
import { PermissionsAndroid } from 'react-native';
import GetLocation from 'react-native-get-location';

const useLocation = () => {
  const [postalCode, setPostalCode] = useState('');
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
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  useEffect(() => {
    getLocation();
  }, []);
  return postalCode;
};
export default useLocation;
