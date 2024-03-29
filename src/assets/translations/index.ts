import LocalizedStrings from 'react-native-localization';
import en from './en';
import hi from './hi';
import { TranslationModel } from './model';

let translations = new LocalizedStrings<TranslationModel>({
  en: en,
  hi: hi,
});

export default translations;
