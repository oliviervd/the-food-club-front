'use client';

import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

// Draws a clean route line between two points using OSRM (free, no API key)
// Suppresses the default Leaflet Routing Machine UI — line only
const RoutingLine = ({ from, to, color = '#000eff' }) => {
    const map = useMap();
    const routingRef = useRef(null);

    useEffect(() => {
        if (!from || !to || !map) return;

        // Dynamically import to avoid SSR issues
        import('leaflet-routing-machine').then(() => {
            // Clean up previous route
            if (routingRef.current) {
                map.removeControl(routingRef.current);
                routingRef.current = null;
            }

            routingRef.current = L.Routing.control({
                waypoints: [
                    L.latLng(from.lat, from.lng),
                    L.latLng(to.lat, to.lng),
                ],
                routeWhileDragging: false,
                addWaypoints: false,
                fitSelectedRoutes: false,
                showAlternatives: false,
                // Hide the default UI panel completely
                show: false,
                collapsible: false,
                createMarker: () => null, // no default markers
                lineOptions: {
                    styles: [
                        // Outer glow line
                        { color: color, opacity: 0.15, weight: 10 },
                        // Main line
                        { color: color, opacity: 0.9, weight: 3, dashArray: '8 6' },
                    ],
                    extendToWaypoints: false,
                    missingRouteTolerance: 0,
                },
            }).addTo(map);

            // Hide the routing container div that LRM injects
            const container = routingRef.current.getContainer();
            if (container) {
                container.style.display = 'none';
            }
        });

        return () => {
            if (routingRef.current && map) {
                try {
                    map.removeControl(routingRef.current);
                } catch {}
                routingRef.current = null;
            }
        };
    }, [from, to, map, color]);

    return null;
};

export default RoutingLine;