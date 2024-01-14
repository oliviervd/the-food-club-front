import * as React from "react";
import {useMediaQuery} from "react-responsive";
import Categories from "./Categories"
import Desktop from "../UI/Desktop"
import Mobile from "../UI/Mobile"
import Header from "../elements/header"

const Home = () => {

    const isDesktopOrLaptop = useMediaQuery({
        query: '(min-width: 601px)'
    })

    const isMobile = useMediaQuery({ query: '(max-width: 600px)' })

    return(
        <>
            {isDesktopOrLaptop &&
                <Desktop></Desktop>
            }
            {isMobile &&
                <Categories></Categories>
            }
        </>
    )
}
export default Home;