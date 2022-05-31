import { useState, useEffect } from 'react';

export default function useDetectScreenSize() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [is4K, setIs4K] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(matchMedia('(max-width: 480px)').matches);
      setIsTablet(matchMedia('(max-width: 800px)').matches);
      setIsDesktop(matchMedia('(min-width: 1024px)').matches);
      setIs4K(matchMedia('(min-width: 2560px)').matches);
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop,
    is4K,
  };
}
