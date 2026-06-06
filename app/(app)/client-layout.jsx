// app/client-layout.jsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocationColorProvider } from '/contexts/LocationColorContext.jsx';
import { CookieProvider } from "/contexts/CookieContext.jsx";
import { UserProvider } from '/contexts/UserContext.jsx';
import { useState } from 'react';

import '/styles/fonts.css';
import '/styles/media.css';
import '/styles/home.css';
import '/styles/categories.css';
import '/styles/venue.css';
import '/styles/main.css';
import '/styles/about.css';
import 'leaflet/dist/leaflet.css';
import '/styles/map.css';
import '/styles/colors.css';
import '/styles/auth.css';
import CanonicalTag from "../../components/CanonicalTag.jsx";
import AnalyticsGate from "../../components/AnalyticsGate.jsx";

export default function ClientLayout({ children }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: Infinity,
                gcTime: 86400000,
                refetchOnWindowFocus: false,
            }
        }
    }));

    return (
        <QueryClientProvider client={queryClient}>
            <LocationColorProvider>
                <CookieProvider>
                    <UserProvider>
                        <AnalyticsGate />
                        {children}
                    </UserProvider>
                </CookieProvider>
            </LocationColorProvider>
        </QueryClientProvider>
    );
}