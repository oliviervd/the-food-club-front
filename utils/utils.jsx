import { DateTime } from 'luxon';
import SunCalc from 'suncalc';

export function venueStatus(venue) {
    if (!venue?.information?.hours) return null;

    const days = {
        "monday": 1,
        "tuesday": 2,
        "wednesday": 3,
        "thursday": 4,
        "friday": 5,
        "saturday": 6,
        "sunday": 0
    };

    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    // Find the current day's schedule
    const todaySchedule = venue.information.hours.find(day => days[day.dayOfWeek] === currentDay);

    if (!todaySchedule) return "closed today";
    if (todaySchedule.isClosed) return "closed today";
    if (!todaySchedule.periods?.[0]) return "closed today";

    const { openTime, closeTime } = todaySchedule.periods[0];
    if (!openTime || !closeTime) return "closed today";

    const openingTime = parseTime(openTime);
    const closingTime = parseTime(closeTime);

    const isOvernight = closingTime < openingTime;

    if (isOvernight) {
        // Open now if after opening OR before closing
        if (currentTime >= openingTime || currentTime <= closingTime) {
            return "open now";
        } else if (currentTime < openingTime) {
            return "opens soon";
        }
    } else {
        if (currentTime >= openingTime && currentTime <= closingTime) {
            return "open now";
        } else if (currentTime < openingTime) {
            return "opens soon";
        }
    }

    return "closed today";
}

// Helper function to parse "HH:mm" format into minutes since midnight
function parseTime(timeString) {
    if (!timeString) return 0;
    const [hours, minutes] = timeString.split(":").map(t => parseInt(t, 10));
    return hours * 60 + (minutes || 0);
}

// handle location changes
export function handleLocationChange(newLocation, setLocation, setBgColor) {
    const clubColors = {
        // list with club locations and matching colors.
        antwerp: getCSSVariableValue("--turquoise-green"),
        gent: getCSSVariableValue("--pale-lemon-yellow"),
        brussels: getCSSVariableValue("--salvia-blue"),
    }
    setLocation(newLocation)
    setBgColor(clubColors[newLocation])
}

export function getCSSVariableValue(variableName){
    // function to get value from css variable
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}

export function surprise(venueData) {
    if (!venueData || !Array.isArray(venueData.docs)) return null;

    const publishedVenues = venueData.docs.filter(v => v["_status"] === "published");
    if (publishedVenues.length === 0) return null;

    const random = Math.floor(Math.random() * publishedVenues.length);
    //console.log(`/venue/${publishedVenues[random].url}?surprise=true`);
    return `/venue/${publishedVenues[random].url}?surprise=true`;
}

export function shuffleArray(array){
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export async function fetchAPI(endpoint, locale, query = {}) {
    const endpointMap = {
        lists: 'lists',
        venue: 'venues',
        venues: 'venues',
        categories: 'categories',
        cuisine: 'cuisines',
    };

    const apiEndpoint = endpointMap[endpoint] || endpoint;

    const params = new URLSearchParams();
    if (locale) params.append('locale', locale);

    // Add additional query params
    for (const key in query) {
        params.append(key, query[key]);
    }

    const response = await fetch(`/api/${apiEndpoint}?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
    }

    return response.json();
}

export function scrollTo(id) {
    const element = document.getElementById(id);
    if (element){
        element.scrollIntoView({behavior:"smooth"});
    }
}

export function pricingLabel(input) {
    // function that translates string from Payload into Euro Symbols.
    switch (input) {
        case "one":
            console.log("€")
            return "€"
        case "two": return "€€"
        case "three": return "€€€"
        case "four": return "€€€€"
    }
}


export function convertHour(input) {
    const date = new Date(input);
    const options = {
        timeZone: 'Europe/Brussels',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23' // Ensure 24-hour time format
    };

    const formatter = new Intl.DateTimeFormat('en-US', options);
    const formattedTime = formatter.format(date);
    return formattedTime;
}

export function isTerraceInSun({lat, lon, orientation}) {
    const now = new Date();
    const sunPos = SunCalc.getPosition(now, lat, lon);

    const azimuthDeg = (sunPos.azimuth * 180) / Math.PI + 180; // convert from radians to compass bearing
    const altitudeDeg = (sunPos.altitude * 180) / Math.PI;     // in degrees

    // Map compass points to degree ranges
    const orientationMap = {
        N: [337.5, 22.5],
        NE: [22.5, 67.5],
        E: [67.5, 112.5],
        SE: [112.5, 157.5],
        S: [157.5, 202.5],
        SW: [202.5, 247.5],
        W: [247.5, 292.5],
        NW: [292.5, 337.5],
    };

    const [minAz, maxAz] = orientationMap[orientation.toUpperCase()] || [0, 360];

    // Special case for North (wrap around)
    const isAzimuthOk = minAz > maxAz
        ? azimuthDeg >= minAz || azimuthDeg <= maxAz
        : azimuthDeg >= minAz && azimuthDeg <= maxAz;

    const isSunAboveHorizon = altitudeDeg > 0;

    return isAzimuthOk && isSunAboveHorizon;
}
