import React from "react"
import {useNavigate} from "react-router-dom";
import _im from "/src/elements/Untitled_Artwork.png"
import GridUI from "../elements/Grid.png"


const Home = () => {

    const nav = useNavigate()

    return(
        <div className={"container home"} onClick={()=>nav("/categories")}>
            <img className={"UI-GRID"} src={GridUI}/>
            <div className={"vertical-center"}>
                <img className={"home--logo"} src={_im}/>
            </div>
            <div>
            </div>
        </div>
    )
}

export default Home


