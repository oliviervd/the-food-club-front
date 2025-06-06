import { DateTime } from 'luxon';

export function venueStatus(venue) {
    let status = null;
    const days = {
        "Mo": 1,
        "Tu": 2,
        "Wed": 3,
        "Thu": 4,
        "Fr": 5,
        "Sat": 6,
        "Sun": 0
    };

    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const venueHours = venue.hours;

    for (let i = 0; i < venueHours.length; i++) {
        const _dayOpen = venueHours[i].openDay;
        const dayOpen = days[_dayOpen];

        if (dayOpen === currentDay) {
            const openingTime = parseTime(venueHours[i].openFrom);
            const closingTime = parseTime(venueHours[i].openTill);

            const isOvernight = closingTime < openingTime;

            if (isOvernight) {
                // Open now if after opening OR before closing
                if (currentTime >= openingTime || currentTime <= closingTime) {
                    status = "open now";
                } else if (currentTime < openingTime) {
                    status = "opens soon";
                } else {
                    status = "closed today";
                }
            } else {
                if (currentTime >= openingTime && currentTime <= closingTime) {
                    status = "open now";
                } else if (currentTime < openingTime) {
                    status = "opens soon";
                } else {
                    status = "closed today";
                }
            }

            break;
        }
    }

    return status || "closed today";
}

// Helper function to parse "HH:mm" format into minutes since midnight
function parseTime(timeString) {
    const [hours, minutes] = timeString.split(":").map((t) => parseInt(t, 10));
    return hours * 60 + minutes;
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

export async function fetchAPI(endpoint, locale) {
    const response = await fetch(`https://p01--cms--j4bvc8vdjtjb.code.run/api/${endpoint}/?locale=${locale}&limit=1000`, {
        credentials: 'include',
        method: 'GET'
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
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

