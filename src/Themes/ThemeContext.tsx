import React, { createContext, useState, useContext } from 'react';

// Temaları burada tanımlıyoruz ki her yerde aynı renkleri kullanalım
export const Colors = {
  dark: {
    background: '#000000',
    backgroundSecondary: '#120B00', // Siyaha çok yakın çok koyu turuncu
    text: '#FFFFFF',
    primary: '#FF8C00', // Turuncu
    inputBg: 'rgba(255, 140, 0, 0.05)', // Çok şeffaf turuncu
    inputBorder: '#333333',
  },
  light: {
    background: '#FFFFFF',
    backgroundSecondary: '#FFF9F2', // Beyaza çok yakın çok açık turuncu
    text: '#000000',
    primary: '#FF8C00', // Turuncu (Light modda da turuncuyu vurgu yapalım)
    inputBg: '#FDFDFD',
    inputBorder: '#EEEEEE',
  },
};

const ThemeContext = createContext({
  isDarkMode: true,
  toggleTheme: () => {},
  theme: Colors.dark,
});

export const ThemeProvider = ({ children }: any) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
