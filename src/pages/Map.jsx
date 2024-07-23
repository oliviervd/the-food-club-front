import Header from "../elements/Header.jsx";
import {MapContainer, TileLayer, useMap, Marker, Popup} from "react-leaflet";
import {useContext, useState, useEffect} from "react";
import {BackgroundColorContext} from "../utils/BackgroundColorContext.jsx";
import {fetchAPI, getCSSVariableValue} from "../utils/utils.jsx";

// Custom hook to update the map center
const ChangeView = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center);
    }, [center, map]);
    return null;
}

const Map = ({}) => {

    const [target, setTarget] = useState(null);
    const [location, setLocation] = useState(null);

    let zoom = 14 // set zoom of map
    const [mapCenter, setMapCenter] = useState([51.0544, 3.7256]); // Initial coordinates

    // fetch backgroundcolor from context
    const { bgColor: backgroundColor } = useContext(BackgroundColorContext);

    const colorToCoordinatesMap = {
        'gent': [51.0544, 3.7256],
        'brussels': [50.848375753126724, 4.357218040236126],
        'antwerp': [51.22307671016094, 4.410658141685829]
        // Add more mappings if needed
    };


    // change styling/view map based on location
    useEffect(() => {
        // restyle UI (color) based on selected location
        const filterContainer = document.querySelector('.map--filter_container');
        if (filterContainer) {
            filterContainer.style.backgroundColor = backgroundColor;
        }

        // reposition map (center) based on selected location
        if (colorToCoordinatesMap[location]) {
            setMapCenter(colorToCoordinatesMap[location]);
        }
    }, [backgroundColor, location]);

    // add locations on map
    const [venues, setVenues] = useState([]);
    const getVenues = async () => {
        const result = await fetchAPI("venue", "en");
        setVenues(result.docs)
    }

    useEffect(() => {
        getVenues();
    },[])

    // Function to create a custom SVG icon with a given color
    const createCustomIcon = (color) => {
        return L.divIcon({
            className: "custom-marker-icon",
            html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${color}" stroke="black"><circle cx="12" cy="12" r="10"/></svg>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });
    };

    // Function to get color based on club/location
    const getColorForClub = (club) => {
        switch (club) {
            case "antwerp":
                return getCSSVariableValue("--turquoise-green");
            case "gent":
                return getCSSVariableValue("--pale-lemon-yellow");
            default:
                return getCSSVariableValue("--salvia-blue");
        }
    };

    return(
        <div className={"map--ui_container"}
             style={{ overflow: "hidden", maxWidth: "100vw", maxHeight: "100vh", position: "relative" }}>
            <Header landing={true} interact={true} setLocation={setLocation} location={location} setTarget={setTarget}/>
            <div style={{height: '80%', width: '100%', position: 'relative'}}>
                <MapContainer
                    className={"map--ui"}
                    center={mapCenter}
                    zoom={zoom}
                    zoomControl={false}
                >

                    {/* plot markers*/}
                    {venues && venues.map((venue)=>{
                        console.log(venue.address.latitude);
                        console.log(venue.address.longitude);

                        const color = getColorForClub(venue.club);

                        return(
                            <Marker
                                position={[venue.address.longitude, venue.address.latitude]}
                                icon={createCustomIcon(color)}
                            />
                        )
                    })}

                    <ChangeView center={mapCenter}/>
                    <TileLayer
                        url="https://api.mapbox.com/styles/v1/oliviervd-tfc/clllwhqvq009s01pea2rw8mpt/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoib2xpdmllcnZkLXRmYyIsImEiOiJjbGxqZWFjd3MweTBzM2psaWFiemlnZnZnIn0.fMu0iJpz82mNYQ5Rrrwi-w"
                    />
                </MapContainer>
                <div className={"map--filter_container"} style={{backgroundColor: "Background"}}>

                </div>
            </div>
        </div>
    )
}
export default Map
