import * as React from "react";
import _cross from "../elements/SVG/Close_icon.svg"
import {useNavigate} from "react-router-dom";

const MapInfoPane = (props) => {
    const nav = useNavigate();
    const venue = props.venue

    return (
        <div className={"map--ui_pop-up-container"}>
            <div className="cross-ui">
                <img
                    //onClick={() => setOpenInfoPane(false)}
                    alt="UI element used to close the element"
                    src={_cross}
                />
            </div>
            <div>
                <div className={"toplist--image_container"} style={{transform:"translateY(-3vh)", width:"33vw"}}>
                    <img
                        style={{height:"33%", width:"34vw"}}
                        onClick={() => nav(`/venue/${venue.venueName}`)}
                        className={"toplist--image_img"}
                        src={venue["media"]["sizes"]["tablet"]["url"]}
                        alt=""
                    />
                </div>
                <div className={"mapInfoPane--container_venue"}>
                    <h1>
                        {venue.venueName}
                    </h1>
                    <p>
                        {venue["type"][0]}
                    </p>
                    <a>
                        <h1>read more</h1>
                    </a>
                </div>

            </div>
            {/* WEB UI */}
            <div></div>
        </div>
    )
}

export default MapInfoPane