/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {initI18n} from '@core/i18n';

initI18n().then(() => {
  AppRegistry.registerComponent(appName, () => App);
});
