import React from "react";
import navbar from "../elements/navbar.jsx";
import Header from "../elements/header.jsx";
import GridUI from "../elements/images/Grid_Dense.png"
import {fetchAPI} from "../utils/utils.jsx";
import {useNavigate} from "react-router-dom";


const Categories = () => {

    let _categories;
    let _cats = [];

    const nav = useNavigate()

    try {
        _categories = fetchAPI('categories');
        _cats = _categories["docs"];
    } catch (e) {console.log(e)}

    return(
        <div className={"container"}>
            <Header slug={"Eat like locals"} title={"Food Club"}></Header>
            <br/>

            <img className={"UI-GRID"} src={GridUI}/>
            <div className={"categories--container"}>
                {_cats.map(cat=>{
                    return(
                        <div>
                            <h2 className={"categories--title_font"} onClick={()=>nav(`/toplist/${cat["categoryTitle"]}`)}>
                                {cat["categoryTitle"].toUpperCase()}
                            </h2>
                            <p>{cat["categorySubTitle"]}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Categories