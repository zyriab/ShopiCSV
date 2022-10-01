import { useState, useEffect } from 'react';
import { useAuth0 as useAuth0Original, User } from '@auth0/auth0-react';
import { generateSlug } from 'random-word-slugs';

export function useAuth0() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>();

  const auth0 = useAuth0Original();

  let isDemo = process.env.REACT_APP_ENV === 'demo';

  useEffect(() => {
    if (isDemo) {
      const slug = generateSlug();

      setIsAuthenticated(true);
      setUser({
        nickname: slug,
        name: `${slug} Mc${slug}`,
        email: `${slug}@metaoist.io`,
      });
    } else {
      setIsAuthenticated(auth0.isAuthenticated);
      setUser(auth0.user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth0.isAuthenticated, auth0.user]);

  return {
    ...auth0,
    isAuthenticated,
    user,
  };
}
