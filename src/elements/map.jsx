
import {Marker, Popup, TileLayer, MapContainer} from "react-leaflet";
import React from "react";

const map = () => {
    return(
        <div className={"container"}>
            <MapContainer center={[51.0544, 3.7256]} zoom={13} scrollWheelZoom={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            </MapContainer>

        </div>
    )
}

export default map
