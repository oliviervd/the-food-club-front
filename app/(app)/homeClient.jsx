'use client'

import Header from "/components/Header.jsx";
import "../../styles/header.css"
import "../../styles/fonts.css"

import CategoryList from "/components/CategoryList.jsx";
import DesktopHome from "./pages/desktop/desktopHome.jsx";
import {fetchAPI, scrollTo} from "/utils/utils.jsx";
import {useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import LuckyButton from "/components/luckyButton.jsx";
import {useScrollPosition} from "/hooks/useScrollPosition.jsx";
import { useRouter } from 'next/navigation';
import {useIsMobile} from "/hooks/isMobile.jsx";
import ScrollToTop from "/components/scrollToTop.jsx";
import CookiePopUp from "/components/Cookie-Pop-Up.jsx";

// todo: add locales

const HomeClient = () => {

    // fetch data
    const [target, setTarget] = useState(null);
    const [location, setLocation] = useState(null);
    const scrollPosition = useScrollPosition();
    const router = useRouter();

    const isMobile = useIsMobile();
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
    const { data: categoryList, isLoading, error } = useQuery({
        queryKey: ["categories"],
        queryFn: () => fetchAPI("categories", "en")
    });
    const {data: venuesData, isLoading: venuesLoading, error:venuesError} = useQuery({
        queryKey: ["venues"],
        queryFn: () => fetchAPI('venue', 'en', {limit: 1000})
    });

    const {data: rec, isLoading: recLoading, error:recError} = useQuery({
        queryKey: ["recommendations"],
        queryFn: () => fetchAPI('recommendations', 'en')
    });

    useEffect(() => {
        scrollTo(target);
    }, [target]);



    //if (isLoading || venuesLoading) return <Loading />;
    if (error) return <div>Error: {error.message}</div>;

    // render component
    return(
        <div>
            <ScrollToTop/>
            <Header selectedTab={"lists"} landing={true} interact={true} setLocation={setLocation} location={location} setTarget={setTarget} venue={false}></Header>
            {isMobile &&
                <section className={"home__container"}>
                    <div>
                        <section style={{padding: "10px 0"}}>
                            <h2 className={"subtitle"}>
                                FOOD CLUB loves lists. We've crafted these bad boys just for you! From healthy snacks to absurdly comforting food, the order is yours.
                            </h2>
                        </section>
                        {categoryList && categoryList.docs &&
                            <CategoryList data={categoryList} recommendations={rec.docs}/>
                        }
                        <div className={`fixed-wrapper ${classNames}`}>
                            {!venuesLoading &&
                                <LuckyButton venues={venuesData}/>
                            }
                        </div>
                    </div>
                </section>
            }
            {!isMobile && categoryList && categoryList.docs && rec && rec.docs &&
                <DesktopHome categories={categoryList.docs} recommendations={rec.docs}/>
            }
            <CookiePopUp/>
        </div>
    )
}
export default HomeClient;