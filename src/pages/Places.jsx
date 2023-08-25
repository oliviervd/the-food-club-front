import React from "react";

import Map from "../elements/map.jsx";
import Navbar from "../elements/navbar.jsx";
import Logo from "../elements/logo.jsx";
import _im from "../elements/images/Untitled_Artwork.png";

const Places = () => {
    return(
        <div>
            <img onClick={()=>nav("/categories")} className={"map--ui_logo"} src={_im}/>
            <Map/>
        </div>
    )
}

export default Places