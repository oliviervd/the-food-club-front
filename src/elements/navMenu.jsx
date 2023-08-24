import React from "react";
import NavBar from "./navbar.jsx";
import {useNavigate} from "react-router-dom";
import _hamburger from "./images/Hamburger.png";

const NavMenu = (props) => {

    const nav = useNavigate()
    function navigateTo(destination) {
        navigate("")
    }

    return(
        <div>
            <div className={"sticky-nav__menu"}>
                <div className={"sticky-nav-header"}>
                    <img className={"sticky-nav__hamburger"} src={_hamburger} onClick={props.setOpenMenu(false)}/>
                </div>
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

