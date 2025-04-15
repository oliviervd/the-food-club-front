import { DateTime } from 'luxon';

export function venueStatus(venue) {
    let status = null;
    let days = {
        "Mo": 1,
        "Tu": 2,
        "Wed": 3,
        "Thu": 4,
        "Fr": 5,
        "Sat": 6,
        "Sun": 0 // "Sun" corresponds to 0 (Sunday)
    };

    // Get the current day and time
    const now = new Date();
    const currentDay = now.getDay(); // 0 for Sunday, 1 for Monday, etc.
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes since midnight

    // Read the opening hours of the venue
    let venueHours = venue.hours;

    for (let i = 0; i < venueHours.length; i++) {
        const _dayOpen = venueHours[i].openDay;
        const dayOpen = days[_dayOpen];

        // Check if today matches the venue's opening day
        if (dayOpen === currentDay) {

            // Get the opening and closing times (assumed in minutes since midnight)
            const openingTime = parseTime(venueHours[i].openFrom); // Helper function
            const closingTime = parseTime(venueHours[i].openTill); // Helper function

            // Compare the current time to see if the venue is open
            if (currentTime >= openingTime && currentTime <= closingTime) {
                status = "open now";
            } else if (currentTime < openingTime) {
                status = "opens soon";
            } else {
                status = "closed today";
            }
            break; // Exit loop since today's status is determined
        }
    }

    // Return status or "closed today" by default
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

export async function surprise(club) {
    console.log(`returning a random location in ${club}`)
    const venues = await fetchAPI("venue", "en");
    if (venues) {

        let res = [];

        if (club !== "all") {
            // fetch all venues in this location
            res = venues.docs.filter(venue => venue.club == club)
        }

        res = venues.docs;
        // pick random one
        const random = Math.floor(Math.random()*res.length)
        let supriseUrl = `/venue/${res[random].url}?surprise=true`
        console.log(supriseUrl)
        return supriseUrl
    }

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

