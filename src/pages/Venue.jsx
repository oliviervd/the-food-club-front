import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import Header from "../elements/header.jsx";
import NavBar from "../elements/navbar.jsx";
import GridUI from "../elements/images/Grid_Dense.png";

const Venue = () => {

    // fetch content based on id
    let id = useParams(); // use id to set content

    // onLoad scroll to top.
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return(
        <div className={"container BG_pink"}>
            <Header slug={"Eat like locals"} title={"Food Club"}></Header>
            <NavBar/>
            <br/>
            <img className={"UI-GRID"} src={GridUI}/>

            <div className={"venue--container"}>
                <h2 className={"venue--title"}>
                    {id.id.toUpperCase()}
                </h2>
                <br/>

                <div className={"venue--container_content"}>
                    <img/>
                    <div className={"venue--lightbox"}>

                    </div>
                </div>

            </div>


        </div>
    )
}
export default Venue