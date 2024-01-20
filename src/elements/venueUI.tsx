import * as React from "react";
import _closeIcon from "./SVG/cross.svg"
import {isObject} from "../utils/utils"
const VenueUI = (props) => {
    const venue = props.venue;
    console.log(venue)
    const closePane = () => {
        props.setOpenInfoPane(false)
        console.log("close")
    }

    return(
        <div className={"desktop-UI-venue__container"}>
            <div>
                <img
                    className={"cross"}
                    src={_closeIcon}
                    onClick={() => closePane()}
                />

            </div>
            <div className={"flex"}>
                <div>
                    <div className={"image"}>
                        <img src={venue["media"]["sizes"]["tablet"]["url"]}/>
                    </div>
                    <div className={"pills"}>
                        {!isObject(venue["type"]) && (
                            <div className={"pillbox--container_desktop"}>
                                <p className={"pillbox"}>{venue["type"]}</p>
                                {venue["cuisineUsed"].map((cuisine)=> {
                                    console.log(cuisine)
                                    return (
                                        <p className={"pillbox yellow"}>{cuisine.name}</p>
                                    )
                                })}
                            </div>

                        )}
                        {isObject(venue["type"]) && (
                            <div className={"pillbox--container_desktop"}>
                                <p className={"pillbox"}>{venue["type"][0]}</p>
                                <p className={"pillbox"}>{venue["type"][1]}</p>
                                {venue["cuisineUsed"].map((cuisine)=> {
                                    console.log(cuisine)
                                    return (
                                        <p className={"pillbox yellow"}>{cuisine.name}</p>
                                    )
                                })}
                            </div>
                        )}

                    </div>
                </div>
                <div>
                    <h1>{venue.venueName}</h1>
                    <div className={"slug"}>
                        <p>{venue["slugs"]["slugEN"][0]["children"][0]["text"]}</p>
                    </div>

                    {venue["clubOrder"] && (
                        <div className={"venue_tipbox"}>
                            <p>{venue["clubOrder"][0]["children"][0]["text"]}</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}

export default VenueUI