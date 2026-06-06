'use client';

import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

const RoutingLine = ({ from, to, color = '#000eff', onRouteFound }) => {
    const map = useMap();
    const routingRef = useRef(null);
    const onRouteFoundRef = useRef(onRouteFound);

    // Keep callback ref fresh without triggering effect
    useEffect(() => {
        onRouteFoundRef.current = onRouteFound;
    }, [onRouteFound]);

    useEffect(() => {
        if (!from || !to || !map) return;

        let cancelled = false;

        import('leaflet-routing-machine').then(() => {
            if (cancelled) return;

            // Clean up previous route safely
            if (routingRef.current) {
                try { routingRef.current.getPlan().setWaypoints([]); } catch {}
                try { map.removeControl(routingRef.current); } catch {}
                routingRef.current = null;
            }

            routingRef.current = L.Routing.control({
                waypoints: [
                    L.latLng(from.lat, from.lng),
                    L.latLng(to.lat, to.lng),
                ],
                // Use walking profile — foot routing via OSRM public server
                router: L.Routing.osrmv1({
                    serviceUrl: 'https://router.project-osrm.org/route/v1',
                    profile: 'foot',
                }),
                routeWhileDragging: false,
                addWaypoints: false,
                fitSelectedRoutes: false,
                showAlternatives: false,
                show: false,
                collapsible: false,
                createMarker: () => null,
                lineOptions: {
                    styles: [
                        { color: color, opacity: 0.15, weight: 10 },
                        { color: color, opacity: 0.9, weight: 3, dashArray: '8 6' },
                    ],
                    extendToWaypoints: false,
                    missingRouteTolerance: 0,
                },
            }).addTo(map);

            // Hide the default LRM UI panel
            const container = routingRef.current.getContainer();
            if (container) container.style.display = 'none';

            // Fit bounds + extract distance once route is found
            routingRef.current.on('routesfound', (e) => {
                if (cancelled) return;
                const routes = e.routes;
                if (!routes?.length) return;

                const route = routes[0];

                // Fit map to show full route
                try {
                    const bounds = L.latLngBounds(route.coordinates);
                    map.fitBounds(bounds, { padding: [80, 80] });
                } catch {}

                // Pass distance + duration up to parent
                if (onRouteFoundRef.current) {
                    const distanceKm = (route.summary.totalDistance / 1000).toFixed(1);
                    const durationMin = Math.round(route.summary.totalTime / 60);
                    onRouteFoundRef.current({ distanceKm, durationMin });
                }
            });
        });

        return () => {
            cancelled = true;
            if (routingRef.current) {
                try { routingRef.current.getPlan().setWaypoints([]); } catch {}
                try { map.removeControl(routingRef.current); } catch {}
                routingRef.current = null;
            }
        };
    }, [from?.lat, from?.lng, to?.lat, to?.lng, map, color]);

    return null;
};

export default RoutingLine;