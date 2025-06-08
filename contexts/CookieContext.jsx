// context/CookieContext.jsx

import {createContext, useContext, useEffect, useState} from 'react';

// create the context
const CookieContext = createContext();

// create a provider component
export const CookieProvider = ({children}) => {
   const [cookieAccepted, setCookieAccepted] = useState(true);

   useEffect(() => {
       const savedPrefernce = localStorage.getItem('cookieAccepted');
       if (savedPrefernce !== null) {
           setCookieAccepted(savedPrefernce === 'true');
       }
   }, []);

   const acceptCookies = () => {
       setCookieAccepted(true);
       localStorage.setItem('cookieAccepted', 'true');
   }
    const declineCookies = () => {
       setCookieAccepted(false);
       localStorage.setItem('cookieAccepted', 'false');
    }

    return (
        <CookieContext.Provider value={{cookieAccepted, acceptCookies, declineCookies}}>
            {children}
        </CookieContext.Provider>
    )
};

export const useCookie = () => {
    return useContext(CookieContext);
}