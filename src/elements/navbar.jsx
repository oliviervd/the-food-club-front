import React from "react";
import _hamburger from "./images/Hamburger.png"


const NavBar = (props) => {

    return(
        <div className={"sticky-nav"}>
            <img className={"sticky-nav__hamburger"} src={_hamburger}/>
        </div>
    )
}

export default NavBar