import AutoResizeText from "./AutoResizeText.jsx";
import {useNavigate} from "react-router-dom";
import {useContext, useState} from "react";
import {useMediaQuery} from "@uidotdev/usehooks";
import {LocationColorContext, LocationColorProvider} from "../utils/LocationColorContext.jsx";
import logo from "../assets/img/logo-blue.png"
import venue from "../pages/Venue.jsx";

const Header = ({ interact, landing, venueLocation, setTarget, greyOut=false, color, map , selectedTab, venue}) => {

    // todo: add languages
    // todo: add map button
    // todo: make header logo "FOOD CLUB" (fold) when scrolling down
    // todo: add animation when links are interacted with.

    // get context value
    const { locationColor, handleLocationChange } = useContext(LocationColorContext);
    let { location } = locationColor
    if (venueLocation) {
        location = venueLocation;
        handleLocationChange(venueLocation);
    } else {
        const { location } = locationColor
    }

    // navigate back to home
    const nav = useNavigate();
    const isSmall = useMediaQuery("(max-width: 600px)");

    if (landing) {
        return(
            <header>
                {!isSmall &&
                    <div>
                        <div style={{display: 'grid', gridTemplateColumns: "30% 40% 30%"}}>
                            <div style={{display: 'flex', flexFlow: "row", height: '100%', justifyContent: 'center'}}>
                                <h2 style={{margin: "auto"}}>welcome to the club</h2>
                            </div>
                            <div className={"logo-container"} onClick={() => {
                                nav("/")
                            }}>
                                <img className={"logo"} src={logo}/>
                            </div>
                            <div style={{display: 'flex', flexFlow: "row", height: '100%', justifyContent: 'center'}}>
                                <h2 style={{margin: "auto"}}>looking for something?</h2>
                                <div className={"button-src"}>
                                    <svg width="31" height="100%" viewBox="0 0 31 26" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="10.8333" cy="10.8333" r="9.83333" stroke="black"
                                                stroke-width="2"></circle>
                                        <line x1="19.3504" y1="17.1214" x2="29.5022" y2="24.6017" stroke="black"
                                              stroke-width="2" stroke-linecap="round"></line>
                                    </svg>
                                </div>
                            </div>

                        </div>
                        <div>
                            <div style={{display: "flex", flexFlow: "row", flexDirection: "revert"}}>
                                <nav className={"flex-buttons"} style={{
                                    display: "flex",
                                    flexFlow: "row",
                                    textAlign: "right",
                                    width: "100%",
                                    gap: "0px"
                                }}>
                                    <h2 className={"link"} onClick={() => nav("/categories/")}>CATEGORIES</h2>
                                    <h2 className={"link"} onClick={() => nav("/map/")}>MAP</h2>
                                    <h2 className={"link"} onClick={() => nav("/about/")}>ABOUT</h2>
                                    <h2 className={"link"} onClick={()=>{handleLocationChange("gent")}}>@GENT</h2>
                                    <h2 className={"link"} onClick={()=>{handleLocationChange("brussels")}}>@BRUSSELS</h2>
                                    <h2 className={"link"} onClick={()=>{handleLocationChange("antwerp")}}>@ANTWERP</h2>
                                 {/*   <h2 className={"link"}>NL</h2>
                                    <h2 className={"link"}>FR</h2>
                                    <h2 className={"link selected"}>EN</h2>*/}
                                </nav>
                            </div>
                        </div>
                    </div>
                }

                {isSmall &&
                    <div className={"logo-container"} onClick={() => {
                        nav("/")
                    }}>
                        <img className={"logo"} src={logo}/>
                    </div>
                }

                {isSmall &&
                    <div>
                        {!venue &&
                        <nav className={"flex-buttons"}>
                            <h2 className={`link ${location === "gent" ? "selected" : ""}${greyOut && location !== "gent" ? "greyed-out" : ""}`}
                                onClick={interact ? () => {
                                    handleLocationChange("gent");
                            } : null}>gent</h2>
                            <h2 className={`link ${location === "antwerp" ? "selected" : ""}${greyOut && location !== "antwerp" ? "greyed-out" : ""}`}
                                onClick={interact ? () => {
                                    handleLocationChange("antwerp");
                                } : null}>antwerp</h2>
                            <h2 className={`link ${location === "brussels" ? "selected" : ""}${greyOut && location !== "brussels" ? "greyed-out" : ""}`}
                                onClick={interact ? () => {
                                    handleLocationChange("brussels");
                                } : null}>brussels</h2>
                        </nav>
                        }
                        {venue &&
                            <nav className={"flex-buttons"}>
                                <h2 className={"link selected"}>{location}</h2>
                            </nav>
                        }
                        <nav className={"flex-buttons"}>
                            <h2 className={`link ${selectedTab === "lists" ? "selected" : "none"}`} style={{borderTop: "none"}}
                                onClick={() => nav("/")}>lists</h2>
                            <h2 className={`link ${selectedTab === "map" ? "selected" : "none"}`} style={{borderTop: "none"}} onClick={() => nav("/map/")}>map</h2>

                        </nav>
                        {/*{location && !map &&
                            <>
                                <nav className={"flex-buttons"}>
                                    <h2 className={`link`} onClick={() => {
                                        surprise(location, nav);
                                    }} style={{borderTop:"none"}}>SUPRISE ME!</h2>
                                    <h2 className={`link greyed-out`} onClick={() => {
                                    }} style={{borderTop:"none"}}>WHAT'S OPEN?</h2>
                                </nav>
                            </>

                        }*/}
                    </div>
                }

            </header>
        )
    } else {
        return (
            <header>
                {!isSmall &&
                    <div style={{display: 'grid', gridTemplateColumns: "30% 70%"}}>
                        <div style={{width: '100%', height: 'auto'}} onClick={() => {
                            nav("/")
                        }}>
                            <AutoResizeText text="FOOD CLUB" maxFontSize={600} minFontSize={10}/>
                        </div>
                        <div style={{display:"flex", flexFlow:"row", flexDirection: "revert"}}>
                            <div style={{width:"90%"}}></div>
                            <nav className={"flex-buttons"} style={{
                                display: "flex",
                                flexFlow: "column",
                                justifyContent: "space-between",
                                textAlign: "right",
                                width: "10%"
                            }}>
                                <h2 className={"link"}>NL</h2>
                                <h2 className={"link"}>FR</h2>
                                <h2 className={"link selected"}>EN</h2>
                            </nav>
                        </div>
                    </div>
                }
                {isSmall &&
                    <div style={{width: '100%', height: 'auto'}} onClick={() => {
                        nav("/")
                    }}>
                        <AutoResizeText text="FOOD CLUB" maxFontSize={600} minFontSize={10}/>
                    </div>
                }
                <div className={"divider"}></div>
                <div style={{width: '100%', height: 'auto'}}>
                    <AutoResizeText text="TAKING YOU OUT FOR SERIOUS GOOD FOOD IN .." maxFontSize={600}
                                    minFontSize={10}/>
                </div>

                <nav className={"flex-buttons"}>
                    <h2 className={`link ${location === "gent" ? "selected" : ""}${greyOut && location !== "gent" ? "greyed-out" : ""}`} onClick={interact ? () => {
                        handleLocationChange("gent");
                    } : null}>GENT</h2>
                    <h2 className={`link ${location === "antwerp" ? "selected" : ""}${greyOut && location !== "antwerp" ? "greyed-out" : ""}`} onClick={interact ? () => {
                        handleLocationChange("antwerp");
                    } : null}>ANTWERP</h2>
                    <h2 className={`link ${location === "brussels" ? "selected" : ""}${greyOut && location !== "brussels" ? "greyed-out" : ""}`} onClick={interact ? () => {
                        handleLocationChange("brussels");
                    } : null}>BRUSSELS</h2>
                </nav>
            </header>
        )
    }
}
export default Header;