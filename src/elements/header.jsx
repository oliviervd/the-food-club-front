import React from "react";
import Logo from "./logo.jsx";

const Header = (props) => {

    return(
        <div className={"header--container"}>
            <Logo></Logo>
            <div>
                <h2 className={"header--button_map"}>map</h2>
                <p className={"header--slug"}>{props.slug}</p>
            </div>
        </div>
    )
}

export default Header