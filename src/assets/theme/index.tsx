import useStore from 'potli/useStore';
import React, { createContext } from 'react';
import { useColorScheme } from 'react-native';
import { DarkTheme, LightTheme } from './themes';

export const ThemeContext = createContext({ colors: LightTheme });
const ThemeProvider = ({ children }) => {
  const scheme = useColorScheme();
  const { data: userTheme } = useStore('THEME');
  const theme =
    (userTheme?.name ?? scheme) === 'light' ? LightTheme : DarkTheme;
  console.log(userTheme, scheme);
  return (
    <ThemeContext.Provider value={{ colors: theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
