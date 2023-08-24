import {Icon} from "leaflet/dist/leaflet-src.esm.js";
import {Marker, Popup, TileLayer, MapContainer} from "react-leaflet";
import React from "react";
import _im from "./images/Mapicon.png"
import GridUI from "./images/Grid_Dense.png";


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
        iconUrl: _im,
        iconSize: [28, 38] // size
    })

    return(
        <div className={"container"}>
            <img className={"UI-GRID"} src={GridUI}/>
            <MapContainer className={"map--ui"} center={[51.0544, 3.7256]} zoom={14}>
                <TileLayer
                    attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
                    //url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    url="https://api.mapbox.com/styles/v1/oliviervd-tfc/clllwhqvq009s01pea2rw8mpt/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoib2xpdmllcnZkLXRmYyIsImEiOiJjbGxqZWFjd3MweTBzM2psaWFiemlnZnZnIn0.fMu0iJpz82mNYQ5Rrrwi-w"
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
