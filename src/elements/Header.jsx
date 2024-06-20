import AutoResizeText from "./AutoResizeText.jsx";
import {useNavigate} from "react-router-dom";
import {useMediaQuery} from "@uidotdev/usehooks";
import {useEffect, useState} from "react";
import DitherImage from "./DitherImage.jsx";

const Header = ({location, setLocation, interact, landing, setTarget}) => {
    // todo: add languages
    // todo: add map button
    // todo: make header logo "FOOD CLUB" (fold) when scrolling down.
    // todo: add different experience for landing screen -->

    // navigate back to home
    const nav = useNavigate();
    const isSmall = useMediaQuery("(max-width: 600px)");

    if (landing) {
        return(
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

                {isSmall &&
                    <div>
                        <div style={{width: '100%', height: 'auto'}}>
                            <AutoResizeText text="WELCOME TO FOOD CLUB. LOOKING FOR SOMETHING IN..?" maxFontSize={600}
                                            minFontSize={10}/>
                        </div>
                        <nav className={"flex-buttons"}>
                            <h2 className={`link ${location === "gent" ? "selected" : ""}`} onClick={interact ? () => {
                                setLocation("gent")
                            } : null}>GENT</h2>
                            <h2 className={`link ${location === "antwerp" ? "selected" : ""}`}
                                onClick={interact ? () => {
                                    setLocation("antwerp")
                                } : null}>ANTWERP</h2>
                            <h2 className={`link ${location === "brussels" ? "selected" : ""}`}
                                onClick={interact ? () => {
                                    setLocation("brussels")
                                } : null}>BRUSSELS</h2>
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
                                    <AutoResizeText text={`↓ OR CHECK OUT THE LISTS BELOW ↓`}/>
                                </div>
                            </>

                        }
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
                <div style={{width: '100%', height: 'auto'}}>
                    <AutoResizeText text="TAKING YOU OUT FOR SERIOUS GOOD FOOD IN .." maxFontSize={600}
                                    minFontSize={10}/>
                </div>

                <nav className={"flex-buttons"}>
                    <h2 className={`link ${location === "gent" ? "selected" : ""}`} onClick={interact ? () => {
                        setLocation("gent")
                    } : null}>GENT</h2>
                    <h2 className={`link ${location === "antwerp" ? "selected" : ""}`} onClick={interact ? () => {
                        setLocation("antwerp")
                    } : null}>ANTWERP</h2>
                    <h2 className={`link ${location === "brussels" ? "selected" : ""}`} onClick={interact ? () => {
                        setLocation("brussels")
                    } : null}>BRUSSELS</h2>
                </nav>
            </header>
        )
    }
}
export default Header;