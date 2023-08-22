import React, {useState} from "react";
import Header from "../elements/header.jsx";
import NavBar from "../elements/navbar.jsx"
import NavMenu from "../elements/navMenu.jsx";
import {useParams} from "react-router-dom";

const TopList = () => {

    const [openNavMenu, setOpenNavMenu] = useState(false);

    if(openNavMenu){
        document.body.style.overflow = 'hidden';
        window.scrollTo({top:0});
    }

    if(!openNavMenu){
        document.body.style.overflow = 'unset';
    }

    //fetch id from URL param
    let id = useParams();
    console.log(id)


    return(
        <div className={"container BG_pink"}>
            <Header pageTitle={""}/>
            <NavBar openMenu={setOpenNavMenu} isOpenMenu={openNavMenu}/>
        </div>

    )
}

export default TopList
