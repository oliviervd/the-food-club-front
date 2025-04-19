import {useEffect, useState} from "react";
import {useCookie} from "../contexts/CookieContext.jsx";

const CookiePopUp = () => {
    const { cookieAccepted, acceptCookies, declineCookies } = useCookie();

    if (cookieAccepted !== null) return null;

    return(
        <div className={"cookie-popup"}>
            <p>We also don't like cookies, well... we do like the biscuits. But in order to make your Food Club experience as smooth as possible, it is better to accept our cookies. If you rather don't, that's also perfectly fine with us! </p>
            <div className={"cookie-popup-buttons"}>
                <p onClick={acceptCookies}>accept cookies 🍪</p>
                <p onClick={declineCookies}>decline cookies 🥠</p>
            </div>
        </div>
    )
}

export default CookiePopUp