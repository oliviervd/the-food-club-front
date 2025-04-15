// app/layout.jsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LocationColorProvider } from '../contexts/LocationColorContext.jsx'
import { useState } from 'react'

import { AuthProvider } from '../contexts/AuthContext';
import AuthGuard from '../components/AuthGuard';

import '/styles/fonts.css'
import '/styles/media.css'
import '/styles/home.css'
import '/styles/categories.css'
import '/styles/venue.css'
import '/styles/main.css'
import '/styles/about.css'
import 'leaflet/dist/leaflet.css'
import '/styles/map.css'
import '/styles/colors.css'

export default function RootLayout({ children }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: Infinity,
                cacheTime: 86400000,
                refetchOnWindowFocus: false,
            }
        }
    }));

    return (
        <html lang="en">
        <body>
        <QueryClientProvider client={queryClient}>
            <LocationColorProvider>
                <AuthProvider>
                    <AuthGuard>
                        {children}
                    </AuthGuard>
                </AuthProvider>
            </LocationColorProvider>
        </QueryClientProvider>
        </body>
        </html>
    );
}