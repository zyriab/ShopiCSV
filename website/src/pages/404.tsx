import * as React from 'react';
import { Link, HeadFC } from 'gatsby';
import NavBar from '../components/NavBar/NavBar';
import Footer from '../components/Footer/Footer';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { lightTheme } from '../utils/theme.utils';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import '../utils/translations/translations';

const NotFoundPage = () => {
  const theme = createTheme(lightTheme);

  return (
    <main>
      <ThemeProvider theme={theme}>
        <NavBar />
        <Container sx={{height: '68vh'}}>
          <Typography variant="h3">Page not found</Typography>
          <br />
          <br />
          <Typography variant="subtitle1" component="p">
            Sorry 😔, we couldn't find what you were looking for.
            <br />
            <br />
            <Link to="/">Go home</Link>.
          </Typography>
        </Container>
        <Footer />
      </ThemeProvider>
    </main>
  );
};

export default NotFoundPage;

export const Head: HeadFC = () => <title>Not found</title>;
