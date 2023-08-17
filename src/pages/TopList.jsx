import React, {useState} from "react";
import Header from "../elements/header.jsx";
import NavBar from "../elements/navbar.jsx"
import NavMenu from "../elements/navMenu.jsx";

const TopList = () => {

    const [openNavMenu, setOpenNavMenu] = useState(false);

    if(openNavMenu){
        document.body.style.overflow = 'hidden';
        window.scrollTo({top:0});
    }

    if(!openNavMenu){
        document.body.style.overflow = 'unset';
    }

    return(
        <div className={"container BG_pink"}>
            <Header pageTitle={""}/>
            <NavBar openMenu={setOpenNavMenu} isOpenMenu={openNavMenu}/>
            <div className={"list-box"}>
                <div className={"list-box__element"}>
                    <h1 className={"list-box__header"}></h1>
                </div>
                <div className={"list-box__element"}>
                    <h1 className={"list-box__header"}></h1>
                </div>
                <div className={"list-box__element"}>
                    <h1 className={"list-box__header"}></h1>
                </div>
                <div className={"list-box__element"}>
                    <h1 className={"list-box__header"}></h1>
                </div>
                <div className={"list-box__element"}>
                    <h1 className={"list-box__header"}></h1>
                </div>
                <div className={"list-box__element"}>
                    <h1 className={"list-box__header"}></h1>
                </div>
            </div>
            {openNavMenu &&
                <NavMenu/>
            }
        </div>

    )
}

export default TopList
