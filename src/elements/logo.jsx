import React from "react";
import _im from "./images/Untitled_Artwork.png"
import {useNavigate} from "react-router-dom";

const Logo = () => {

    const nav = useNavigate()

    return(
        <div>
           <img onClick={()=>nav("/categories")} className={"header--logo"} src={_im}/>
        </div>
    )
}

export default Logo;