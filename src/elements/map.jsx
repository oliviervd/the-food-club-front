import {Icon} from "leaflet/dist/leaflet-src.esm.js";
import {Marker, Popup, TileLayer, MapContainer} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import React, {useState} from "react";
import _im from "./images/Mapicon.png"
import _logo from "../elements/images/Untitled_Artwork.png";
import _location from "../elements/images/my-location.png"
import GridUI from "./gridUI.jsx";
import {fetchAPI} from "../utils/utils.jsx";
import {useNavigate} from "react-router-dom";

import {pricingLabel} from "../utils/utils.jsx";


const map = () => {

    const [openInfoPane, setOpenInfoPane] = useState(false)
    const [openFilter, setOpenFilter] = useState(false)
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

    // open menu to filter selection
    function openSearchIndex() {
        setOpenFilter(!openFilter)
        setOpenInfoPane(false)
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
            <MapContainer className={"map--ui"} center={[51.0544, 3.7256]} zoom={12.5} zoomControl={false}>
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
                <div className={"map--ui_position-container"} onClick={()=>openSearchIndex()}>
                    {/*<img className={"map--ui_position-icon"} src={_location}></img>*/}
                </div>
            </div>


            <div className={` ${openFilter ? "map--ui_container-search active" : "map--ui_container-search closed"}`}>
                {openFilter &&
                    <div className={"map--ui_container-search_grid"}>
                        <div className={"map--ui_pop-up-container-section"}>
                            <p className={"map--ui_pop-up-container-search_prompt"}>open on:</p>
                            <div className={"map--ui_pop-up-container-search_pills"}>
                                <p className={"map--ui_pop-up-container-search_pillbox"}>MON</p>
                                <p className={"map--ui_pop-up-container-search_pillbox"}>TUE</p>
                                <p className={"map--ui_pop-up-container-search_pillbox"}>WED</p>
                                <p className={"map--ui_pop-up-container-search_pillbox selected"}>THU</p>
                                <p className={"map--ui_pop-up-container-search_pillbox"}>FRI</p>
                                <p className={"map--ui_pop-up-container-search_pillbox selected"}>SAT</p>
                                <p className={"map--ui_pop-up-container-search_pillbox"}>SUN</p>
                            </div>
                        </div>
                        <div className={"map--ui_pop-up-container-section"}>
                            <p className={"map--ui_pop-up-container-search_prompt"}>for:</p>
                            <div className={"map--ui_pop-up-container-search_pills"}>
                                <p className={"map--ui_pop-up-container-search_pillbox"}>BREAKFAST</p>
                                <p className={"map--ui_pop-up-container-search_pillbox selected"}>LUNCH</p>
                                <p className={"map--ui_pop-up-container-search_pillbox"}>DINNER</p>
                                <p className={"map--ui_pop-up-container-search_pillbox"}>APERO</p>
                                <p className={"map--ui_pop-up-container-search_pillbox"}>DRINKS</p>
                            </div>
                        </div>
                        <div className={"map--ui_pop-up-container-section"}>
                            <p className={"map--ui_pop-up-container-search_prompt"}>craving for:</p>
                            <div className={"map--ui_pop-up-container-search_pills"}>
                                <p className={"map--ui_pop-up-container-search_pillbox"}>Italian</p>
                                <p className={"map--ui_pop-up-container-search_pillbox"}>Belgian</p>
                                <p className={"map--ui_pop-up-container-search_pillbox selected"}>Asian</p>
                                <p className={"map--ui_pop-up-container-search_pillbox selected"}>Streetfood</p>
                                <p className={"map--ui_pop-up-container-search_pillbox"}>Pizza</p>
                                <p className={"map--ui_pop-up-container-search_pillbox selected"}>Dumplings</p>
                            </div>
                        </div>
                        <div className={"map--ui_pop-up-container-section"}>
                            <p className={"map--ui_pop-up-container-search_prompt"}>diet</p>
                            <div className={"map--ui_pop-up-container-search_pills"}>
                                <p className={"map--ui_pop-up-container-search_pillbox"}>vegetarian</p>
                                <p className={"map--ui_pop-up-container-search_pillbox"}>vegan</p>
                            </div>
                        </div>
                    </div>

                }
            </div>




            {openInfoPane &&
                <div className={"map--ui_pop-up-container"}>
                    {/*<GridUI/>*/}
                    <svg className={"UI-GRID__popup"} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="pink" stroke-width="1.5"/>
                            </pattern>
                            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                                <rect width="80" height="80" fill="url(#smallGrid)"/>
                                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="pink" stroke-width="1"/>
                            </pattern>
                        </defs>

                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                    {/* MOBILE UI */}
                    <div className={"map--ui_pop-up-container--grid"}>
                        <img onClick={()=>nav(`/venue/${venue.venueName}`)} className={"map--ui_pop-up-container__img"} src={venue["media"]["sizes"]["tablet"]["url"]}/>
                        <div style={{paddingLeft: "2em", width: "10em"}}>
                            <h2 className={"map--ui_pop-up-container__title"}>{venue.venueName}</h2>
                            <div className={"autogrid-pills"}>
                                {/* check if multiple types to define UI */}
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
