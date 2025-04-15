import AutoResizeText from "./AutoResizeText.jsx";
import { useRouter } from 'next/navigation';
import {useContext, useEffect, useState} from "react";
import {LocationColorContext} from "../utils/LocationColorContext.jsx";
import Image from 'next/image';
import logo from '/public/assets/img/logo-blue.png';
import Link from 'next/link';


const Header = ({ interact, landing, venueLocation, setTarget, greyOut=false, color, map , selectedTab, venue}) => {

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
    const router = useRouter();

    // media query
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkWidth = () => setIsMobile(window.innerWidth < 600);
        checkWidth();
        window.addEventListener("resize", checkWidth);
        return () => window.removeEventListener("resize", checkWidth);
    }, []);

    if (landing) {
        return(
            <header>
                {!isMobile &&
                    <div>
                        <div style={{display: 'grid', gridTemplateColumns: "30% 40% 30%"}}>
                            <div style={{display: 'flex', flexFlow: "row", height: '100%', justifyContent: 'center'}}>
                                <h2 style={{margin: "auto"}}>welcome to the club</h2>
                            </div>
                            <div className={"logo-container"}>
                                <Link href="/">
                                    <Image src={logo} alt="Food Club Logo" className="logo" />
                                </Link>
                            </div>

                            <div style={{display: 'flex', flexFlow: "row", height: '100%', justifyContent: 'center'}}>
                                <h2 style={{margin: "auto"}}>looking for something?</h2>
                                <div className={"button-src"}>
                                    <svg width="31" height="100%" viewBox="0 0 31 26" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="10.8333" cy="10.8333" r="9.83333" stroke="black"
                                                strokeWidth="2"></circle>
                                        <line x1="19.3504" y1="17.1214" x2="29.5022" y2="24.6017" stroke="black"
                                              strokeWidth="2" strokeLinecap="round"></line>
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
                                    <h2><Link className={"link"} href={"/"}>CATEGORIES</Link></h2>
                                    <h2><Link className={"link"} href={"/map"}>MAP</Link></h2>
                                    <h2><Link className={"link"} href={"/about"}>ABOUT</Link></h2>
                                    <h2 className={"link"} onClick={()=>{handleLocationChange("gent")}}>GENT</h2>
                                    <h2 className={"link"} onClick={()=>{handleLocationChange("brussels")}}>BRUSSELS</h2>
                                    <h2 className={"link"} onClick={()=>{handleLocationChange("antwerp")}}>ANTWERP</h2>
                                </nav>
                            </div>
                        </div>
                    </div>
                }

                {isMobile &&
                    <div className={"logo-container"}>
                        <Link href="/">
                            <Image src={logo} alt="Food Club Logo" className="logo" />
                        </Link>
                    </div>
                }

                {isMobile &&
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
                                onClick={() => router("/")}>lists</h2>
                            <h2 className={`link ${selectedTab === "map" ? "selected" : "none"}`} style={{borderTop: "none"}} onClick={() => nav("/map/")}>map</h2>

                        </nav>
                    </div>
                }

            </header>
        )
    } else {
        return (
            <header>
                {!isMobile &&
                    <div style={{display: 'grid', gridTemplateColumns: "30% 70%"}}>
                        <div style={{width: '100%', height: 'auto'}} onClick={() => {
                            router("/")
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
                {isMobile &&
                    <div style={{width: '100%', height: 'auto'}} onClick={() => {
                        router("/")
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