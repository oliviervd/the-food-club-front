'use client'

import {MapContainer, Marker, TileLayer, useMap} from "react-leaflet";
import {divIcon} from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import {useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {fetchAPI, getCSSVariableValue} from "/utils/utils.jsx";
import {LocationColorContext} from "/contexts/LocationColorContext.jsx";
import DitherImage from "/components/DitherImage.jsx";
import Link from "next/link.js";
import Image from "next/image.js";
import {useIsMobile} from "../../../hooks/isMobile.jsx";
import {Autocomplete, Chip, TextField} from "@mui/material";

const logo = '/assets/img/logo-blue.png';
const back = '/assets/img/back.png';

// todo add container that shows preview of the selected item
// todo add icons to zoom in / zoom out / show my location.
// todo: add header as absolute element over map container (so you can also hide it if you want)


// Custom hook to update the map center
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
    const [openFilters, setOpenFilters] = useState(true);
    const [showOpenOnly, setShowOpenOnly] = useState(false); // Default: show all venues
    const [selectedDays, setSelectedDays] = useState([]); // set and store days for filter per day
    const [selectedService, setSelectedService] = useState([]); // set and store selected service
    const [showLocation, setShowLocation] = useState(false); // show the menu to switch location on mobile
    const [hasTakeAway, setHasTakeAway] = useState(false); // default
    const [hasTerrace, setHasTerrace] = useState(false); // default
    const { locationColor, handleLocationChange } = useContext(LocationColorContext);
    const isMobile = useIsMobile();
    const [cuisines, setCuisines] = useState([]);
    const [selectedCuisine, setSelectedCuisine] = useState([]);
    const [selectedDish, setSelectedDish] = useState([]);
    const [initialFiltersAnimated, setInitialFiltersAnimated] = useState(false);


    // add time to mount. - ANIMATIONS
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setIsMounted(true), 50); // short delay to let styles apply
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setInitialFiltersAnimated(true);
        }, isMobile ? 200 : 800); // shorter timeout for mobile, if needed
        return () => clearTimeout(timeout);
    }, [isMobile]);

    useEffect(()=>{
        // set filters closed by default on mobile device.
        if (isMobile) {
            setOpenFilters(false);
        }
    }, [isMobile]);

    useEffect(() => {
        const getCuisines = async() => {
            const _cuisines = await fetchAPI("cuisine", "en", {limit: 1000})
            setCuisines(_cuisines.docs);
        }
        getCuisines()
    },[location])


    let [zoom, setZoom] = useState(12.5) // set zoom of map
    const [mapCenter, setMapCenter] = useState([51.0544, 3.7256]); // Initial coordinates
    const nav = useRouter();

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
        const result = await fetchAPI("venues", "en", {limit: 1000});
        setVenues(result.docs)
    }

    useEffect(() => {
        getVenues();
    },[])

    console.log(venues)

    const filteredVenues = venues.filter((venue) => {
        // No filters active - show all published venues
        if (!showOpenOnly && !hasTakeAway && !hasTerrace && selectedCuisine.length === 0 &&
            selectedDish.length === 0 && selectedDays.length === 0 && selectedService.length === 0) {
            return venue._status === "published";
        }

        // Apply filters if any are active
        const isOpen = showOpenOnly
            ? venue.information?.hours?.some(hour =>
                hour.dayOfWeek === getCurrentDay() &&
                !hour.isClosed &&
                isCurrentlyInPeriod(hour.periods)
            )
            : true;

        const takeAway = hasTakeAway ? venue.information?.takeAway : true;
        const terrace = hasTerrace ? venue.information?.hasTerrace : true;


        const matchesCuisine = selectedCuisine.length > 0
            ? (venue.information?.cuisine ?? []).some((cuisine) =>
                selectedCuisine.some((selected) => selected.name === cuisine.name)
            )
            : true;

        const matchesDish = selectedDish.length > 0
            ? (venue.information?.dishes ?? []).some((dish) =>
                selectedDish.some((selected) => selected.name === dish.name)
            )
            : true;

        const openOnSelectedDays = selectedDays.length > 0
            ? (venue.information?.hours ?? []).some((hour) =>
                selectedDays.some(day => hour.dayOfWeek === day && !hour.isClosed)
            )
            : true;

        // todo: add selection based on Lunch, Dinner, Brunch, Breakfast. - substract this from the time.
        // information.serves

        const matchedService = selectedService.length > 0
            ? (venue.information?.serves ?? []).some((service) => {
                return selectedService.includes(service);
            })
            : true;

        return venue._status === "published" &&
            isOpen &&
            matchesCuisine &&
            matchesDish &&
            takeAway &&
            terrace &&
            matchedService &&
            openOnSelectedDays;
    });

    const dayMap = {
        'monday': 'monday',
        'tuesday': 'tuesday',
        'wednesday': 'wednesday',
        'thursday': 'thursday',
        'friday': 'friday',
        'saturday': 'saturday',
        'sunday': 'sunday'
    };

    const toggleDay = (day) => {

        const fullDay = dayMap[day.toLowerCase()];

        if (fullDay) {
            setSelectedDays(prevDays => {
                const isAlreadySelected = prevDays.includes(fullDay);

                if (isAlreadySelected) {
                    // Remove the day if it's already selected
                    return prevDays.filter(d => d !== fullDay);
                } else {
                    // Add the day if it's not selected
                    return [...prevDays, fullDay];
                }
            });
        }
    };

    const toggleService = (service) => {
        setSelectedService((prevServices) => {
            const isAlreadySelected = prevServices.includes(service);
            if (isAlreadySelected) {
                return prevServices.filter((s) => s !== service);
            } else {
                return [...prevServices, service];
            }
        });
    };


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

    const handleCityChange = (city) => {
        handleLocationChange(city)
    }

    const handleFilters = () => {
        // functions that handles the filter button
        setOpenFilters(!openFilters); // open filters
        setShowLocation(false);
        // if mobile --> hide detailpane of venue.
        if (isMobile) {
            setVisible(false)
        }
    }

    const handleOpenLocation = () => {
        setVisible(false);
        setOpenFilters(false);
        setShowLocation(!showLocation);
    }


    return(
        <div className={"map--ui_container"}
             style={{ overflow: "hidden", maxWidth: "100vw", maxHeight: "100vh", position: "relative" }}>
            <div className="map--ui_header">
                <div className={"back-button"} onClick={()=>nav.back()}>
                    <Image
                        src={back}
                        width={30}
                        height={30}
                        className={"back-button-icon"}
                    />
                </div>
                <div className={"logo-container"}>
                    <Link href="/">
                        <Image
                            src={logo}
                            alt="Food Club Logo"
                            className="logo"
                            width={120}
                            height={200}
                            style={{
                                width: 'auto',
                                height: 'auto',
                            }}
                        />
                    </Link>
                </div>
                <div className={"pill-container"}>
                    <div className={"pill"} onClick={()=>{handleLocationChange("gent")}}>GENT</div>
                    <div className={"pill"} onClick={()=>{handleLocationChange("antwerp")}}>ANTWERP</div>
                    <div className={"pill"} onClick={()=>{handleLocationChange("brussels")}}>BRUSSELS</div>
                </div>
            </div>
            {/*<Header style={{position: "fixed"}} selectedTab={"map"} landing={true} interact={true} setLocation={setLocation} location={location} setTarget={setTarget} map={true}/>*/}
            <div style={{height: '100%', width: '100%', position: 'relative'}}>
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
                            if (venue.information.address.longitude && venue.information.address.latitude && venue["_status"] === "published") {
                                return (
                                    <Marker
                                        key={venue.id}
                                        position={[venue.information.address.longitude, venue.information.address.latitude]}
                                        icon={createCustomIcon(color)}
                                        eventHandlers={{
                                            click: () => {
                                                setVisible(true);
                                                setTarget(venue);
                                            },
                                        }}
                                    />

                                )
                            }
                        })}
                    </MarkerClusterGroup>
                </MapContainer>
                <div className={"open-filter-button"} onClick={()=>handleFilters()}>
                    <p>
                        &#8633;
                    </p>
                </div>
                {isMobile &&
                    <div className={"open-location-button"} onClick={()=>handleOpenLocation()}>
                        <p>
                            🌐
                        </p>
                    </div>
                }
                {!visible &&
                    <div className={showLocation ? "location-container": "location-container hidden"}>
                        <p
                            className={`location--pill ${locationColor.location === "gent" ? "selected" : ""}`}
                            onClick={() => handleCityChange("gent")}
                        >
                            gent
                        </p>
                        <p
                            className={`location--pill ${locationColor.location === "antwerp" ? "selected" : ""}`}
                            onClick={() => handleCityChange("antwerp")}
                        >
                            antwerp
                        </p>
                        <p
                            className={`location--pill ${locationColor.location === "brussels" ? "selected" : ""}`}
                            onClick={() => handleCityChange("brussels")}
                        >
                            brussels
                        </p>
                    </div>
                }
                <div className={`map--filters_container ${!openFilters ? 'hidden' : ''} ${initialFiltersAnimated ? '' : 'hidden'}`}>
                    <div className={"map--filter_info"}>
                        <p>LOOKING FOR</p>
                    </div>
                    {isMounted &&
                       <div className={"map--filters_pills-container"}>

                           <div
                               id={"open"}
                               className={`map--filters_pill ${!showOpenOnly ? 'inactive' : ''}`}
                               onClick={()=>setShowOpenOnly(!showOpenOnly)}
                           >
                               <p>open now</p>
                           </div>
                           <div
                               id={"terrace"}
                               className={`map--filters_pill ${!hasTerrace ? 'inactive' : ''}`}
                               onClick={()=>setHasTerrace(!hasTerrace)}
                           >
                               <p>terrace</p>
                           </div>
                            <div
                                id={"take-away"}
                                className={`map--filters_pill ${!hasTakeAway ? 'inactive' : ''}`}
                                onClick={()=>setHasTakeAway(!hasTakeAway)}
                            >
                                <p>take-away</p>
                            </div>
                       </div>
                    }
                    <div className={"map--filter_info"}>
                        <p>OPEN ON</p>
                    </div>
                    {isMounted &&
                        <div className={"map--filters_pills-container open-on-day"}>
                            {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                                <div className={selectedDays.includes(dayMap[day.toLowerCase()]) ?  "map--filters_pill" : "inactive map--filters_pill"}>
                                    <p
                                        key={day}
                                        onClick={() => toggleDay(day)}

                                    >
                                        {day.toLowerCase()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    }

                    <div className={"map--filter_info"}>
                        <p>SERVES:</p>
                    </div>

                    {isMounted &&
                        <div className={"map--filters_pills-container"}>
                            {
                                ["breakfast", "brunch", "lunch", "dinner", "snack", "drinks", "coffee"].map((service) => (
                                    <div className={selectedService.includes(service) ? "map--filters_pill": "map--filters_pill inactive"}>
                                        <p
                                            key={service}
                                            onClick={()=>toggleService(service)}
                                        >
                                            {service}
                                        </p>
                                    </div>
                                ))
                            }
                        </div>
                    }

                    {isMounted && (
                        <div style={{ padding: "0 10px" }}>
                            <p>looking for a specific dish? 🍕🍱🍔</p>

                            {cuisines.length > 0 && (
                                <Autocomplete
                                    freeSolo
                                    disablePortal
                                    multiple
                                    options={cuisines.filter((cuisine) => cuisine.type === "dish")}
                                    getOptionLabel={(option) => option.name}
                                    value={selectedDish}
                                    onChange={(event, newValue) => {
                                        setSelectedDish(newValue);
                                        console.log("Selected dish:", newValue);
                                    }}
                                    sx={{
                                        width: 330,
                                        backgroundColor: '#fff',
                                        '& .MuiInputBase-root': {
                                            backgroundColor: '#f9f9f9',
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'var(--color-main)',
                                            borderStyle: 'dotted',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'var(--color-secondary)',
                                            borderStyle: 'dotted',
                                        },
                                        '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'var(--color-secondary)',
                                            borderStyle: 'dotted',
                                        },
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Pick your dish…"
                                        />
                                    )}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip
                                                label={option.name}
                                                {...getTagProps({ index })}
                                                sx={{
                                                    backgroundColor: 'var(--color-secondary)',
                                                    color: '#fff',
                                                    borderRadius: '12px',
                                                    fontSize: '0.8rem',
                                                    padding: '0 8px',
                                                    '& .MuiChip-deleteIcon': {
                                                        color: '#fff',
                                                    },
                                                }}
                                            />
                                        ))
                                    }
                                />
                            )}
                        </div>
                    )}

                    {isMounted &&
                        <div style={{padding: "0 10px"}}>
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
                                    sx={{
                                        width: 330,
                                        backgroundColor: 'white',
                                        '& .MuiInputBase-root': {
                                            backgroundColor: '#f9f9f9',
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'var(--color-main)',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'var(--color-secondary)',
                                        },
                                        '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'var(--color-secondary)',
                                        },
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Pick your cuisine…"
                                        />
                                    )}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip
                                                label={option.name}
                                                {...getTagProps({ index })}
                                                sx={{
                                                    backgroundColor: 'var(--color-secondary)',
                                                    color: '#fff',
                                                    borderRadius: '12px',
                                                    fontSize: '0.8rem',
                                                    padding: '0 8px',
                                                    '& .MuiChip-deleteIcon': {
                                                        color: '#fff',
                                                    },
                                                }}
                                            />
                                        ))
                                    }
                                />

                            }
                        </div>
                    }
                    {/*

                    {isMobile && isMounted &&
                        <div className={openFilters ? "map--filter_submit": "map--filter_submit hidden"} onClick={()=>handleFilters()}>
                    <p> set filters </p>
                </div>
                }

                    */}


                </div>



                {visible && target &&
                    <div
                        onClick={() => setVisible(!visible)}
                        className={visible ? "map--popup" : "map--popup hidden-mobile"}
                    >
                        {/*<Banner content={target.venueName}/>*/}

                        <div className={"category-list__box"}>
                            <div className={"category-list__box-close"}>
                                <p>
                                    &#10005;
                                </p>
                            </div>
                            <Link href={`/venue/${target.url}`}>
                                <DitherImage url={target.media.hero.sizes.tablet.url}/>
                                <h2 style={{textAlign: "center"}}>{target.venueName}</h2>
                            </Link>
                        </div>

                        <div className={"pill-container"}>
                            {[...(target.information?.cuisine || []), ...(target.information?.dishes || [])].map((item, index) => (
                                <p className={"pill"}><Link href={`/venues?cuisine=${item.name}`}>{item.name}</Link></p>
                            ))}
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}
export default Map