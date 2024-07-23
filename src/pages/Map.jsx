import Header from "../elements/Header.jsx";
import {MapContainer, TileLayer, useMap, Marker, Popup} from "react-leaflet";
import {useContext, useState, useEffect} from "react";
import {BackgroundColorContext} from "../utils/BackgroundColorContext.jsx";

// Custom hook to update the map center
const ChangeView = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center);
    }, [center, map]);
    return null;
}

const Map = ({}) => {

    let zoom = 12.5
    const [target, setTarget] = useState(null);
    const [location, setLocation] = useState(null);
    const [mapCenter, setMapCenter] = useState([51.0544, 3.7256]); // Initial coordinates
    // fetch backgroundcolor from context
    const { bgColor: backgroundColor } = useContext(BackgroundColorContext);

    const colorToCoordinatesMap = {
        'gent': [51.0544, 3.7256],
        'brussels': [50.848375753126724, 4.357218040236126],
        'antwerp': [51.22307671016094, 4.410658141685829]
        // Add more mappings if needed
    };


    useEffect(() => {
        const filterContainer = document.querySelector('.map--filter_container');
        if (filterContainer) {
            filterContainer.style.backgroundColor = backgroundColor;
        }

        if (colorToCoordinatesMap[location]) {
            setMapCenter(colorToCoordinatesMap[location]);
        }

    }, [backgroundColor, location]);

    console.log(mapCenter)

    return(
        <div className={"map--ui_container"}
             style={{ overflow: "hidden", maxWidth: "100vw", height: "100vh"}}>
            <Header landing={true} interact={true} setLocation={setLocation} location={location} setTarget={setTarget}/>
            <div style={{ height: '100%', width: '100%'}}>
                <MapContainer
                    className={"map--ui"}
                    center={mapCenter}
                    zoom={zoom}
                    zoomControl={false}
                >
                    <ChangeView center={mapCenter} />
                    <TileLayer
                        //attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
                        //url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                        url="https://api.mapbox.com/styles/v1/oliviervd-tfc/clllwhqvq009s01pea2rw8mpt/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoib2xpdmllcnZkLXRmYyIsImEiOiJjbGxqZWFjd3MweTBzM2psaWFiemlnZnZnIn0.fMu0iJpz82mNYQ5Rrrwi-w"
                    />
                </MapContainer>
            </div>
            <div className={"map--filter_container"} style={{ backgroundColor:"Background" }}>

            </div>
        </div>
    )
}
export default Map
