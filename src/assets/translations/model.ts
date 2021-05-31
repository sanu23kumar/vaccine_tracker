export enum TranslationKeys {
  HOME_SCREEN_TITLE = 'HOME_SCREEN_TITLE',
  NOTIFICATION_SCREEN_TITLE = 'NOTIFICATION_SCREEN_TITLE',
  SETTINGS_SCREEN_TITLE = 'SETTINGS_SCREEN_TITLE',
}

export interface TranslationModel {
  // Home screen
  [TranslationKeys.HOME_SCREEN_TITLE]: string;

  // Notification screen
  [TranslationKeys.NOTIFICATION_SCREEN_TITLE]: string;

  // Settings screen
  [TranslationKeys.SETTINGS_SCREEN_TITLE]: string;
}
