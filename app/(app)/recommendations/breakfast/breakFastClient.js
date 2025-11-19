'use client'

import Header from "../../../../components/Header.jsx";
import ScrollToTop from "../../../../components/scrollToTop.jsx";
import Banner from "../../../../components/Banner.jsx";

const BreakFastClient = () => {
    return(
        <>
            <Header landing={true} interact={true}/>
            <ScrollToTop/>
            <Banner content={"Breakfast"} />
        </>
    )
}

export default BreakFastClient