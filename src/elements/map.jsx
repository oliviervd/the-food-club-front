
import {Marker, Popup, TileLayer, MapContainer} from "react-leaflet";
import React from "react";

const map = () => {

    return(
        <div className={"container"}>
            <MapContainer center={[51.0544, 3.7256]} zoom={13}>
                <TileLayer
                    attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        </div>
    )
}

export default map
