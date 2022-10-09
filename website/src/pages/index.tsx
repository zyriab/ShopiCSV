import * as React from 'react';
import type { HeadFC } from 'gatsby';
import NavBar from '../components/NavBar/NavBar';
import MainContent from '../components/MainContent/MainContent';
import Footer from '../components/Footer/Footer';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { lightTheme } from '../utils/theme.utils';
import '../utils/translations/translations';

import '../style.css';

export default function IndexPage() {
  const theme = createTheme(lightTheme);

  return (
    <main>
      <ThemeProvider theme={theme}>
        <NavBar />
        <MainContent />
        <Footer />
      </ThemeProvider>
    </main>
  );
}

export const Head: HeadFC = () => <title>ShopiCSV - Time to ditch Excel</title>;
