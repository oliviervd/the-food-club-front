import React, {useState} from "react";
import Header from "../elements/header.jsx";
import NavBar from "../elements/navbar.jsx"
import NavMenu from "../elements/navMenu.jsx";
import {useNavigate, useParams} from "react-router-dom";
import GridUI from "../elements/images/Grid_Dense.png"; // drawn grid in background

import {fetchAPI} from "../utils/utils.jsx";

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

    let _list
    let _listFiltered = [] // create empty array for filtered venues

    try {
        _list = fetchAPI('venue')
        // filter based on category
        for (let i=0; i<_list["docs"].length; i++) {
            if (_list["docs"][i]["category"]["categoryTitle"] == id.id) {
                // if same category push venue to new list.
                _listFiltered.push(_list["docs"][i])
            }
        }
        //console.log(_listFiltered)
    } catch (e) {}

    return(
        <div className={"container BG_pink"}>
            <Header pageTitle={""}/>
            <NavBar openMenu={setOpenNavMenu} isOpenMenu={openNavMenu}/>
            <br/>

            <img className={"UI-GRID"} src={GridUI}/>

            <div className={"categories--container"}>
                <div>
                    <h2 className={"toplist--title_font"}>
                        {id.id.toUpperCase()}
                    </h2>
                    <br/>
                </div>

                {_listFiltered.map(venue=>{
                    //console.log(venue)
                    return(
                        <div>
                            <div className={"toplist--image_container"}>
                                <div className={"toplist--image"}>
                                    <h2 className={"toplist--venue_title"}>{venue.venueName}</h2>
                                </div>
                            </div>
                            <br/>
                        </div>
                        )
                })}

                <br/>
            </div>
        </div>

    )
}

export default TopList
