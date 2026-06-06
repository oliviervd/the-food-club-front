'use client';

import { useEffect } from 'react';
import { useCookie } from '../contexts/CookieContext.jsx';
import { GoogleAnalytics } from '@next/third-parties/google';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const AnalyticsGate = () => {
    const { cookieAccepted } = useCookie();

    if (!cookieAccepted || !GA_ID) return null;

    return <GoogleAnalytics gaId={GA_ID} />;
};

export default AnalyticsGate;