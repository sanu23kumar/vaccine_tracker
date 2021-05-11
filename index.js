import {AppRegistry} from 'react-native';
import PushNotification from 'react-native-push-notification';
import {name as appName} from './app.json';
import App from './src/root';

PushNotification.configure({
  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log(notification);
  },
  requestPermissions: true,
});
AppRegistry.registerComponent(appName, () => App);
