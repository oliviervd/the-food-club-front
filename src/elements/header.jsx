import React from "react";
import Logo from "./logo.jsx";

const Header = (props) => {
    return(
        <div className={"header--container"}>
            <Logo></Logo>
            <p className={"header--slug"}>{props.slug}</p>
        </div>
    )
}

export default Header