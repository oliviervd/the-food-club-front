import React from "react";
import Header from "../elements/header.jsx";
import NavBar from "../elements/navbar.jsx"

const TopList = () => {
    return(
        <div className={"container BG_pink"}>
            <Header pageTitle={"Top List"}/>
            <NavBar />
            <div className={"list-box"}>
                <div className={"list-box__element"}>
                    <h1 className={"list-box__header"}>friday without reservations</h1>
                </div>
                <div className={"list-box__element"}>
                    <h1 className={"list-box__header"}>hangover food</h1>
                </div>
                <div className={"list-box__element"}>
                    <h1 className={"list-box__header"}>category 5</h1>
                </div>
                <div className={"list-box__element"}>
                    <h1 className={"list-box__header"}>hangover food</h1>
                </div>
                <div className={"list-box__element"}>
                    <h1 className={"list-box__header"}>hangover food</h1>
                </div>
                <div className={"list-box__element"}>
                    <h1 className={"list-box__header"}>hangover food</h1>
                </div>
            </div>
        </div>
    )
}

export default TopList
