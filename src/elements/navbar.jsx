import React, {useState} from "react";
import _hamburger from "./images/Hamburger.png"
import _floaty from "./images/Hamburger-case.png"
import {useNavigate} from "react-router-dom";
import NavMenu from "./navMenu.jsx";


const NavBar = (props) => {

    const nav = useNavigate()

    // open-close menu
    const [openMenu, setOpenMenu] = useState(false);


    return(
        <div>
          {/*  <div className={"sticky-nav-float"}>
                <img className={"sticky-nav__hamburger"} src={_floaty}/>
            </div>*/}
            <div className={"sticky-nav-header"}>
                <img className={"sticky-nav__hamburger"} src={_hamburger}/>
            </div>

        </div>

    )
}

export default NavBar