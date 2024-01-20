import * as React from "react";
import _closeIcon from "./SVG/cross.svg"

const VenueUI = (props) => {
    const venue = props.venue;
    console.log(venue)
    const closePane = () => {
        props.setOpenInfoPane(false)
        console.log("close")
    }

    return(
        <div className={"desktop-UI-venue__container"}>
            <a>
                <img
                    className={"cross"}
                    src={_closeIcon}
                    onClick={() => closePane()}
                />
            </a>
            <div className={"flex"}>
                <div className={"image"}>
                    <img src={venue["media"]["sizes"]["tablet"]["url"]}/>
                </div>
                <div>
                    <h1>{venue.venueName}</h1>
                    <div className={"slug"}>
                        <p>{venue["slugs"]["slugEN"][0]["children"][0]["text"]}</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default VenueUI