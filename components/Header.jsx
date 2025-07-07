import AutoResizeText from "./AutoResizeText.jsx";
import { useRouter } from 'next/navigation';
import {useContext, useEffect, useState} from "react";
import {LocationColorContext} from "../contexts/LocationColorContext.jsx";
import Image from 'next/image';
const logo = '/assets/img/logo-blue.png';
import Link from 'next/link';
import "../styles/header.css"

const Header = ({ interact, landing, venueLocation, setTarget, greyOut=false, color, map , selectedTab, venue}) => {

    // get context value
    const { locationColor, handleLocationChange } = useContext(LocationColorContext);
    let { location } = locationColor

    useEffect(() => {
        if (venueLocation) {
            handleLocationChange(venueLocation);
        }
    }, [venueLocation]);

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
                                    <Image
                                        src={logo}
                                        alt="Food Club Logo"
                                        className="logo"
                                        width={200}
                                        height={100}
                                        style={{
                                            width: '50%',
                                            height: 'auto',
                                        }}
                                    />
                                </Link>
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
                                    <h2 className={"link"} onClick={() => {
                                        handleLocationChange("gent");
                                        router.push("/");
                                    }}>
                                        GENT
                                    </h2>
                                    <h2 className={"link"} onClick={() => { handleLocationChange("brussels"); router.push('/coming-soon'); }}>BRUSSELS</h2>
                                    <h2 className={"link"} onClick={() => { handleLocationChange("antwerp"); router.push('/coming-soon'); }}>ANTWERP</h2>
                                </nav>
                            </div>
                        </div>
                    </div>
                }

                {isMobile &&
                    <div className={"logo-container"}>
                        <Link href="/">
                            <Image
                                src={logo}
                                alt="Food Club Logo"
                                className="logo"
                                width={200}
                                height={100}
                                style={{
                                    width: '50%',
                                    height: 'auto',
                                }}
                            />
                        </Link>
                    </div>
                }

                {isMobile &&
                    <div>
                        {!venue &&
                            <nav className={"flex-buttons"}>
                                <h2
                                    className={`link ${location === "gent" ? "selected" : ""}${greyOut && location !== "gent" ? "greyed-out" : ""}`}
                                    onClick={() => {
                                        handleLocationChange("gent");
                                        router.push("/");
                                    }}
                                >
                                    GENT
                                </h2>
                                <h2
                                    className={`link ${location === "antwerp" ? "selected" : ""}${greyOut && location !== "antwerp" ? "greyed-out" : ""}`}
                                    onClick={() => {
                                        handleLocationChange("antwerp");
                                        router.push('/coming-soon');
                                    }}
                                >
                                    ANTWERP
                                </h2>
                                <h2
                                    className={`link ${location === "brussels" ? "selected" : ""}${greyOut && location !== "brussels" ? "greyed-out" : ""}`}
                                    onClick={() => {
                                        handleLocationChange("brussels");
                                        router.push('/coming-soon');
                                    }}
                                >
                                    BRUSSELS
                                </h2>
                            </nav>
                        }
                        {venue &&
                            <nav className={"flex-buttons"}>
                                <h2 className={"link selected"}>{location}</h2>
                            </nav>
                        }
                        <nav className={"flex-buttons"}>

                            <h2 className={`link ${selectedTab === "lists" ? "selected" : "none"}`} style={{borderTop: "none"}} onClick={() => {router.push('/')}}>
                                lists
                            </h2>
                            <h2 className={`link ${selectedTab === "map" ? "selected" : "none"}`} style={{borderTop: "none"}} onClick={() => {router.push('/map')}}>
                                map
                            </h2>
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
                            router.push("/")
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
                        router.push("/")
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
                        router.push("/");
                    } : null}>GENT</h2>
                    <h2
                        className={`link ${location === "antwerp" ? "selected" : ""}${greyOut && location !== "antwerp" ? "greyed-out" : ""}`}
                        onClick={() => {
                            handleLocationChange("antwerp");
                            router.push('/coming-soon');
                        }}
                    >
                        antwerp
                    </h2>

                    <h2
                        className={`link ${location === "brussels" ? "selected" : ""}${greyOut && location !== "brussels" ? "greyed-out" : ""}`}
                        onClick={() => {
                            handleLocationChange("brussels");
                            router.push('/coming-soon');
                        }}
                    >
                        brussels
                    </h2>
                </nav>
            </header>
        )
    }
}
export default Header;