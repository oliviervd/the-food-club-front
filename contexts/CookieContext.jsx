// context/CookieContext.jsx

import {createContext, useContext, useEffect, useState} from 'react';

// create the context
const CookieContext = createContext();

// create a provider component
export const CookieProvider = ({children}) => {
   // default to null until we know the user's preference (avoids loading GA before choice)
   const [cookieAccepted, setCookieAccepted] = useState(null);
   const [initialized, setInitialized] = useState(false);

   useEffect(() => {
       const savedPrefernce = typeof window !== 'undefined' ? localStorage.getItem('cookieAccepted') : null;
       if (savedPrefernce !== null) {
           setCookieAccepted(savedPrefernce === 'true');
       } else {
           setCookieAccepted(null);
       }
       setInitialized(true);
   }, []);

   const acceptCookies = () => {
       setCookieAccepted(true);
       if (typeof window !== 'undefined') localStorage.setItem('cookieAccepted', 'true');
   }
    const declineCookies = () => {
       setCookieAccepted(false);
       if (typeof window !== 'undefined') localStorage.setItem('cookieAccepted', 'false');
    }

    return (
        <CookieContext.Provider value={{cookieAccepted, initialized, acceptCookies, declineCookies}}>
            {children}
        </CookieContext.Provider>
    )
};

export const useCookie = () => {
    return useContext(CookieContext);
}