import Header from "../elements/Header.jsx";
import Footer from "../elements/Footer.jsx";
import "../style/header.css"
import "../style/fonts.css"

import CategoryList from "../elements/CategoryList.jsx";
import DesktopHome from "./desktop/desktopHome.jsx";
import {fetchAPI, scrollTo} from "../utils/utils.jsx";
import {useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import {useMediaQuery} from "@uidotdev/usehooks";
import {useNavigate} from "react-router-dom";
import LuckyButton from "../elements/luckyButton.jsx";

import {useScrollPosition} from "../hooks/useScrollPosition.jsx";
import Marquee from "react-fast-marquee";

// todo : improve loading speed
// todo: add locales

const Home = () => {

    // fetch data
    const [categoryList, setCategoryList] = useState([]);
    const nav = useNavigate();
    const [target, setTarget] = useState(null);
    const [location, setLocation] = useState(null);
    const isSmall = useMediaQuery("(max-width: 600px)");
    const isBig = useMediaQuery("(min-width: 1400px)");
    const scrollPosition = useScrollPosition();

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (scrollPosition > 150) {
            setVisible(true); // Show the LuckyButton when scrollPosition is more than 100
        } else {
            setVisible(false); // Hide the LuckyButton when scrollPosition is less than 100
        }
    }, [scrollPosition]);

    // Add animation classes based on visibility state
    const classNames = visible ? "slide-in" : "slide-out";

    const {data: list, isLoading, error} = useQuery(["lists"], ()=> fetchAPI('lists','en'))

    useEffect(() => {
        const getLists = async() => {
            const cat = await fetchAPI("lists", "en");
            setCategoryList(cat)
        }
        getLists();
    }, []);

    useEffect(()=>{
        scrollTo(target)
    },[target])

    if (isLoading) return <div></div>;
    if (error) return <div>Error: {error.message}</div>;

    // render component
    return(
        <div>
            <Header selectedTab={"lists"} landing={true} interact={true} setLocation={setLocation} location={location} setTarget={setTarget} venue={false}></Header>
            {isSmall && categoryList &&
                <div>
                   {/* <Marquee className={"banner"} speed={30} pauseOnHover={false} gradient={false} autoFill={true}>
                        <h3>#1 Don't talk about foodclub - but psssst…. please spread the word! — #2 The foodclub is
                            a curated space focused on quality, featuring only restaurants we've personally visited.
                            — #3 The foodclub is, and will always be, a positive space celebrating local culinary
                            excellence. There is no place for negativity. —</h3>
                    </Marquee>*/}
                    <section className={"home__container"}>
                        <div>
                            <section style={{padding: "10px 0"}}>
                                <h2 className={"subtitle"}> FOOD CLUB loves lists. That's why we created some specially
                                    for
                                    you.
                                    From healthy snacks to absurdly comforting food, the order is yours.</h2>
                            </section>
                            <CategoryList data={categoryList}/>
                            <div className={`fixed-wrapper ${classNames}`}>
                                <LuckyButton nav={nav}/>
                            </div>

                        </div>
                    </section>
                </div>

            }
            {!isSmall && categoryList && categoryList.docs &&
                <DesktopHome categories={categoryList.docs[0].items}/>
            }
            <Footer position={isSmall}/>
        </div>
    )
}
export default Home;