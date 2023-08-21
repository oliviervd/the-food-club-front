import React from "react"
import {useNavigate} from "react-router-dom";
import _im from "/src/elements/Untitled_Artwork.png"


const Home = () => {

    const nav = useNavigate()

    return(
        <div className={"container home"}>
            <div className={"vertical-center"}>
                <img className={"home--logo"} src={_im}/>
            </div>
        </div>
    )
}

export default Home


