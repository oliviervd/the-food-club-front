import {Icon} from "leaflet/dist/leaflet-src.esm.js";
import {Marker, Popup, TileLayer, MapContainer} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import React, {useState} from "react";
import _im from "./images/Mapicon.png"
import GridUI from "./images/Grid_Dense.png";
import {fetchAPI} from "../utils/utils.jsx";


const map = () => {

    const [openInfoPane, setOpenInfoPane] = useState(false)
    const [venue, setVenue] = useState("")

    function generateInfoPane(venue) {
        setOpenInfoPane(true)
        setVenue(venue)
    }

    // fetch data
    let _venues;
    try{
        let _venueList = fetchAPI('venue')
        _venues = _venueList["docs"]
        console.log(_venueList["docs"])
    } catch(e) {console.log(e)}


    const CustomIcon = new Icon({
        iconUrl: _im,
        iconSize: [28, 38] // size
    })

    return(
        <div className={"container"} style={{overflow:"hidden"}}>
            <img className={"UI-GRID"} src={GridUI} style={{height:"100vh", objectFit:"cover"}}/>
            <MapContainer className={"map--ui"} center={[51.0544, 3.7256]} zoom={14} zoomControl={false}>
                <TileLayer
                    //attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
                    //url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    url="https://api.mapbox.com/styles/v1/oliviervd-tfc/clllwhqvq009s01pea2rw8mpt/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoib2xpdmllcnZkLXRmYyIsImEiOiJjbGxqZWFjd3MweTBzM2psaWFiemlnZnZnIn0.fMu0iJpz82mNYQ5Rrrwi-w"
                />

                <MarkerClusterGroup chunkedLoading maxClusterRadius="50" >
                    {_venues &&
                        <div>
                            {_venues.map(venue => (
                                <Marker
                                    position={[venue.address.longitude, venue.address.latitude]} icon={CustomIcon}
                                    eventHandlers={{click:(e)=>{
                                            generateInfoPane(venue)
                                        },
                                    }}
                                >
                                </Marker>
                            ))}
                        </div>

                    }
                </MarkerClusterGroup>


            </MapContainer>
            {openInfoPane &&
                <div className={"map--ui_pop-up-container"}>
                    <img className={"UI-GRID__popup"}  src={GridUI}></img>
                        <div className={"map--ui_pop-up-container--grid"}>
                            <img className={"map--ui_pop-up-container__img"} src={venue.media.url}/>
                            <div>
                                <h2 className={"map--ui_pop-up-container__title"}>{venue.venueName}</h2>
                                <div className={"autogrid-pills"}>
                                    <h3 className={"map--ui_pop-up-container__pill"}>{venue["cuisineUsed"][0]["name"]}</h3>
                                    <h3 className={"map--ui_pop-up-container__pill"}>{venue["type"]}</h3>
                                </div>
                            </div>
                        </div>
                </div>
            }
        </div>
    )
}

export default map
