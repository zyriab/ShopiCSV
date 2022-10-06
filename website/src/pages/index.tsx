import * as React from 'react';
import type { HeadFC } from 'gatsby';
import NavBar from '../components/NavBar/NavBar';

import '../style.css';

export default function IndexPage() {
  return (
  <main>
    <NavBar />
  </main>);
}

export const Head: HeadFC = () => <title>Home Page</title>;
