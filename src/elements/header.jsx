import React from "react";
import Logo from "./logo.jsx";
import {useNavigate} from "react-router-dom";

const Header = (props) => {

    const nav = useNavigate()

    return(
        <div className={"header--container"}>
            <Logo></Logo>
            <div>
                <h2 onClick={()=>nav("/")} className={"header--button_map"}>map</h2>
                <p className={"header--slug"}>{props.slug}</p>
            </div>
        </div>
    )
}

export default Header