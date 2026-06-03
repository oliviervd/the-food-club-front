'use client'

import {MapContainer, Marker, TileLayer, useMap} from "react-leaflet";
import {divIcon} from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import React, {useContext, useEffect, useState, useMemo, useCallback, useRef} from "react";
import {useRouter} from "next/navigation";
import {fetchAPI, getCSSVariableValue} from "/utils/utils.jsx";
import {LocationColorContext} from "/contexts/LocationColorContext.jsx";
import Link from "next/link.js";
import {useIsMobile} from "../../../hooks/isMobile.jsx";
import {Autocomplete, Chip, TextField} from "@mui/material";
import { useSunnyVenues } from '../../../hooks/weather/useSunnyVenues';

import TuneIcon from '@mui/icons-material/Tune';
import MyLocationIcon from '@mui/icons-material/MyLocation';

const logo = '/assets/img/logo-blue.png';
const back = '/assets/img/Back.png';

const getHeroUrl = (media, preferred = 'tablet') => {
    const sizes = media?.hero?.sizes || {};
    const isValidUrl = (url) => {
        if (!url || typeof url !== 'string') return false;
        try {
            const parsed = new URL(url);
            return parsed.pathname.length > 1;
        } catch {
            return false;
        }
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

const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

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

const Map = ({}) => {
    const [target, setTarget] = useState(null);
    const [location, setLocation] = useState(null);
    const [visible, setVisible] = useState(true);
    const [openFilters, setOpenFilters] = useState(false);
    const [showOpenOnly, setShowOpenOnly] = useState(false);
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedService, setSelectedService] = useState([]);
    const [selectedBudget, setSelectedBudget] = useState([]);
    const [showLocation, setShowLocation] = useState(false);
    const [hasTakeAway, setHasTakeAway] = useState(false);
    const [hasTerrace, setHasTerrace] = useState(false);
    const [hasSunnyTerrace, setHasSunnyTerrace] = useState(false);

    const { locationColor, handleLocationChange } = useContext(LocationColorContext);
    const isMobile = useIsMobile();
    const [cuisines, setCuisines] = useState([]);
    const [selectedCuisine, setSelectedCuisine] = useState([]);
    const [selectedDish, setSelectedDish] = useState([]);
    const [initialFiltersAnimated, setInitialFiltersAnimated] = useState(false);
    const [userPosition, setUserPosition] = useState(null);

    const nav = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const mapRef = useRef();

    useEffect(() => {
        const timeout = setTimeout(() => setIsMounted(true), 50);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setInitialFiltersAnimated(true);
        }, isMobile ? 200 : 800);
        return () => clearTimeout(timeout);
    }, [isMobile]);

    useEffect(() => {
        if (isMobile === null || isMobile === undefined) return;
        const timeout = setTimeout(() => {
            if (!isMobile) setOpenFilters(true);
        }, 50);
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

    const { data: sunnyVenueIds = new Set(), isLoading: isCalculatingSun } = useSunnyVenues(venues);

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
                (showOpenOnly
                    ? venue.information?.hours?.some(hour =>
                        hour.dayOfWeek === getCurrentDay() &&
                        !hour.isClosed &&
                        isCurrentlyInPeriod(hour.periods)
                    )
                    : true) &&
                (hasSunnyTerrace ? sunnyVenueIds.has(venue.id) : true) &&
                matchesArrayCondition(venue.information?.cuisine, selectedCuisine) &&
                matchesArrayCondition(venue.information?.dishes, selectedDish) &&
                (selectedDays.length > 0
                    ? (venue.information?.hours ?? []).some((hour) =>
                        selectedDays.some(day => hour.dayOfWeek === day && !hour.isClosed)
                    )
                    : true) &&
                (selectedService.length > 0
                    ? (venue.information?.serves ?? []).some((service) =>
                        selectedService.includes(service)
                    )
                    : true) &&
                (selectedBudget.length > 0
                    ? selectedBudget.map(emoji => budgetMap[emoji]).includes(venue.damage)
                    : true)
            );
        });
    }, [venues, hasTakeAway, hasTerrace, showOpenOnly, hasSunnyTerrace, sunnyVenueIds,
        selectedCuisine, selectedDish, selectedDays, selectedService, selectedBudget]);

    const dayMap = {
        'monday': 'monday', 'tuesday': 'tuesday', 'wednesday': 'wednesday',
        'thursday': 'thursday', 'friday': 'friday', 'saturday': 'saturday', 'sunday': 'sunday'
    };

    const toggleDay = (day) => {
        const fullDay = dayMap[day.toLowerCase()];
        if (fullDay) {
            setSelectedDays(prevDays =>
                prevDays.includes(fullDay)
                    ? prevDays.filter(d => d !== fullDay)
                    : [...prevDays, fullDay]
            );
        }
    };

    const toggleService = (service) => {
        setSelectedService(prev =>
            prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
        );
    };

    const toggleBudget = (budget) => {
        setSelectedBudget(prev =>
            prev.includes(budget) ? prev.filter(b => b !== budget) : [...prev, budget]
        );
    };

    const activeFiltersCount = useMemo(() => {
        return (
            (showOpenOnly ? 1 : 0) +
            (hasTerrace ? 1 : 0) +
            (hasTakeAway ? 1 : 0) +
            selectedDays.length +
            selectedService.length +
            selectedDish.length +
            selectedCuisine.length +
            selectedBudget.length
        );
    }, [showOpenOnly, hasTerrace, hasTakeAway, selectedDays, selectedService,
        selectedDish, selectedCuisine, selectedBudget, hasSunnyTerrace, sunnyVenueIds]);

    const createCustomIcon = (venue, color) => {
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
        });
    };

    const getColorForClub = (club) => {
        switch (club) {
            case "antwerp": return getCSSVariableValue("--color-antwerp-main");
            case "gent": return getCSSVariableValue("--color-gent-main");
            default: return getCSSVariableValue("--color-brussels-main");
        }
    };

    const handleFilters = () => {
        setOpenFilters(!openFilters);
        setShowLocation(false);
        if (isMobile) setVisible(false);
    };

    const openMapAPI = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

    return (
        <div className={"map--ui_container"}
             style={{ overflow: "hidden", maxWidth: "100vw", maxHeight: "100vh", position: "relative" }}>
            <div className="map--ui_header">
                <div className={"back-button"} onClick={() => nav.back()}>
                    <img
                        src={back}
                        width={30}
                        height={30}
                        alt="back-button"
                        className={"back-button-icon"}
                    />
                </div>
                <div className={"logo-container"}>
                    <Link href="/">
                        <img
                            src={logo}
                            alt="Food Club Logo"
                            className="logo"
                            width={120}
                            height={200}
                            style={{ width: '120px', height: 'auto' }}
                        />
                    </Link>
                </div>
            </div>

            <div style={{ height: '100%', width: '100%', position: 'relative' }}>
                <MapContainer
                    ref={mapRef}
                    className={"map--ui"}
                    center={mapCenter}
                    zoom={zoom}
                    zoomControl={false}
                >
                    <ChangeView center={mapCenter} zoom={zoom} />
                    <TileLayer url={openMapAPI} />
                    <MarkerClusterGroup chunkedLoading={true} iconCreateFunction={createCustomClusterIcon}>
                        {filteredVenues && filteredVenues.map((venue) => {
                            const color = getColorForClub(venue.club);
                            if (venue.information.address.longitude && venue.information.address.latitude && venue["_status"] === "published") {
                                return (
                                    <Marker
                                        key={venue.id}
                                        position={[venue.information.address.longitude, venue.information.address.latitude]}
                                        icon={createCustomIcon(venue, color)}
                                        eventHandlers={{
                                            click: () => {
                                                setVisible(true);
                                                setTarget(venue);
                                            },
                                        }}
                                    />
                                );
                            }
                        })}
                    </MarkerClusterGroup>
                    {userPosition && (
                        <Marker
                            position={userPosition}
                            icon={L.divIcon({
                                className: "user-location-icon",
                                html: `<div style="font-size: 24px;">📍</div>`,
                                iconSize: [30, 30],
                                iconAnchor: [15, 15],
                            })}
                        />
                    )}
                </MapContainer>

                <div className="open-filter-button" onClick={() => handleFilters()}>
                    <TuneIcon sx={{ color: 'var(--color-secondary)', cursor: 'pointer', transition: 'all 0.3s ease', '&:hover': { color: 'var(--color-main)', backgroundColor: 'var(--color-secondary)', borderRadius: '4px' } }} />
                    {activeFiltersCount > 0 && (
                        <span className="filter-count-badge">{activeFiltersCount}</span>
                    )}
                </div>

                <div
                    className="my-location-button"
                    onClick={() => {
                        if (!navigator.geolocation) { alert("Geolocation is not supported by your browser"); return; }
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                const { latitude, longitude } = position.coords;
                                setUserPosition([latitude, longitude]);
                                if (mapRef.current) mapRef.current.setView([latitude, longitude], 17);
                            },
                            (error) => { alert("Unable to retrieve your location"); }
                        );
                    }}
                >
                    <MyLocationIcon sx={{ color: 'var(--color-secondary)', cursor: 'pointer', transition: 'all 0.3s ease', '&:hover': { color: 'var(--color-main)', backgroundColor: 'var(--color-secondary)', borderRadius: '4px' } }} />
                </div>

                <div className={`map--filters_container ${!openFilters ? 'hidden' : ''} ${initialFiltersAnimated ? '' : 'hidden'}`}>
                    <div className={"map--filter_info"}><p>LOOKING FOR</p></div>
                    {isMounted && (
                        <div className={"map--filters_pills-container"}>
                            {[
                                { id: "open", label: "open now", active: showOpenOnly, toggle: () => { setShowOpenOnly(!showOpenOnly); if (isMobile) setOpenFilters(false); } },
                                { id: "terrace", label: "terrace", active: hasTerrace, toggle: () => { setHasTerrace(!hasTerrace); if (isMobile) setOpenFilters(false); } },
                                { id: "take-away", label: "take-away", active: hasTakeAway, toggle: () => { setHasTakeAway(!hasTakeAway); if (isMobile) setOpenFilters(false); } },
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
                                    <p onClick={() => { toggleDay(day); if (isMobile) setOpenFilters(false); }}>{day}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={"map--filter_info"}><p>SERVES:</p></div>
                    {isMounted && (
                        <div className={"map--filters_pills-container"}>
                            {["breakfast", "brunch", "lunch", "dinner", "snack", "drinks", "coffee"].map((service) => (
                                <div key={service} className={selectedService.includes(service) ? "map--filters_pill" : "map--filters_pill inactive"}>
                                    <p onClick={() => { toggleService(service); if (isMobile) setOpenFilters(false); }}>{service}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={"map--filter_info"}><p>BUDGET</p></div>
                    {isMounted && (
                        <div className={"map--filters_pills-container"}>
                            {["💸", "💸💸", "💸💸💸", "💸💸💸💸", "💸💸💸💸💸"].map((fist) => (
                                <div key={fist} className={selectedBudget.includes(fist) ? "map--filters_pill" : "map--filters_pill inactive"}>
                                    <p onClick={() => { toggleBudget(fist); if (isMobile) setOpenFilters(false); }}>{fist}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {isMounted && (
                        <div style={{ padding: "0 10px" }}>
                            <p>looking for a specific dish? 🍕🍱🍔</p>
                            {cuisines.length > 0 && (
                                <Autocomplete
                                    freeSolo disablePortal multiple
                                    options={cuisines.filter(c => c.type === "dish")}
                                    getOptionLabel={(option) => option.name}
                                    value={selectedDish}
                                    onChange={(event, newValue) => { setSelectedDish(newValue); if (isMobile) setOpenFilters(false); }}
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
                        <p>a cuisine in mind? 🇮🇹🇫🇷🇺🇸</p>
                        {cuisines.length > 0 && (
                            <Autocomplete
                                freeSolo disablePortal multiple
                                options={cuisines.filter(c => c.type === "cuisine")}
                                getOptionLabel={(option) => option.name}
                                value={selectedCuisine}
                                onChange={(event, newValue) => { setSelectedCuisine(newValue); if (isMobile) setOpenFilters(false); }}
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
                            <button
                                onClick={() => {
                                    setShowOpenOnly(false); setHasTakeAway(false); setHasTerrace(false);
                                    setSelectedDays([]); setSelectedService([]); setSelectedDish([]);
                                    setSelectedCuisine([]); if (isMobile) setOpenFilters(false);
                                }}
                                className={"map--filters_reset"}
                            >reset filters</button>
                        </div>
                    )}
                </div>

                {visible && target && target._status === "published" && (
                    (() => {
                        const heroUrl = getHeroUrl(target.media, 'mobileFriendly');
                        if (!heroUrl) return null;
                        return (
                            <div onClick={() => setVisible(!visible)} className={visible ? "map--popup" : "map--popup hidden-mobile"}>
                                <div className={"category-list__box"}>
                                    <div className={"category-list__box-close"}><p>&#10005;</p></div>
                                    <Link href={`/venue/${target.url}`}>
                                        <div style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%' }}>
                                            <img
                                                src={heroUrl}
                                                alt={`hero image for ${target.venueName}`}
                                                loading="lazy"
                                                style={{
                                                    objectFit: 'cover',
                                                    width: '100%',
                                                    height: '100%',
                                                    border: "2px solid var(--color-main)",
                                                    boxSizing: 'border-box',
                                                    display: 'block',
                                                }}
                                            />
                                        </div>
                                        <h2 style={{ textAlign: "center" }}>{target.venueName}</h2>
                                    </Link>
                                </div>
                                <div className={"pill-container"}>
                                    {[...(target.information?.cuisine || []), ...(target.information?.dishes || [])].map((item, index) => (
                                        <p key={index} className={"pill"}><Link href={`/venues/${item.name}`}>{item.name}</Link></p>
                                    ))}
                                </div>
                            </div>
                        );
                    })()
                )}
            </div>
        </div>
    );
};

export default Map;