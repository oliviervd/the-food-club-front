import * as React from "react";
import _cross from "../elements/SVG/Close_icon.svg"
import _pin from "../elements/SVG/Location_indicator_1.svg"
import {useNavigate} from "react-router-dom";

/**
 * Component representing a map info pane.
 *
 * @param {Object} props - The props object containing venue information and control functions.
 * @param {Object} props.venue - The venue object containing information about the venue.
 * @param {function} props.setOpenInfoPane - The function to control the visibility of the info pane.
 * @returns {JSX.Element} The map info pane component.
 */

const MapInfoPane = (props) => {
    const nav = useNavigate();
    const venue = props.venue
    console.log(venue)

    const closePane = () => {
        props.setOpenInfoPane(false);
    }

    return (
        <div className={"map--ui_pop-up-container"}>
            <div className="cross-ui">
                <img
                    onClick={()=>closePane()}
                    alt="UI element used to close the element"
                    src={_cross}
                    style={{pointerEvents: 'auto', zIndex:"10000"}}
                />
            </div>
            <div>
                <div>
                    <div className={"toplist--image_container"}
                         style={{transform: "translateY(-5vh)", width: "35vw", height: "20vh"}}>
                        <img
                            style={{height: "33%", width: "36vw"}}
                            onClick={() => nav(`/venue/${venue.venueName}`)}
                            className={"toplist--image_img"}
                            src={venue["media"]["sizes"]["tablet"]["url"]}
                            alt=""
                        />

                    </div>
                    <div style={{position:"relative", display:"flex", flexFlow: "row", transform: "translateY(-5vh)"}}>
                        <img style={{paddingLeft: "6vw",width:"5vw", position:"absolute"}} src={_pin}/>
                        <p className={"venue--container_content-address"}
                           style={{maxWidth: "30vw", color: "white", fontWeight: 300, left: "7vw", position:"absolute"}}>
                            {venue["address"]["street"]}{" "}
                            {venue["address"]["houseNumber"]},{" "}
                            {venue["address"]["postalCode"]}{" "}
                            {venue["address"]["city"]}
                        </p>
                        <div onClick={() => nav(`/venue/${venue.venueName}`)} className="button-mask_transparant" style={{position:"absolute", right:"21vw"}}>
                            <p>read more</p>
                        </div>{" "}
                    </div>

                </div>

                <div className={"mapInfoPane--container_venue"}>
                    <h1>
                        {venue.venueName}
                    </h1>
                    <div style={{display: "flex", gap: "2vw"}}>
                        <p>
                            {venue["type"][0]}
                        </p>
                        {venue["cuisineUsed"][0] &&
                            <p> - {venue["cuisineUsed"][0]["name"]} </p>
                        }

                </div>

            </div>

            </div>
            {/* WEB UI */}
            <div></div>
        </div>
    )
}

export default MapInfoPane