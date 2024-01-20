import * as React from "react";
import _cross from "../elements/SVG/cross.svg"
import _arrow from "../elements/SVG/button-scroll-to-top.svg"
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
    let venue = props.venue

    const closePane = () => {
        props.setOpenInfoPane(false);
    }

    return (
        <div className={"map--ui_pop-up-container"}>
            <div className={"map--ui_pop-up-container-left"}>
                <div style={{position: "relative"}}>
                    <div className={"map--ui_pop-up--image_container"}>
                        {venue.venueName &&
                            <img
                                onClick={() => nav(`/venue/${venue.venueName}`)}
                                className={"toplist--image_img"}
                                src={venue["media"]["sizes"]["tablet"]["url"]}
                                alt=""
                            />
                        }
                    </div>
                </div>
                {/*
                <div onClick={() => nav(`/venue/${venue.venueName}`)} className="button-mask_transparant">
                    <p>read more</p>
                </div>
                */}

            </div>

            <div className={"map--ui_pop-up-container-right"}>
                <div className="arrow--down_UI">
                    <img
                        onClick={() => closePane()}
                        alt="UI element used to close the element"
                        src={_arrow}
                        style={{pointerEvents: 'auto', zIndex: "10000"}}
                    />

                </div>

                {venue.venueName &&
                    <h1>
                        {venue.venueName}
                    </h1>
                }

                <div style={{display: "flex", gap: "2vw"}}>
                    {venue && venue["type"][0] &&
                        <p>
                            {venue["type"][0]}
                        </p>
                    }
                    {venue && venue["cuisineUsed"][0] &&
                        <p> - {venue["cuisineUsed"][0]["name"]} </p>
                    }
                </div>

                <div className={"address"}>
                    <div>
                        <img style={{width: "5vw"}} src={_pin}/>
                    </div>
                    {venue["address"] &&
                        <p
                            style={{
                                color: "white",
                                fontWeight: 300,
                            }}>
                            {venue["address"]["street"]}{" "}
                            {venue["address"]["houseNumber"]},{" "}
                            {venue["address"]["postalCode"]}{" "}
                            {venue["address"]["city"]}
                        </p>
                    }

                </div>

            </div>
        </div>

    )
}

export default MapInfoPane