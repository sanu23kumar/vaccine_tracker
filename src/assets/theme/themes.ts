export interface VtTheme {
  TEXT: string;
  TEXT_LIGHT: string;
  TEXT_DISABLED: string;
  BACKGROUND: string;
  PRIMARY: string;
  PRIMARY_LIGHT: string;
  SECONDARY: string;
  TERTIARY: string;
}

export const LightTheme: VtTheme = {
  TEXT: '#333333',
  TEXT_LIGHT: '#888888',
  TEXT_DISABLED: '#BBBBBB',
  BACKGROUND: '#FFFFFF',
  PRIMARY: '#22CC88',
  PRIMARY_LIGHT: '#EFFFEF',
  SECONDARY: '#CC9922',
  TERTIARY: '#2288CC',
};

export const DarkTheme: VtTheme = {
  TEXT: '#DDDDDD',
  TEXT_LIGHT: '#AAAAAA',
  TEXT_DISABLED: '#888888',
  BACKGROUND: '#000000',
  PRIMARY: '#22CC88',
  PRIMARY_LIGHT: '#000f00',
  SECONDARY: '#CC9922',
  TERTIARY: '#2288CC',
};
