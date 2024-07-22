import AutoResizeText from "./AutoResizeText.jsx";
import {useNavigate} from "react-router-dom";
import {useMediaQuery} from "@uidotdev/usehooks";
import {useContext} from "react";
import {BackgroundColorContext} from "../utils/BackgroundColorContext.jsx";
import DitherImage from "./DitherImage.jsx";
import {surprise, handleLocationChange} from "../utils/utils.jsx";

const Header = ({location, setLocation, interact, landing, setTarget, greyOut=false, color}) => {

    // todo: add languages
    // todo: add map button
    // todo: make header logo "FOOD CLUB" (fold) when scrolling down

    // navigate back to home
    const nav = useNavigate();
    const isSmall = useMediaQuery("(max-width: 600px)");
    const { setBgColor } = useContext(BackgroundColorContext);

    if (landing) {
        return(
            <header>
                {!isSmall &&
                    <div>
                        <div style={{display: 'grid', gridTemplateColumns: "30% 40% 30%"}}>
                            <div style={{display: 'flex', flexFlow: "row", height: '100%', justifyContent: 'center'}}>
                                <h2 style={{margin: "auto"}}>welcome to the club</h2>
                            </div>
                            <div style={{width: '100%', height: 'auto'}} onClick={() => {
                                nav("/")
                            }}>
                                <AutoResizeText text="FOODCLUB" maxFontSize={600} minFontSize={10}
                                                padding={"0px 0px"}/>
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
                                    <h2 className={"link"}>categories</h2>
                                    <h2 className={"link"} onClick={()=>nav("/map/")}>map</h2>
                                    <h2 className={"link"}>about</h2>
                                    <h2 className={"link"}>NL</h2>
                                    <h2 className={"link"}>FR</h2>
                                    <h2 className={"link selected"}>EN</h2>
                                </nav>
                            </div>
                        </div>
                    </div>
                }

                {isSmall &&
                    <div style={{width: '100%', height: 'auto'}} onClick={() => {
                        nav("/")
                    }}>
                        <AutoResizeText text="FOODCLUB" maxFontSize={600} minFontSize={10} padding={"0px 0px"}/>
                    </div>
                }

                {isSmall &&
                    <div>
                        <div style={{width: '100%', height: 'auto'}}>
                            <AutoResizeText text="WELCOME TO FOOD CLUB" maxFontSize={600}
                                            minFontSize={10} padding={"0px 5px"}/>
                            <div className={"divider"}></div>
                            <AutoResizeText text="LOOKING FOR SOMETHING IN" maxFontSize={600}
                                            minFontSize={10} padding={"0px 0px 5px 5px"}/>
                        </div>
                        <nav className={"flex-buttons"}>
                            <h2 className={`link ${location === "gent" ? "selected" : ""}${greyOut && location !== "gent" ? "greyed-out" : ""}`}
                                onClick={interact ? () => {
                                    handleLocationChange("gent", setLocation, setBgColor);
                            } : null}>GENT</h2>
                            <h2 className={`link ${location === "antwerp" ? "selected" : ""}${greyOut && location !== "antwerp" ? "greyed-out" : ""}`}
                                onClick={interact ? () => {
                                    handleLocationChange("antwerp", setLocation, setBgColor);
                                } : null}>ANTWERP</h2>
                            <h2 className={`link ${location === "brussels" ? "selected" : ""}${greyOut && location !== "brussels" ? "greyed-out" : ""}`}
                                onClick={interact ? () => {
                                    handleLocationChange("brussels", setLocation, setBgColor);
                                } : null}>BRUSSELS</h2>
                        </nav>
                        {location &&
                            <>
                                <div style={{width: '100%', height: 'auto'}}>
                                    <AutoResizeText text={`WE LOVE ${location.toUpperCase()}! HOW CAN WE HELP YOU?`}
                                                    maxFontSize={600}
                                                    minFontSize={10} />
                                </div>
                                <nav className={"flex-buttons"}>
                                    <h2 className={`link`} onClick={() => {
                                        surprise(location, nav);
                                    }}>SUPRISE ME!</h2>
                                    <h2 className={`link greyed-out`} onClick={() => {
                                    }}>WHAT'S OPEN?</h2>
                                </nav>
                                <div onClick={() => {
                                    setTarget("cat_list")
                                }} style={{border: "black 2px solid", marginTop: "2px"}}>
                                    <AutoResizeText text={`↓ OR CHECK OUT THE LISTS BELOW ↓`} />
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
                <div className={"divider"}></div>
                <div style={{width: '100%', height: 'auto'}}>
                    <AutoResizeText text="TAKING YOU OUT FOR SERIOUS GOOD FOOD IN .." maxFontSize={600}
                                    minFontSize={10}/>
                </div>

                <nav className={"flex-buttons"}>
                    <h2 className={`link ${location === "gent" ? "selected" : ""}${greyOut && location !== "gent" ? "greyed-out" : ""}`} onClick={interact ? () => {
                        handleLocationChange("gent", setLocation, setBgColor);
                    } : null}>GENT</h2>
                    <h2 className={`link ${location === "antwerp" ? "selected" : ""}${greyOut && location !== "antwerp" ? "greyed-out" : ""}`} onClick={interact ? () => {
                        handleLocationChange("antwerp", setLocation, setBgColor);
                    } : null}>ANTWERP</h2>
                    <h2 className={`link ${location === "brussels" ? "selected" : ""}${greyOut && location !== "brussels" ? "greyed-out" : ""}`} onClick={interact ? () => {
                        handleLocationChange("brussels", setLocation, setBgColor);
                    } : null}>BRUSSELS</h2>
                </nav>
            </header>
        )
    }
}
export default Header;