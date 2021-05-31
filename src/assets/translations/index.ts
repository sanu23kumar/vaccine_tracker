import LocalizedStrings from 'react-native-localization';
import en from './en';
import { TranslationModel } from './model';

let translations = new LocalizedStrings<TranslationModel>({
  en: en,
});

export default translations;
