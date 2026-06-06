'use client'

import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { divIcon } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import React, { useContext, useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { fetchAPI, getCSSVariableValue } from "/utils/utils.jsx";
import { LocationColorContext } from "/contexts/LocationColorContext.jsx";
import Link from "next/link.js";
import { useIsMobile } from "../../../hooks/isMobile.jsx";
import { Autocomplete, Chip, TextField } from "@mui/material";
import { useSunnyVenues } from '../../../hooks/weather/useSunnyVenues';
import { useMapAtmosphere } from '../../../hooks/weather/useMapAtmosphere';
import { useUser } from '/contexts/UserContext.jsx';
import dynamic from 'next/dynamic';
import SaveVenueButton from '/components/saveButton.jsx';
import VenueBottomSheet from '../../../components/venueBottomSheet.jsx';
import FilterBottomSheet from '../../../components/FilterBottomSheet.jsx';

import TuneIcon from '@mui/icons-material/Tune';
import MyLocationIcon from '@mui/icons-material/MyLocation';

const RoutingLine = dynamic(() => import('../../../components/routingLine.jsx'), { ssr: false });

const logo = '/assets/img/logo-blue.png';
const back = '/assets/img/Back.png';

const getHeroUrl = (media, preferred = 'tablet') => {
    const sizes = media?.hero?.sizes || {};
    const isValidUrl = (url) => {
        if (!url || typeof url !== 'string') return false;
        try {
            const parsed = new URL(url);
            return parsed.pathname.length > 1;
        } catch { return false; }
    };
    const candidates = [
        sizes[preferred]?.url,
        sizes.tablet?.url,
        sizes.mobileFriendly?.url,
        sizes.mobileThumbnail?.url,
        media?.hero?.url,
    ];
    return candidates.find(isValidUrl) || null;
};

const ChangeView = ({ center, zoom, disabled }) => {
    const map = useMap();
    useEffect(() => {
        if (disabled) return;
        map.setView(center, zoom);
    }, [center, zoom, map, disabled]);
    return null;
};

const MapClickHandler = ({ onMapClick }) => {
    const map = useMap();
    useEffect(() => {
        map.on('click', onMapClick);
        return () => map.off('click', onMapClick);
    }, [map, onMapClick]);
    return null;
};

const getCurrentDay = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
};

const isCurrentlyInPeriod = (periods) => {
    if (!periods || periods.length === 0) return false;
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    return periods.some(period => {
        if (!period.openTime || !period.closeTime) return false;
        const [openHours, openMinutes] = period.openTime.split(':').map(Number);
        const [closeHours, closeMinutes] = period.closeTime.split(':').map(Number);
        const openTime = openHours * 60 + openMinutes;
        const closeTime = closeHours * 60 + closeMinutes;
        return currentTime >= openTime && currentTime <= closeTime;
    });
};

