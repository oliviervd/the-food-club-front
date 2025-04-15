'use client'

import Header from "../../components/Header.jsx";
import {useEffect, useState} from "react";
import {fetchAPI} from "../../utils/utils.jsx";
import serialize from "../../utils/serialize.jsx";

const Page = ({}) => {

    const [about, setAbout] = useState([]);

    //todo: layout ABOUT

    return(
        <div>
            <Header landing={true}/>
            <div className={"about"}>
                <p className={"italic bold"}>Rule #1 don’t talk about foodclub…</p>
                <p className={"italic"}>but ok, rules are meant to be broken!</p>
            </div>
        </div>
    )
}
export default Page;