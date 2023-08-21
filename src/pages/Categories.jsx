import React from "react";
import navbar from "../elements/navbar.jsx";
import Header from "../elements/header.jsx";

import GridUI from "../elements/Grid.png"

const Categories = () => {
    return(
        <div className={"container"}>
            <Header slug={"Eat like locals"} title={"Food Club"}></Header>
            <img className={"UI-GRID"} src={GridUI}/>
        </div>
    )
}

export default Categories