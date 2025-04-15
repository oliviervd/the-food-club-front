import React from 'react';

const locationColors = {
    "gent": {
        "main": "#c9ff00",
        "secondary": "#000eff",
        "glass": "#000eff55",
        "location": "gent"
    },
    "antwerp": {
        "main": "#b5ffc2",
        "secondary": "#ff00ff",
        "glass": "#ff00ff55",
        'location': "antwerp"
    },
    "brussels": {
        "main": "#fff59e",
        "secondary": "#ff5733",
        "glass": "#ff573355",
        'location': "brussels"
    }
};

const defaultLocationColors = {
    main: "#c9ff00",
    secondary: "#000eff",
    glass: "#000eff55",
    location: "gent"
}

export const LocationColorContext = React.createContext();

export const LocationColorProvider = ({ children }) => {
    const [locationColor, setLocationColor] = React.useState(defaultLocationColors);

    const handleLocationChange = (location) => {
        // store in new css variables that can be used in the rest of the styling
        if (location in locationColors) {
            const newLocationColor = locationColors[location];
            setLocationColor(newLocationColor);
            document.documentElement.style.setProperty('--color-main', newLocationColor.main);
            document.documentElement.style.setProperty('--color-secondary', newLocationColor.secondary);
            document.documentElement.style.setProperty('--color-glass', newLocationColor.glass);
        }
    };

    return (
        <LocationColorContext.Provider value={{locationColor, handleLocationChange }}>
            {children}
        </LocationColorContext.Provider>
    );


}