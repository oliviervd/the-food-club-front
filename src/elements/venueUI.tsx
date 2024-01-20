import * as React from "react";
import _closeIcon from "./SVG/cross.svg"

const VenueUI = (props) => {
    const venue = props.venue;

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
            <h1>{venue.venueName}</h1>
        </div>
    )
}

export default VenueUI