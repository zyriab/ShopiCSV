import { useState, useEffect } from 'react';

export default function useDetectScreenSize() {
  const [isXs, setIsXs] = useState(false);
  const [isSm, setIsSm] = useState(false);
  const [isMd, setIsMd] = useState(false);
  const [isLg, setIsLg] = useState(false);
  const [isXl, setIsXl] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsXs(matchMedia('(min-width: 0px) AND (max-width: 599px)').matches);
      setIsSm(matchMedia('(min-width: 600px) AND (max-width: 899px)').matches);
      setIsMd(matchMedia('(min-width: 900px) AND (max-width: 1199px)').matches);
      setIsLg(
        matchMedia('(min-width: 1200px) AND (max-width: 1535px)').matches
      );
      setIsXl(matchMedia('(min-width: 1536px)').matches);
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isXs,
    isSm,
    isMd,
    isLg,
    isXl
  };
}
