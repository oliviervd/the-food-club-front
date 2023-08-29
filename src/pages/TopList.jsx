import React, {useEffect, useState} from "react";
import Header from "../elements/header_A.jsx";
import NavBar from "../elements/navbar.jsx"
import {useNavigate, useParams} from "react-router-dom";
import GridUI from "../elements/images/Grid_Dense.png"; // drawn grid in background

import {fetchAPI} from "../utils/utils.jsx";

const TopList = () => {

    // onLoad scroll to top.
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])


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
        console.log(_list)
        // filter based on category
        for (let i=0; i<_list["docs"].length; i++) {
            for(let x = 0; x <_list["docs"][i]["category"].length; x++){
                console.log(_list["docs"][i]["category"])
                if (_list["docs"][i]["category"][x]["categoryTitle"] === id.id) {
                    // if same category push venue to new list.
                    _listFiltered.push(_list["docs"][i])
                }
            }
        }
        //console.log(_listFiltered)
    } catch (e) {}

    return(
        <div className={"container BG_pink"}>
            <Header pageTitle={""}/>
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
                    let _im
                    if(venue.media) {
                        _im = venue.media.url
                    } else {
                        _im = ""
                    }
                    console.log(_im)
                    return(
                        <div>
                            <div className={"toplist--image_container"}>
                                <div>
                                    <div>
                                        <div className={"toplist--image"}>
                                            <img onClick={()=>nav(`/venue/${venue.venueName}`)} className={"toplist--image_img"} src={_im}/>
                                            <h2 onClick={()=>nav(`/venue/${venue.venueName}`)} className={"toplist--venue_title"}>{venue.venueName}</h2>
                                        </div>
                                    </div>
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
