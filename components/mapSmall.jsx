'use client'

import { Map as LeafletMap, latLng } from 'leaflet';
import { MapContainer, TileLayer, useMap, Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useContext, useEffect, useRef, useState } from "react";
import { LocationColorContext } from "../contexts/LocationColorContext.jsx";
import { divIcon } from "leaflet";
import { getCSSVariableValue } from "../utils/utils.jsx";

// Hook to update map view
const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};

const MapSmall = ({ venues, highlight, onHover }) => {

    const { locationColor } = useContext(LocationColorContext);
    const mapRef = useRef(null);
    const clusterRef = useRef(null);

    const [zoom, setZoom] = useState(12.5);
    const [mapCenter, setMapCenter] = useState([51.0544, 3.7256]);

    const colorToCoordinatesMap = {
        gent: [51.0544, 3.7256],
        brussels: [50.848375753126724, 4.357218040236126],
        antwerp: [51.22307671016094, 4.410658141685829],
    };

    useEffect(() => {
        setMapCenter(colorToCoordinatesMap[locationColor.location] || [51.0544, 3.7256]);
        setZoom(12.5);
    }, [locationColor]);

    useEffect(() => {
        if (!highlight || !mapRef.current || !clusterRef.current) return;

        const map = mapRef.current; // Leaflet Map instance
        const clusterGroup = clusterRef.current.getLayer(); // Leaflet MarkerClusterGroup instance

        if (!map || !clusterGroup) return;

        const lat =
            highlight?.information?.address?.longitude || highlight?.address?.longitude;
        const lng =
            highlight?.information?.address?.latitude || highlight?.address?.latitude;

        if (!lat || !lng) return;

        const targetLatLng = latLng(lat, lng);

        // Zoom in and pan to marker position
        map.flyTo(targetLatLng, 17, { animate: true });

        // Find marker in cluster group layers
        let targetMarker = null;

        clusterGroup.eachLayer((layer) => {
            if (layer.getLatLng && layer.getLatLng().equals(targetLatLng)) {
                targetMarker = layer;
            }
        });

        if (!targetMarker) return;

        // Get visible parent cluster (the cluster that holds this marker)
        const parentCluster = clusterGroup.getVisibleParent(targetMarker);

        // If marker is clustered, spiderfy it
        if (parentCluster && parentCluster !== targetMarker) {
            parentCluster.spiderfy();
        }
    }, [highlight]);

    const createCustomIcon = (color) =>
        divIcon({
            className: "custom-marker-icon",
            html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${color}" stroke="black" stroke-width="1.5"><circle cx="12" cy="12" r="10"/></svg>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
        });

    const renderMarker = (venue, isClubLevel = false) => {
        const ref = isClubLevel ? venue : venue.venue;
        const isHighlighted = highlight?.url === ref.url;

        if (!ref?.information?.address) return null;

        const color = isHighlighted
            ? getCSSVariableValue("--color-secondary")
            : getCSSVariableValue("--color-main");

        return (
            <Marker
                key={ref.url}
                position={[
                    ref.information.address.longitude,
                    ref.information.address.latitude,
                ]}
                icon={createCustomIcon(color)}
                eventHandlers={{
                    mouseover: () => onHover?.(ref),
                    mouseout: () => onHover?.(null),
                }}
            />
        );
    };

    return (
        <section
            className={"map--ui_container-small"}
            style={{
                overflow: "hidden",
                maxWidth: "100vw",
                maxHeight: "100vh",
                position: "relative",
            }}
            id={"mapSmallContainer"}
        >
            <MapContainer
                className={"map--ui"}
                center={mapCenter}
                zoom={zoom}
                zoomControl={false}
                whenCreated={(mapInstance) => {
                    mapRef.current = mapInstance;
                }}
            >
                <ChangeView center={mapCenter} zoom={zoom} />

                <TileLayer
                    url="https://api.mapbox.com/styles/v1/oliviervd-tfc/clllwhqvq009s01pea2rw8mpt/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoib2xpdmllcnZkLXRmYyIsImEiOiJjbGxqZWFjd3MweTBzM2psaWFiemlnZnZnIn0.fMu0iJpz82mNYQ5Rrrwi-w"
                />

                <MarkerClusterGroup
                    ref={clusterRef}
                    chunkedLoading
                    disableClusteringAtZoom={12}
                    iconCreateFunction={(cluster) =>
                        divIcon({
                            html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
                            className: "",
                        })
                    }
                >
                    {Array.isArray(venues) &&
                        venues.map((venue) => {
                            // Check status is 'published'
                            const ref = venue.venue?.club ? venue : venue.club ? venue : null;
                            if (!ref || ref._status !== 'published') return null;

                            return ref.venue?.club
                                ? renderMarker(venue)
                                : ref.club
                                    ? renderMarker(venue, true)
                                    : null;
                        })}
                </MarkerClusterGroup>
            </MapContainer>
        </section>
    );
};

export default MapSmall;