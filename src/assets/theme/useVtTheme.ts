import { useContext } from 'react';
import { ThemeContext } from '.';

const useVtTheme = () => {
  const colors = useContext(ThemeContext);
  return colors;
};

export default useVtTheme;
