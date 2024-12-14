import Header from "../elements/Header.jsx";
import {MapContainer, TileLayer, useMap, Marker, Popup} from "react-leaflet";
import {divIcon, Icon} from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import {useContext, useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {venueStatus, fetchAPI, getCSSVariableValue} from "../utils/utils.jsx";
import {LocationColorContext} from "../utils/LocationColorContext.jsx";
import Banner from "../elements/Banner.jsx";


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

    const { locationColor} = useContext(LocationColorContext);

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
                        {venues && venues.map((venue) => {
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
                <div className={"map--filter_container"}>
                    <div className={"tags"} style={{padding: "10px 10px"}}>
                        <h2>open now</h2>
                        <h2>monday</h2>
                        <h2>tuesday</h2>
                        <h2>wednesday</h2>
                        <h2>thursday</h2>
                        <h2>friday</h2>
                        <h2>saturday</h2>
                        <h2>sunday</h2>
                        <h2>closed</h2>
                    </div>
                    <div className={"tags"} style={{padding: "10px 10px"}}>
                        <h2>reservations possible</h2>
                        <h2>without reservations</h2>
                    </div>
                </div>
                <div className={`map-venue-container ${classNames}`}>
                    <div onClick={()=>{setVisible(!visible)}}>
                        <Banner small={true} content={"↧ close ↧"}/>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Map

