import React from "react";
import Logo from "./logo.jsx";
import NavBar from "./navbar.jsx";

const Header = (props) => {

    return(
        <div className={"header--container"}>
            <Logo></Logo>
            <p className={"header--slug"}>{props.slug}</p>
            <NavBar/>
        </div>
    )
}

export default Header