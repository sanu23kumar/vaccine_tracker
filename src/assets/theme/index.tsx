import React, { createContext } from 'react';
import { useColorScheme } from 'react-native';
import { DarkTheme, LightTheme } from './themes';

export const ThemeContext = createContext({ colors: LightTheme });
const ThemeProvider = ({ children }) => {
  const scheme = useColorScheme();
  const theme = scheme === 'light' ? LightTheme : DarkTheme;
  return (
    <ThemeContext.Provider value={{ colors: theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
