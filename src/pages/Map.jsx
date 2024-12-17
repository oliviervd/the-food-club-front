import Header from "../elements/Header.jsx";
import {MapContainer, TileLayer, useMap, Marker, Popup} from "react-leaflet";
import {divIcon, Icon} from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import {useContext, useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {venueStatus, fetchAPI, getCSSVariableValue} from "../utils/utils.jsx";
import {LocationColorContext} from "../utils/LocationColorContext.jsx";
import Banner from "../elements/Banner.jsx";
import {Switch} from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

// todo add container that shows preview of the selected item
// todo add icons to zoom in / zoom out / show my location.

// Custom hook to update the map center
const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

const Map = ({}) => {

    const [target, setTarget] = useState(null);
    const [location, setLocation] = useState(null);
    const [visible, setVisible] = useState(true);
    const [showOpenOnly, setShowOpenOnly] = useState(false); // Default: show all venues
    const [hasTakeAway, setHasTakeAway] = useState(false); // default
    const { locationColor} = useContext(LocationColorContext);

    const [cuisines, setCuisines] = useState([]);
    const [selectedCuisine, setSelectedCuisine] = useState([]);
    const [selectedDish, setSelectedDish] = useState([]);


    useEffect(() => {
        const getCuisines = async() => {
            const _cuisines = await fetchAPI("cuisine", "en")
            setCuisines(_cuisines.docs);
        }
        getCuisines()
    },[location])


    //console.log(highlightedVenue)

    let [zoom, setZoom] = useState(12.5) // set zoom of map
    const [mapCenter, setMapCenter] = useState([51.0544, 3.7256]); // Initial coordinates
    const nav = useNavigate();

    const colorToCoordinatesMap = {
        'gent': [51.0544, 3.7256],
        'brussels': [50.848375753126724, 4.357218040236126],
        'antwerp': [51.22307671016094, 4.410658141685829]
        // Add more mappings if needed
    };

    useEffect(() => {
        // function to set the map center based on the location color
        setMapCenter(colorToCoordinatesMap[locationColor.location])
        setZoom(12.5)
    }, [locationColor]);

    // add locations on map
    const [venues, setVenues] = useState([]);
    const getVenues = async () => {
        const result = await fetchAPI("venue", "en");
        setVenues(result.docs)
    }

    useEffect(() => {
        getVenues();
    },[])

// Filter venues based on the "open now" toggle and cuisine
    const filteredVenues = venues.filter((venue) => {
        // Check if the venue meets the "open now" criteria.
        const isOpen = showOpenOnly ? venueStatus(venue) !== "closed today" : true;
        const takeAway = hasTakeAway ? venue["takeAway"] : true;

        // Check if the venue matches the selected cuisines.
        const matchesCuisine = venue.cuisineUsed
            ? selectedCuisine.length > 0
                ? venue.cuisineUsed.some((cuisine) =>
                    selectedCuisine.some((selected) => selected.name === cuisine.name)
                )
                : true // No cuisines selected, allow all venues.
            : false; // No cuisines in the venue.

        // Check if the venue matches the selected dishes.
        const matchesDish = venue.cuisineUsed
            ? selectedDish.length > 0
                ? venue.cuisineUsed.some((dish) =>
                    selectedDish.some((selected) => selected.name === dish.name)
                )
                : true // No dishes selected, allow all venues.
            : false; // No dishes in the venue.

        // Return true only if both cuisine and dish matches (plus open status).
        return isOpen && matchesCuisine && matchesDish && takeAway;
    });


    // Add animation classes based on visibility state
    const classNames = visible ? "slide-up" : "slide-down";

    // Function to create a custom SVG icon with a given color
    const createCustomIcon = (color) => {
        return L.divIcon({
            className: "custom-marker-icon",
            html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${color}" stroke="black" stroke-width="1.5"><circle cx="12" cy="12" r="10"/></svg>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });
    };

    const createCustomClusterIcon = (cluster) => {
        return new divIcon({
            html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
            className: '',
        })
    }

    // Function to get color based on club/location
    const getColorForClub = (club) => {
        switch (club) {
            case "antwerp":
                return getCSSVariableValue("--color-antwerp-main");
            case "gent":
                return getCSSVariableValue("--color-gent-main");
            default:
                return getCSSVariableValue("--color-brussels-main");
        }
    };

    return(
        <div className={"map--ui_container"}
             style={{ overflow: "hidden", maxWidth: "100vw", maxHeight: "100vh", position: "relative" }}>
            <Header selectedTab={"map"} landing={true} interact={true} setLocation={setLocation} location={location} setTarget={setTarget} map={true}/>
            <div style={{height: '80%', width: '100%', position: 'relative'}}>
                <MapContainer
                    className={"map--ui"}
                    center={mapCenter}
                    zoom={zoom}
                    zoomControl={false}
                >
                    <ChangeView center={mapCenter} zoom={zoom}/>
                    <TileLayer
                        url="https://api.mapbox.com/styles/v1/oliviervd-tfc/clllwhqvq009s01pea2rw8mpt/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoib2xpdmllcnZkLXRmYyIsImEiOiJjbGxqZWFjd3MweTBzM2psaWFiemlnZnZnIn0.fMu0iJpz82mNYQ5Rrrwi-w"
                    />
                    <MarkerClusterGroup
                        chunkedLoading={true}
                        iconCreateFunction={createCustomClusterIcon}
                    >
                        {/* plot markers*/}
                        {filteredVenues && filteredVenues.map((venue) => {
                            const color = getColorForClub(venue.club);
                            if (venue.address.longitude && venue.address.latitude) {
                                return (
                                    <Marker
                                        position={[venue.address.longitude, venue.address.latitude]}
                                        icon={createCustomIcon(color)}
                                        eventHandlers={{
                                            click: () => {
                                                setVisible(!visible);
                                            },
                                        }}
                                    />

                                )
                            }
                        })}
                    </MarkerClusterGroup>
                </MapContainer>
                <div className={"map--filter_left"}>
                    <div className={"switch"}>
                        <p>open today</p>
                        <Switch
                            checked={showOpenOnly}
                            onChange={(e) => setShowOpenOnly(e.target.checked)}
                            label="open today"
                        />
                    </div>
                    <div className={"switch"}>
                        <p>take-away</p>
                        <Switch
                            checked={hasTakeAway}
                            onChange={(e) => setHasTakeAway(e.target.checked)}
                            label="take-away"
                        />
                    </div>
                </div>
                <div className={"map--filter_container"}>
                    <p>looking for a specific dish? 🍕🍱🍔</p>
                    {cuisines.length > 0 &&
                        <Autocomplete
                            freeSolo
                            disablePortal
                            multiple
                            options={cuisines.filter((cuisine) => cuisine.type === "dish")} // Filtra solo i tipi "dish"
                            getOptionLabel={(option) => option.name}
                            value={selectedDish}
                            defaultValue={cuisines[0]}
                            onChange={(event, newValue) => {
                                setSelectedDish(newValue); // Update selected cuisine in state
                                console.log("Selected cuisine:", newValue);
                            }}
                            sx={{width: 300}}
                            renderInput={(params) => <TextField {...params}  />}
                        />
                    }
                    <p>a cuisine in mind? 🇮🇹🇫🇷🇺🇸</p>
                    {cuisines.length > 0 &&
                        <Autocomplete
                            freeSolo
                            disablePortal
                            multiple
                            options={cuisines.filter((cuisine) => cuisine.type === "cuisine")} // Filtra solo i tipi "dish"
                            getOptionLabel={(option) => option.name}
                            value={selectedCuisine}
                            defaultValue={cuisines[0]}
                            onChange={(event, newValue) => {
                                setSelectedCuisine(newValue); // Update selected cuisine in state
                                console.log("Selected cuisine:", newValue);
                            }}
                            sx={{width: 300}}
                            renderInput={(params) => <TextField {...params}  />}
                        />
                    }
                </div>
                <div className={`map-venue-container ${classNames}`}>
                    <div onClick={() => {
                        setVisible(!visible)
                    }}>
                        <Banner small={true} content={"↧ close ↧"}/>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Map

