import React from "react";
import NavBar from "./navbar.jsx";

const NavMenu = () => {
    return(
        <div>
            <div className={"sticky-nav__menu"}>
                <div style={{background: "transparent", marginTop: "35vh"}}>
                    <h1>MAP</h1>
                    <h1>TOP LIST</h1>
                    <h1>ABOUT</h1>
                </div>
            </div>
        </div>
    )
}

export default NavMenu

