import {Icon} from "leaflet/dist/leaflet-src.esm.js";
import {Marker, Popup, TileLayer, MapContainer} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import React, {useState} from "react";
import _im from "./images/Mapicon.png"
import _logo from "../elements/images/Untitled_Artwork.png";
import GridUI from "./gridUI.jsx";
import {fetchAPI} from "../utils/utils.jsx";
import {useNavigate} from "react-router-dom";

import {pricingLabel} from "../utils/utils.jsx";


const map = () => {

    const [openInfoPane, setOpenInfoPane] = useState(false)
    const [venue, setVenue] = useState("")

    const nav = useNavigate();

    function generateInfoPane(venue) {
        setOpenInfoPane(true)
        setVenue(venue)
    }

    function isObject(input){
        if (typeof input === "object" && input.length !== 1) {
            return true
        } else { return false }
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
        <div className={"container"} style={{overflow:"hidden", maxWidth: "100vw"}}>
            {/*<img className={"UI-GRID"} src={GridUI} style={{height:"100vh", objectFit:"cover"}}/>*/}
            <MapContainer className={"map--ui"} center={[51.0544, 3.7256]} zoom={13.5} zoomControl={false}>
                <TileLayer
                    //attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
                    //url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    url="https://api.mapbox.com/styles/v1/oliviervd-tfc/clllwhqvq009s01pea2rw8mpt/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoib2xpdmllcnZkLXRmYyIsImEiOiJjbGxqZWFjd3MweTBzM2psaWFiemlnZnZnIn0.fMu0iJpz82mNYQ5Rrrwi-w"
                />

                <MarkerClusterGroup chunkedLoading maxClusterRadius="30" >
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

            <div className={"map--ui_top-container"}>
                <img onClick={()=>nav("/categories")} className={"map--ui_logo"} src={_logo}/>
                <div className={"map--ui_filter-container"}>
                    <p className={"map--ui_filter-label"}></p>
                </div>
                <div className={"map--ui_position-container"}>
                    <p className={"map--ui_position-label"}></p>
                </div>
            </div>


            {openInfoPane &&
                <div className={"map--ui_pop-up-container"}>
                    <GridUI/>
                    {/* MOBILE UI */}
                    <div className={"map--ui_pop-up-container--grid"}>
                        <img onClick={()=>nav(`/venue/${venue.venueName}`)} className={"map--ui_pop-up-container__img"} src={venue["media"]["sizes"]["tablet"]["url"]}/>
                        <div>
                            <h2 className={"map--ui_pop-up-container__title"}>{venue.venueName}</h2>
                            <div className={"autogrid-pills"}>
                                {/* check if multiple types to define UI */}
                                {isObject(venue["cuisineUsed"]) &&
                                    <div className={"pillbox--container"}>
                                        {venue["cuisineUsed"].map(cuisine => (
                                            <h3 className={"map--ui_pop-up-container__pill"}>{cuisine["name"]}</h3>
                                        ))}
                                        {/* check if multiple types to define UI */}
                                        {!isObject(venue["type"]) &&
                                            <div className={"autogrid-pills"}>
                                                <p className={"map--ui_pop-up-container__pill"}>{venue["type"]}</p>
                                                {/*<p className={"map--ui_pop-up-container__pill"}>{pricingLabel(venue["pricing"])}</p>*/}
                                            </div>
                                        }
                                        {isObject(venue["type"]) &&
                                            <div className={"autogrid-pills"}>
                                                <p className={"map--ui_pop-up-container__pill"}>{venue["type"][0]}</p>
                                                <p className={"map--ui_pop-up-container__pill"}>{venue["type"][1]}</p>
                                                {/*<p className={"map--ui_pop-up-container__pill"}>{pricingLabel(venue["pricing"])}</p>*/}
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                            <div className={"autogrid-pills"}>

                            </div>
                        </div>
                    </div>
                    {/* WEB UI */}
                    <div>

                    </div>
                </div>
            }
        </div>
    )
}

export default map
