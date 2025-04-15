'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('authenticated');
        if (stored === 'true') {
            setAuthenticated(true);
        }
    }, []);

    const login = (password) => {
        if (password === process.env.NEXT_PUBLIC_FC_DEV_PASSWORD) {
            localStorage.setItem('authenticated', 'true');
            setAuthenticated(true);
            return true;
        } else {
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ authenticated, login }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);