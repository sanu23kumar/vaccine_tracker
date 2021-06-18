import { AppRegistry, LogBox } from 'react-native';
import { name as appName } from './app.json';
import CentresTask from './CentresTask';
import App from './src/root';
LogBox.ignoreAllLogs(true);
AppRegistry.registerHeadlessTask('CentresTask', () => CentresTask);
AppRegistry.registerComponent(appName, () => App);
