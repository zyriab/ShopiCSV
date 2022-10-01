import { useState, useEffect } from 'react';
import { User } from '@auth0/auth0-react';
import { generateSlug } from 'random-word-slugs';

export function useAuth0() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const slug = generateSlug();

    setIsAuthenticated(true);
    setUser({
      nickname: slug,
      name: `${slug} Mc${slug}`,
      email: `${slug}@metaoist.io`,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isAuthenticated,
    user,
  };
}
