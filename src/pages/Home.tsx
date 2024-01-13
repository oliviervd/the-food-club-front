import * as React from "react";
import {useMediaQuery} from "react-responsive";
import Categories from "./Categories"
import Desktop from "../UI/Desktop"

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
                <Categories/>
            }
        </>
    )
}
export default Home;