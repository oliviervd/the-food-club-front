import React from "react";

const NavBar = (props) => {

    return(
        <div className={"sticky-nav"}>
            <div className={"sticky-nav__item"}>
                <div className={"sticky-nav__button"} onClick={()=>props.openMenu(!props.isOpenMenu)}>
                    <svg viewBox="0 0 23 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect id="menu-icon__b" x="0.763672" y="15.8491" width="21.8893" height="3.76579" rx="1.88289" fill="#eee3e2"></rect>
                        <rect id="menu-icon__m" x="0.763672" y="8.03137" width="21.8893" height="3.76579" rx="1.88289" fill="#eee3e2"></rect>
                        <rect id="menu-icon__t" x="0.763672" y="0.213867" width="21.8893" height="3.76579" rx="1.88289" fill="#eee3e2"></rect>
                    </svg>
                </div>
            </div>

        </div>
    )
}

export default NavBar