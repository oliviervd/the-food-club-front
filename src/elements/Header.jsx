import AutoResizeText from "./AutoResizeText.jsx";
import {useNavigate} from "react-router-dom";
import {useMediaQuery} from "@uidotdev/usehooks";
import {useContext} from "react";
import {BackgroundColorContext} from "../utils/BackgroundColorContext.jsx";
import DitherImage from "./DitherImage.jsx";
import {getCSSVariableValue, handleLocationChange} from "../utils/utils.jsx";

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
                    <div style={{display: 'grid', gridTemplateColumns: "30% 70%"}}>
                        <div style={{width: '100%', height: 'auto'}} onClick={() => {
                            nav("/")
                        }}>
                            <AutoResizeText text="FOOD CLUB" maxFontSize={600} minFontSize={10} padding={"0px 0px"}/>
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
                                <h2 className={"link greyed-out"}>NL</h2>
                                <h2 className={"link greyed-out"}>FR</h2>
                                <h2 className={"link selected"}>EN</h2>
                            </nav>
                        </div>


                    </div>
                }
                {isSmall &&
                    <div style={{width: '100%', height: 'auto'}} onClick={() => {
                        nav("/")
                    }}>
                        <AutoResizeText text="FOOD CLUB" maxFontSize={600} minFontSize={10} padding={"0px 0px"}/>
                    </div>
                }

                {isSmall &&
                    <div>
                        <div style={{width: '100%', height: 'auto'}}>
                            <AutoResizeText text="WELCOME TO FOOD CLUB" maxFontSize={600}
                                            minFontSize={10} padding={"0 0px"}/>
                            <div className={"divider"}></div>
                            <AutoResizeText text="LOOKING FOR SOMETHING IN" maxFontSize={600}
                                            minFontSize={10} padding={"0 0 10px 0"}/>
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
                                    <h2 className={`link greyed-out`} onClick={() => {
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