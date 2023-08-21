import React from "react";
import NavBar from "./navbar.jsx";
import {useNavigate} from "react-router-dom";

const NavMenu = () => {

    const nav = useNavigate()
    function navigateTo(destination) {
        navigate("")
    }

    return(
        <div>
            <div className={"sticky-nav__menu"}>
                <div style={{background: "transparent", marginTop: "35vh"}}>
                    <h1 className={"sticky-nav__menu-item"} onClick={()=>{}}>MAP</h1>
                    <h1 className={"sticky-nav__menu-item"} onClick={()=> nav("")}>TOP LIST</h1>
                    <h1 className={"sticky-nav__menu-item"} onClick={()=>{}}>ABOUT</h1>
                </div>
            </div>
        </div>
    )
}

export default NavMenu