// ── Venue Sidebar (desktop only) ─────────────────────────────
const VenueSidebar = ({ venue, isSunny, onClose, onDirections, routeInfo }) => {
    if (!venue) return null;
    const heroUrl = getHeroUrl(venue.media, 'tablet');
    const today = getCurrentDay();
    const address = venue.information?.address;
    const items = [
        ...(venue.information?.cuisine || []),
        ...(venue.information?.dishes || []),
        ...(venue.information?.drinks || []),
    ];

    return (
        <div className="map--sidebar open">
            <button className="map--sidebar__close" onClick={onClose}>✕</button>

            {heroUrl && (
                <div className="map--sidebar__image">
                    <img src={heroUrl} alt={`hero image for ${venue.venueName}`} loading="lazy" />
                    {isSunny && (
                        <div className="map--sidebar__sunny">☀️ sunny terrace right now</div>
                    )}
                </div>
            )}

            <div className="map--sidebar__content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h2 className="map--sidebar__name">{venue.venueName}</h2>
                    <SaveVenueButton venueId={venue.id} venueName={venue.venueName} />
                </div>

                {address && (
                    <p className="map--sidebar__address">
                        {address.street} {address.houseNumber}, {address.postalCode} {address.city}
                    </p>
                )}

                {items.length > 0 && (
                    <div className="map--sidebar__tags">
                        {items.map((item) => (
                            <Link key={item.id || item.name} href={`/venues/${item.name}`} className="map--sidebar__tag">
                                {item.name}
                            </Link>
                        ))}
                        {venue.damage && (
                            <span className="map--sidebar__tag">
                                {venue.damage.replaceAll('*', '€')}
                            </span>
                        )}
                    </div>
                )}

                <hr className="map--sidebar__divider" />

                {venue.information?.hours && venue.information.hours.length > 1 && (
                    <div className="map--sidebar__hours">
                        {venue.information.hours.map((day) => (
                            <div
                                key={day.id || day.dayOfWeek}
                                className={`map--sidebar__hour-row ${day.dayOfWeek === today ? 'today' : ''}`}
                            >
                                <span>{day.dayOfWeek}</span>
                                <span>
                                    {day.isClosed
                                        ? 'closed'
                                        : day.periods?.map(p =>
                                            `${p.openTime || ''}–${p.closeTime || p.closeTimeSpecial || ''}`
                                        ).join(', ')
                                    }
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <hr className="map--sidebar__divider" />

                <div className="map--sidebar__actions">
                    <button className="map--sidebar__btn" onClick={onDirections}>
                        {routeInfo
                            ? `${routeInfo.distanceKm} km · ~${routeInfo.durationMin} min →`
                            : 'get directions →'
                        }
                    </button>

                    {venue.information?.reservations && (
                        <a
                            href={venue.information.reservations}
                            className="map--sidebar__btn map--sidebar__btn--primary"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            book a table
                        </a>
                    )}

                    <Link href={`/venue/${venue.url}`} className="map--sidebar__btn">
                        read review →
                    </Link>
                </div>
            </div>
        </div>
    );
};

// ── Main Map Component ────────────────────────────────────────
const Map = ({}) => {
    const [target, setTarget] = useState(null);
    const [location, setLocation] = useState(null);
    const [visible, setVisible] = useState(false);
    const [openFilters, setOpenFilters] = useState(false);
    const [filterSheetOpen, setFilterSheetOpen] = useState(false);
    const [showOpenOnly, setShowOpenOnly] = useState(false);
    const [showSavedOnly, setShowSavedOnly] = useState(false);
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedService, setSelectedService] = useState([]);
    const [selectedBudget, setSelectedBudget] = useState([]);
    const [hasTakeAway, setHasTakeAway] = useState(false);
    const [hasTerrace, setHasTerrace] = useState(false);
    const [hasSunnyTerrace, setHasSunnyTerrace] = useState(false);
    const [routeDestination, setRouteDestination] = useState(null);
    const [routeInfo, setRouteInfo] = useState(null);

    const { locationColor } = useContext(LocationColorContext);
    const { user } = useUser();
    const isMobile = useIsMobile();
    const [cuisines, setCuisines] = useState([]);
    const [selectedCuisine, setSelectedCuisine] = useState([]);
    const [selectedDish, setSelectedDish] = useState([]);
    const [initialFiltersAnimated, setInitialFiltersAnimated] = useState(false);
    const [userPosition, setUserPosition] = useState(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const [isMounted, setIsMounted] = useState(false);
    const mapRef = useRef();

    const atmosphere = useMapAtmosphere(locationColor.location);

    useEffect(() => {
        const timeout = setTimeout(() => setIsMounted(true), 50);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => setInitialFiltersAnimated(true), isMobile ? 200 : 800);
        return () => clearTimeout(timeout);
    }, [isMobile]);

    // Desktop: open filters panel automatically
    useEffect(() => {
        if (isMobile === null || isMobile === undefined) return;
        const timeout = setTimeout(() => { if (!isMobile) setOpenFilters(true); }, 50);
        return () => clearTimeout(timeout);
    }, [isMobile]);

    useEffect(() => {
        const getCuisines = async () => {
            const _cuisines = await fetchAPI("cuisine", "en", { limit: 600 });
            setCuisines(_cuisines.docs);
        };
        getCuisines();
    }, [location]);

    const [venues, setVenues] = useState([]);
    useEffect(() => {
        const getVenues = async () => {
            const result = await fetchAPI("venues", "en", { limit: 800 });
            setVenues(result.docs);
        };
        getVenues();
    }, []);

    // Handle ?venue= params from Near Me / venue page
    useEffect(() => {
        const venueUrl = searchParams.get('venue');
        const lat = searchParams.get('lat');
        const lng = searchParams.get('lng');
        const isDirections = searchParams.get('directions') === 'true';
        if (!venueUrl || !lat || !lng) return;

        const destLat = parseFloat(lat);
        const destLng = parseFloat(lng);
        setMapCenter([destLat, destLng]);
        setZoom(16);
        setRouteDestination({ lat: destLat, lng: destLng });

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                () => {}
            );
        }

        const interval = setInterval(() => {
            if (venues.length > 0) {
                const found = venues.find(v => v.url === venueUrl);
                if (found) {
                    setTarget(found);
                    // Suppress popup on mobile when coming from directions
                    if (!isDirections || !isMobile) setVisible(true);
                }
                clearInterval(interval);
            }
        }, 100);
        return () => clearInterval(interval);
    }, [searchParams, venues]);

    const { data: sunnyVenueIds = new Set() } = useSunnyVenues(venues);

    const [zoom, setZoom] = useState(12.5);
    const [mapCenter, setMapCenter] = useState([51.0544, 3.7256]);

    const colorToCoordinatesMap = {
        'gent': [51.0544, 3.7256],
        'brussels': [50.848375753126724, 4.357218040236126],
        'antwerp': [51.22307671016094, 4.410658141685829]
    };

    useEffect(() => {
        setMapCenter(colorToCoordinatesMap[locationColor.location]);
        setZoom(12.5);
    }, [locationColor]);

    const isVenueSaved = (venueId) => {
        if (!user?.savedVenues) return false;
        return user.savedVenues.some(
            s => (typeof s.venue === 'object' ? s.venue.id : s.venue) === venueId
        );
    };

    const filteredVenues = useMemo(() => {
        return venues.filter((venue) => {
            const matchesArrayCondition = (venueArray, selectedArray, compareKey = 'name') =>
                selectedArray.length === 0 ||
                (venueArray ?? []).some((item) =>
                    selectedArray.some((selected) => selected[compareKey] === item[compareKey])
                );
            const budgetMap = {
                "💸": "*", "💸💸": "**", "💸💸💸": "***",
                "💸💸💸💸": "****", "💸💸💸💸💸": "*****"
            };
            return (
                venue._status === "published" &&
                (hasTakeAway ? venue.information?.takeAway : true) &&
                (hasTerrace ? venue.information?.hasTerrace : true) &&
                (showOpenOnly ? venue.information?.hours?.some(hour =>
                    hour.dayOfWeek === getCurrentDay() && !hour.isClosed &&
                    isCurrentlyInPeriod(hour.periods)
                ) : true) &&
                (hasSunnyTerrace ? sunnyVenueIds.has(venue.id) : true) &&
                (showSavedOnly ? isVenueSaved(venue.id) : true) &&
                matchesArrayCondition(venue.information?.cuisine, selectedCuisine) &&
                matchesArrayCondition(venue.information?.dishes, selectedDish) &&
                (selectedDays.length > 0 ? (venue.information?.hours ?? []).some((hour) =>
                    selectedDays.some(day => hour.dayOfWeek === day && !hour.isClosed)
                ) : true) &&
                (selectedService.length > 0 ? (venue.information?.serves ?? []).some((service) =>
                    selectedService.includes(service)
                ) : true) &&
                (selectedBudget.length > 0 ? selectedBudget.map(emoji => budgetMap[emoji]).includes(venue.damage) : true)
            );
        });
    }, [venues, hasTakeAway, hasTerrace, showOpenOnly, hasSunnyTerrace, sunnyVenueIds,
        showSavedOnly, user, selectedCuisine, selectedDish, selectedDays, selectedService, selectedBudget]);

    const dayMap = {
        'monday': 'monday', 'tuesday': 'tuesday', 'wednesday': 'wednesday',
        'thursday': 'thursday', 'friday': 'friday', 'saturday': 'saturday', 'sunday': 'sunday'
    };

    const clearRoute = () => {
        setRouteDestination(null);
        setRouteInfo(null);
    };

    const toggleDay = (day) => {
        clearRoute();
        const fullDay = dayMap[day.toLowerCase()] || day;
        setSelectedDays(prev => prev.includes(fullDay) ? prev.filter(d => d !== fullDay) : [...prev, fullDay]);
    };

    const toggleService = (service) => {
        clearRoute();
        setSelectedService(prev => prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]);
    };

    const toggleBudget = (budget) => {
        clearRoute();
        setSelectedBudget(prev => prev.includes(budget) ? prev.filter(b => b !== budget) : [...prev, budget]);
    };

    const activeFiltersCount = useMemo(() => (
        (showOpenOnly ? 1 : 0) + (hasTerrace ? 1 : 0) + (hasTakeAway ? 1 : 0) +
        (showSavedOnly ? 1 : 0) + selectedDays.length + selectedService.length +
        selectedDish.length + selectedCuisine.length + selectedBudget.length
    ), [showOpenOnly, hasTerrace, hasTakeAway, showSavedOnly, selectedDays, selectedService,
        selectedDish, selectedCuisine, selectedBudget, hasSunnyTerrace, sunnyVenueIds]);

    const createCustomIcon = (venue, color) => {
        const isSunny = sunnyVenueIds.has(venue.id);
        const isSaved = isVenueSaved(venue.id);
        if (isSunny) {
            return L.divIcon({
                className: "custom-marker-icon",
                html: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="9" fill="${color}" stroke="black" stroke-width="1.5"/>
                    <circle cx="16" cy="16" r="13" fill="none" stroke="#FFB700" stroke-width="2" stroke-dasharray="3 2"/>
                </svg>`,
                iconSize: [32, 32], iconAnchor: [16, 16]
            });
        }
        if (isSaved) {
            return L.divIcon({
                className: "custom-marker-icon",
                html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="${color}" stroke="black" stroke-width="2.5"><circle cx="12" cy="12" r="10"/></svg>`,
                iconSize: [28, 28], iconAnchor: [14, 14]
            });
        }
        return L.divIcon({
            className: "custom-marker-icon",
            html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${color}" stroke="black" stroke-width="1.5"><circle cx="12" cy="12" r="10"/></svg>`,
            iconSize: [24, 24], iconAnchor: [12, 12]
        });
    };

    const createCustomClusterIcon = (cluster) => new divIcon({
        html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
        className: '',
    });

    const getColorForClub = (club) => {
        switch (club) {
            case "antwerp": return getCSSVariableValue("--color-antwerp-main");
            case "gent": return getCSSVariableValue("--color-gent-main");
            default: return getCSSVariableValue("--color-brussels-main");
        }
    };

    const handleClose = () => {
        setVisible(false);
        setTarget(null);
        setRouteDestination(null);
        setRouteInfo(null);
    };

    const handleMapClick = () => handleClose();

    const handleFilters = () => {
        if (isMobile) {
            // Mobile: open bottom sheet
            setFilterSheetOpen(!filterSheetOpen);
            if (visible) { setVisible(false); setTarget(null); }
        } else {
            // Desktop: toggle side panel
            setOpenFilters(!openFilters);
        }
        clearRoute();
    };

    const handleDirections = () => {
        if (!target) return;
        const lat = target.information?.address?.longitude;
        const lng = target.information?.address?.latitude;
        if (!lat || !lng) return;
        setRouteDestination({ lat, lng });
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                () => {}
            );
        }
    };

    const getPopupSavedLabel = (venueId) => {
        if (!user?.savedVenues || !venueId) return null;
        const entry = user.savedVenues.find(
            s => (typeof s.venue === 'object' ? s.venue.id : s.venue) === venueId
        );
        if (!entry) return null;
        return entry.status === 'favourite' ? 'love it' : 'need to go';
    };

    const handleReset = () => {
        setShowOpenOnly(false);
        setHasTakeAway(false);
        setHasTerrace(false);
        setShowSavedOnly(false);
        setSelectedDays([]);
        setSelectedService([]);
        setSelectedDish([]);
        setSelectedCuisine([]);
        setSelectedBudget([]);
        clearRoute();
    };

    return (
        <div className={"map--ui_container"} style={{ overflow: "hidden", maxWidth: "100vw", maxHeight: "100vh", position: "relative" }}>

            {/* Atmospheric overlay */}
            {atmosphere.overlayColor && (
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundColor: atmosphere.overlayColor,
                    zIndex: 1000, pointerEvents: 'none',
                    transition: 'background-color 2s ease',
                }} />
            )}

            {/* Header */}
            <div className="map--ui_header">
                <div className={"back-button"} onClick={() => router.back()}>
                    <img src={back} width={30} height={30} alt="back-button" className={"back-button-icon"} />
                </div>
                <div className={"logo-container"}>
                    <Link href="/">
                        <img src={logo} alt="Food Club Logo" className="logo" width={120} height={200} style={{ width: '120px', height: 'auto' }} />
                    </Link>
                </div>
                <div style={{ margin: 'auto 10px', fontSize: '0.75rem', opacity: 0.6, color: 'var(--color-secondary)', textAlign: 'right' }}>
                    {atmosphere.timeOfDay === 'golden' && '🌅 golden hour'}
                    {atmosphere.timeOfDay === 'night' && '🌙 night mode'}
                </div>
            </div>

            {/* Main layout: map canvas + desktop sidebar */}
            <div className="map--layout" style={{ paddingTop: '55px', height: '100%' }}>
                <div className="map--canvas">

                    {/* Map */}
                    <MapContainer
                        ref={mapRef}
                        className={"map--ui"}
                        center={mapCenter}
                        zoom={zoom}
                        zoomControl={false}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <ChangeView center={mapCenter} zoom={zoom} disabled={!!routeDestination} />
                        <MapClickHandler onMapClick={handleMapClick} />
                        <TileLayer key={atmosphere.tileUrl} url={atmosphere.tileUrl} />
                        <MarkerClusterGroup chunkedLoading={true} iconCreateFunction={createCustomClusterIcon}>
                            {filteredVenues && filteredVenues.map((venue) => {
                                const color = getColorForClub(venue.club);
                                if (venue.information?.address?.longitude && venue.information?.address?.latitude && venue._status === "published") {
                                    return (
                                        <Marker
                                            key={venue.id}
                                            position={[venue.information.address.longitude, venue.information.address.latitude]}
                                            icon={createCustomIcon(venue, color)}
                                            eventHandlers={{
                                                click: (e) => {
                                                    e.originalEvent.stopPropagation();
                                                    clearRoute();
                                                    setTarget(venue);
                                                    setVisible(true);
                                                },
                                            }}
                                        />
                                    );
                                }
                            })}
                        </MarkerClusterGroup>

                        {userPosition && (
                            <Marker
                                position={[userPosition.lat, userPosition.lng]}
                                icon={L.divIcon({
                                    className: "user-location-icon",
                                    html: `<div style="font-size: 24px;">📍</div>`,
                                    iconSize: [30, 30], iconAnchor: [15, 15],
                                })}
                            />
                        )}

                        {userPosition && routeDestination && (
                            <RoutingLine
                                from={userPosition}
                                to={routeDestination}
                                color="var(--color-secondary)"
                                onRouteFound={(info) => setRouteInfo(info)}
                            />
                        )}
                    </MapContainer>

                    {/* Filter button — works for both mobile (opens sheet) and desktop (toggles panel) */}
                    <div className="open-filter-button" onClick={handleFilters}>
                        <TuneIcon sx={{ color: 'var(--color-secondary)', cursor: 'pointer' }} />
                        {activeFiltersCount > 0 && <span className="filter-count-badge">{activeFiltersCount}</span>}
                    </div>

                    {/* My location button */}
                    <div className="my-location-button" onClick={() => {
                        if (!navigator.geolocation) { alert("Geolocation is not supported"); return; }
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                const { latitude, longitude } = position.coords;
                                setUserPosition({ lat: latitude, lng: longitude });
                                if (mapRef.current) mapRef.current.setView([latitude, longitude], 17);
                            },
                            () => { alert("Unable to retrieve your location"); }
                        );
                    }}>
                        <MyLocationIcon sx={{ color: 'var(--color-secondary)', cursor: 'pointer' }} />
                    </div>

                    {/* ── Desktop filter panel (hidden on mobile) ── */}
                    {!isMobile && (
                        <div className={`map--filters_container ${!openFilters ? 'hidden' : ''} ${initialFiltersAnimated ? '' : 'hidden'}`}>
                            <div className={"map--filter_info"}><p>LOOKING FOR</p></div>
                            {isMounted && (
                                <div className={"map--filters_pills-container"}>
                                    {[
                                        { id: "open", label: "open now", active: showOpenOnly, toggle: () => { clearRoute(); setShowOpenOnly(!showOpenOnly); } },
                                        { id: "terrace", label: "terrace", active: hasTerrace, toggle: () => { clearRoute(); setHasTerrace(!hasTerrace); } },
                                        { id: "take-away", label: "take-away", active: hasTakeAway, toggle: () => { clearRoute(); setHasTakeAway(!hasTakeAway); } },
                                        ...(user ? [{ id: "my-list", label: "my list", active: showSavedOnly, toggle: () => { clearRoute(); setShowSavedOnly(!showSavedOnly); } }] : []),
                                    ].map(({ id, label, active, toggle }) => (
                                        <div key={id} id={id} className={`map--filters_pill ${!active ? 'inactive' : ''}`} onClick={toggle}>
                                            <p>{label}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className={"map--filter_info"}><p>OPEN ON</p></div>
                            {isMounted && (
                                <div className={"map--filters_pills-container open-on-day"}>
                                    {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                                        <div key={day} className={selectedDays.includes(dayMap[day]) ? "map--filters_pill" : "inactive map--filters_pill"}>
                                            <p onClick={() => toggleDay(day)}>{day}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className={"map--filter_info"}><p>SERVES:</p></div>
                            {isMounted && (
                                <div className={"map--filters_pills-container"}>
                                    {["breakfast", "brunch", "lunch", "dinner", "snack", "drinks", "coffee"].map((service) => (
                                        <div key={service} className={selectedService.includes(service) ? "map--filters_pill" : "map--filters_pill inactive"}>
                                            <p onClick={() => toggleService(service)}>{service}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className={"map--filter_info"}><p>BUDGET</p></div>
                            {isMounted && (
                                <div className={"map--filters_pills-container"}>
                                    {["💸", "💸💸", "💸💸💸", "💸💸💸💸", "💸💸💸💸💸"].map((fist) => (
                                        <div key={fist} className={selectedBudget.includes(fist) ? "map--filters_pill" : "map--filters_pill inactive"}>
                                            <p onClick={() => toggleBudget(fist)}>{fist}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {isMounted && (
                                <div style={{ padding: "0 10px" }}>
                                    <p>looking for a specific dish?</p>
                                    {cuisines.length > 0 && (
                                        <Autocomplete freeSolo disablePortal multiple
                                                      options={cuisines.filter(c => c.type === "dish")}
                                                      getOptionLabel={(option) => option.name}
                                                      value={selectedDish}
                                                      onChange={(_, newValue) => { clearRoute(); setSelectedDish(newValue); }}
                                                      sx={{ width: 330, backgroundColor: '#fff', '& .MuiInputBase-root': { backgroundColor: '#f9f9f9' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-main)', borderStyle: 'dotted' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-secondary)', borderStyle: 'dotted' }, '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-secondary)', borderStyle: 'dotted' } }}
                                                      renderInput={(params) => <TextField {...params} placeholder="Pick your dish…" />}
                                                      renderTags={(value, getTagProps) => value.map((option, index) => (
                                                          <Chip key={index} label={option.name} {...getTagProps({ index })} sx={{ backgroundColor: 'var(--color-secondary)', color: '#fff', borderRadius: '12px', fontSize: '0.8rem', padding: '0 8px', '& .MuiChip-deleteIcon': { color: '#fff' } }} />
                                                      ))}
                                        />
                                    )}
                                </div>
                            )}

                            <div style={{ padding: "0 10px" }}>
                                <p>a cuisine in mind?</p>
                                {cuisines.length > 0 && (
                                    <Autocomplete freeSolo disablePortal multiple
                                                  options={cuisines.filter(c => c.type === "cuisine")}
                                                  getOptionLabel={(option) => option.name}
                                                  value={selectedCuisine}
                                                  onChange={(_, newValue) => { clearRoute(); setSelectedCuisine(newValue); }}
                                                  sx={{ width: 330, backgroundColor: 'white', '& .MuiInputBase-root': { backgroundColor: '#f9f9f9' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-main)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-secondary)' }, '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-secondary)' } }}
                                                  renderInput={(params) => <TextField {...params} placeholder="Pick your cuisine…" />}
                                                  renderTags={(value, getTagProps) => value.map((option, index) => (
                                                      <Chip key={index} label={option.name} {...getTagProps({ index })} sx={{ backgroundColor: 'var(--color-secondary)', color: '#fff', borderRadius: '12px', fontSize: '0.8rem', padding: '0 8px', '& .MuiChip-deleteIcon': { color: '#fff' } }} />
                                                  ))}
                                    />
                                )}
                            </div>

                            {activeFiltersCount > 0 && (
                                <div style={{ padding: "10px" }}>
                                    <button onClick={handleReset} className={"map--filters_reset"}>
                                        reset filters
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {isMobile && (() => {
                        console.log('VenueBottomSheet props:', { visible, target: target?.venueName, isOpen: visible && !!target });
                        return (
                            <VenueBottomSheet
                                venue={visible ? target : null}
                                isOpen={visible && !!target}
                                isSunny={target ? sunnyVenueIds.has(target.id) : false}
                                routeInfo={routeInfo}
                                savedLabel={getPopupSavedLabel(target?.id)}
                                onClose={handleClose}
                                onDirections={handleDirections}
                            />
                        );
                    })()}

                    {/* ── Mobile filter bottom sheet ── */}
                    {isMobile && (
                        <FilterBottomSheet
                            isOpen={filterSheetOpen}
                            onClose={() => setFilterSheetOpen(false)}
                            isMounted={isMounted}
                            showOpenOnly={showOpenOnly} setShowOpenOnly={setShowOpenOnly}
                            hasTerrace={hasTerrace} setHasTerrace={setHasTerrace}
                            hasTakeAway={hasTakeAway} setHasTakeAway={setHasTakeAway}
                            showSavedOnly={showSavedOnly} setShowSavedOnly={setShowSavedOnly}
                            selectedDays={selectedDays} toggleDay={toggleDay}
                            selectedService={selectedService} toggleService={toggleService}
                            selectedBudget={selectedBudget} toggleBudget={toggleBudget}
                            selectedDish={selectedDish} setSelectedDish={setSelectedDish}
                            selectedCuisine={selectedCuisine} setSelectedCuisine={setSelectedCuisine}
                            cuisines={cuisines}
                            user={user}
                            activeFiltersCount={activeFiltersCount}
                            filteredCount={filteredVenues.length}
                            onReset={handleReset}
                            clearRoute={clearRoute}
                        />
                    )}
                </div>

                {/* ── Desktop venue sidebar ── */}
                {!isMobile && (
                    <VenueSidebar
                        venue={visible ? target : null}
                        isSunny={target ? sunnyVenueIds.has(target.id) : false}
                        onClose={handleClose}
                        onDirections={handleDirections}
                        routeInfo={routeInfo}
                    />
                )}
            </div>
        </div>
    );
};

export default Map;