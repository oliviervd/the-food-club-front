
import {Marker, Popup, TileLayer, MapContainer} from "react-leaflet";
import React from "react";

const map = () => {
    return(
        <div className={"container"}>
            <MapContainer style={{position:"absolute", height:"100vh", width:'100vw'}} center={[51.0544, 3.7256]} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[51.505, -0.09]}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>

        </div>
    )
}

export default map
