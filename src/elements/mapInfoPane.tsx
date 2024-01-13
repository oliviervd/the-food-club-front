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
            <div className={"map--ui_pop-up-container--grid"}>
                <div className={"toplist--image_container"} style={{transform:"translateY(-3vh)"}}>
                    <img
                        style={{height:"35%", width:"36vw"}}
                        onClick={() => nav(`/venue/${venue.venueName}`)}
                        className={"toplist--image_img"}
                        src={venue["media"]["sizes"]["tablet"]["url"]}
                        alt=""
                    />
                </div>
                <p>

                </p>
            </div>
            {/* WEB UI */}
            <div></div>
        </div>
    )
}

export default MapInfoPane