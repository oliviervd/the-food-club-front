"use client";

import { GoogleAnalytics } from '@next/third-parties/google';
import { useCookie } from '/contexts/CookieContext.jsx';
import { useEffect, useState } from 'react';

// Render Google Analytics only after user consent.
// This prevents loading https://www.googletagmanager.com/gtag/js before acceptance,
// improving FCP/LCP and complying with privacy.
export default function AnalyticsGate() {
  const { cookieAccepted, initialized } = useCookie();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch; only decide on client after mount and after cookie initialization
  if (!mounted || !initialized) return null;

  if (cookieAccepted === true) {
    return <GoogleAnalytics gaId="G-MT6KZBM1XN" />;
  }

  return null;
}
