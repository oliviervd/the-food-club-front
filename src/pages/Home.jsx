import Header from "../elements/Header.jsx";
import "../style/header.css"
import "../style/fonts.css"
import CategoryList from "../elements/CategoryList.jsx";
import {fetchAPI, scrollTo} from "../utils/utils.jsx";
import {useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import AutoResizeText from "../elements/AutoResizeText.jsx";
import {useMediaQuery} from "@uidotdev/usehooks";

//todo : improve loading speed
// todo: add locales

const Home = () => {

    // fetch data
    const [categoryList, setCategoryList] = useState([]);
    const [target, setTarget] = useState(null);
    const [location, setLocation] = useState(null);
    const isSmall = useMediaQuery("(max-width: 600px)");

    const {data: list, isLoading, error} = useQuery(["lists"], ()=> fetchAPI('lists','en'))

    useEffect(() => {
        if(list) {
            setCategoryList(list);
        }
    }, [list]);

    useEffect(()=>{
        scrollTo(target)
    },[target])

    if (isLoading) return <div></div>;
    if (error) return <div>Error: {error.message}</div>;

    // render component
    return(
        <div>
            <Header landing={true} interact={true} setLocation={setLocation} location={location} setTarget={setTarget}></Header>
            <div id={"cat_list"} className={"divider"}></div>
            <section className={"home__container"}>
                {!isSmall &&
                    <div>
                        <div style={{width: '100%', height: 'auto'}}>
                            <AutoResizeText text="WELCOME TO FOOD CLUB. LOOKING FOR SOMETHING IN..?" maxFontSize={600}
                                            minFontSize={10}/>
                        </div>
                        <nav className={"flex-buttons"}>
                            <h2 className={`link ${location === "gent" ? "selected" : ""}`} onClick={() => {
                                setLocation("gent")
                            }}>GENT</h2>
                            <h2 className={`link ${location === "antwerp" ? "selected" : ""}`} onClick={() => {
                                setLocation("antwerp")
                            }}>ANTWERP</h2>
                            <h2 className={`link ${location === "brussels" ? "selected" : ""}`} onClick={() => {
                                setLocation("brussels")
                            }}>BRUSSELS</h2>
                        </nav>
                        {location &&
                            <>
                                <div style={{width: '100%', height: 'auto'}}>
                                    <AutoResizeText text={`WE LOVE ${location.toUpperCase()}! HOW CAN WE HELP YOU?`}
                                                    maxFontSize={600}
                                                    minFontSize={10}/>
                                </div>
                                <nav className={"flex-buttons"}>
                                    <h2 className={`link selected`} onClick={() => {
                                    }}>SUPRISE ME!</h2>
                                    <h2 className={`link`} onClick={() => {
                                    }}>WHAT'S OPEN?</h2>
                                </nav>
                                <div onClick={() => {
                                    setTarget("cat_list")
                                }} style={{border: "black 2px solid", marginTop: "2px"}}>
                                    <AutoResizeText text={`→ OR CHECK OUT THE LISTS TO THE RIGHT →`}/>
                                </div>
                            </>

                        }
                    </div>
                }
                {categoryList &&
                    <div>
                        <section style={{padding: "10px"}}>
                            <h2 className={"subtitle"}> FOOD CLUB loves lists. That's why we created some specially for
                                you.
                                From healthy snacks to absurdly comforting food, the order is yours.</h2>
                        </section>
                        <CategoryList data={categoryList}/>
                    </div>
                }
            </section>
        </div>
    )
}
export default Home;