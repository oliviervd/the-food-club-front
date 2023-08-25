import React from "react";
import Logo from "./logo.jsx";
import {useNavigate} from "react-router-dom";
import _map from "./images/map.png"
import _list from "./images/list.png"

const Header = (props) => {

    const nav = useNavigate()

    return(
        <div className={"header--container"}>
            <Logo></Logo>
            <div>
                <div style={{display: "flex", gap: "3px"}}>
                    <div className={"header--button_container"}>
                        <img onClick={()=>nav("/")} className={"header--button"} src={_map}></img>
                    </div>
                    <div className={"header--button_container"}>
                        <img onClick={()=>nav("/categories")} className={"header--button"} src={_list}></img>
                    </div>
                </div>
                <p className={"header--slug"}>{props.slug}</p>
            </div>
        </div>
    )
}

export default Header