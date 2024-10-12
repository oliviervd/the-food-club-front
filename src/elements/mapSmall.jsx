import {MapContainer, TileLayer, useMap, Marker} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import {useContext, useEffect, useState} from "react";
import {LocationColorContext} from "../utils/LocationColorContext.jsx";
import {divIcon} from "leaflet";
import {getCSSVariableValue} from "../utils/utils.jsx";

// Custom hook to update the map center
const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

const MapSmall = ({venues}) => {
    // small map component to integrate in pages.
    const { locationColor} = useContext(LocationColorContext);
    console.log(venues)

    let [zoom, setZoom] = useState(12.5) // set zoom of map
    const colorToCoordinatesMap = {
        'gent': [51.0544, 3.7256],
        'brussels': [50.848375753126724, 4.357218040236126],
        'antwerp': [51.22307671016094, 4.410658141685829]
        // Add more mappings if needed
    };

    const [mapCenter, setMapCenter] = useState([51.0544, 3.7256]); // Initial coordinates

    useEffect(() => {
        // function to set the map center based on the location color
        setMapCenter(colorToCoordinatesMap[locationColor.location])
        setZoom(12.5)
    }, [locationColor]);

    const createCustomClusterIcon = (cluster) => {
        return new divIcon({
            html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
            className: '',
        })
    }

    const createCustomIcon = (color) => {
        return L.divIcon({
            className: "custom-marker-icon",
            html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${color}" stroke="black" stroke-width="1.5"><circle cx="12" cy="12" r="10"/></svg>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });
    };

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

    return (
        <section className={"map--ui_container-small"} style={{ overflow: "hidden", maxWidth: "100vw", maxHeight: "100vh", position: "relative"}} id={"mapSmallContainer"}>
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
                    {venues.map && venues.map((venue) => {
                        const color = getColorForClub(venue.venue.club);

                        console.log(venue.venue.address)
                        return (
                            <Marker
                                position={[venue.venue.address.longitude, venue.venue.address.latitude]}
                                icon={createCustomIcon(color)}
                            />
                        )})}
                    {!venues[1] &&
                            <div>
                                <Marker
                                    position={[venues.address.longitude, venues.address.latitude]}
                                    icon={createCustomIcon(getColorForClub(venues.club))}
                                />
                            </div>
                    }
                </MarkerClusterGroup>

            </MapContainer>
        </section>

  );
};

export default MapSmall;