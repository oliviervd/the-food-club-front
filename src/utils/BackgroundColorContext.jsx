import React, {createContext, useState, useEffect} from "react";
import {getCSSVariableValue} from "./utils.jsx";

const BackgroundColorContext = createContext();


const BackgroundColorProvider = ({children}) => {

    const [bgColor, setBgColor] = useState(() => {
        return localStorage.getItem('bgColor') || getCSSVariableValue('--pale-lemon-yellow');
    })

    useEffect(() => {
        // seva the color to local storage whenever it would chang
        localStorage.setItem('bgColor', bgColor)
        document.documentElement.style.backgroundColor = bgColor;
    }, [bgColor]);

    return(
        <BackgroundColorContext.Provider value={{bgColor, setBgColor}}>
            {children}
        </BackgroundColorContext.Provider>
    )
}

export {BackgroundColorContext, BackgroundColorProvider}
