import * as React from "react";
import Header from "../elements/header"
import { fetchAPI } from "../utils/utils.jsx";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import CategoryList from "../elements/categoryList";
import Map from "../elements/map"
const Desktop = () => {
    let _categories;
    let _cats = [];

    const nav = useNavigate();
    const [showIntro, setShowIntro] = useState(true); // on first load, show welcome screen.
    const [category, setCategory] = useState(null); // category chosen to filter places

    try {
        _categories = fetchAPI("categories");
        _cats = _categories["docs"];
    } catch (e) {
        console.log(e);
    }
    return(
        <>
            <Map/>
            <header style={{backgroundColor: "transparent"}}>
                <nav className={"desktop-UI_nav"}>
                    <a>about</a>
                    <a>subscribe</a>
                    <a>nl</a>
                </nav>
            </header>
            <div className={"desktop-UI_categories"} >
                <CategoryList categories={_cats}/>
            </div>
        </>
    )
}

export default Desktop