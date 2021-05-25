import { AppRegistry, LogBox } from 'react-native';
import { name as appName } from './app.json';
import App from './src/root';
LogBox.ignoreAllLogs(true);
AppRegistry.registerComponent(appName, () => App);
