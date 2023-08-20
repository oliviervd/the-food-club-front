import {Icon} from "leaflet/dist/leaflet-src.esm.js";
import {Marker, Popup, TileLayer, MapContainer} from "react-leaflet";
import React from "react";

const map = () => {

    const MarkerLocations = [
        {
            geoCode: [51.05904316431157, 3.7270031691456937]
        },
        {
            geoCode: [51.05361111787999, 3.723295053804015]
        }
    ]

    const CustomIcon = new Icon({
        iconUrl: "https://img.icons8.com/?size=512&id=67384&format=png",
        iconSize: [38, 38] // size
    })

    return(
        <div className={"container"}>
            <MapContainer center={[51.0544, 3.7256]} zoom={14}>
                <TileLayer
                    attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
                    //url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    url="https://api.mapbox.com/styles/v1/oliviervd-tfc/clljebsk0018v01plaeyy7xny/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoib2xpdmllcnZkLXRmYyIsImEiOiJjbGxqZWFjd3MweTBzM2psaWFiemlnZnZnIn0.fMu0iJpz82mNYQ5Rrrwi-w"
                />

                {MarkerLocations.map(marker => (
                    <Marker
                        position={marker.geoCode}
                        icon={CustomIcon}
                    />
                ))}

            </MapContainer>
        </div>
    )
}

export default map
