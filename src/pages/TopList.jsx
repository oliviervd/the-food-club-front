import React, {useState} from "react";
import Header from "../elements/header.jsx";
import NavBar from "../elements/navbar.jsx"
import NavMenu from "../elements/navMenu.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {fetchAPI} from "../utils/utils.jsx";
import GridUI from "../elements/images/Grid.png";

const TopList = () => {

    const [openNavMenu, setOpenNavMenu] = useState(false);

    let _categories;
    let _cats = [];

    const nav = useNavigate()


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
            <br/>

            <img className={"UI-GRID"} src={GridUI}/>

            <div className={"categories--container"}>
                <div>
                    <h2 className={"toplist--title_font"}>
                        CHOLESTEROL-LOL
                    </h2>
                    <p></p>
                </div>
                <div className={"toplist--image_container"}>
                    <div className={"toplist--image"}>
                    </div>
                </div>

                <br/>
            </div>
        </div>

    )
}

export default TopList
