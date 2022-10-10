import * as React from 'react';
import type { HeadFC } from 'gatsby';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import i18next from 'i18next';
import NavBar from '../components/NavBar/NavBar';
import MainContent from '../components/MainContent/MainContent';
import Footer from '../components/Footer/Footer';
import { lightTheme } from '../utils/theme.utils';
import '../utils/translations/translations';

import '../style.css';

export default function IndexPage() {
  const theme = createTheme(lightTheme);

  return (
    <main>
      <GoogleReCaptchaProvider
        reCaptchaKey="6LcUv2kiAAAAAOReArJsxu9AUQbhMeCkPBalSL9b"
        language={i18next.resolvedLanguage}>
        <ThemeProvider theme={theme}>
          <NavBar />
          <MainContent />
          <Footer />
        </ThemeProvider>
      </GoogleReCaptchaProvider>
    </main>
  );
}

export const Head: HeadFC = () => <title>ShopiCSV - Time to ditch Excel</title>;
