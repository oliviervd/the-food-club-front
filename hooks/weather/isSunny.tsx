import React, {useState, useMemo} from 'react';
import SunCalc from 'suncalc';

// check if terrace is actually sunny add the moment
export const terraceIsSunny = (venue, currentTime= new Date()) => {

    // first check if the venue has the required info.
    if (!venue.information.hasTerrace || !venue.information.orientation) return false;

    // 1. retrieve the suns positions.
    const sunPosition = SunCalc.getPosition(currentTime, venue.information.address.latitude, venue.information.address.longitude);

    // 2. convert radians to degrees
    const sunAzimuth = (sunPosition.azimuth * 180 / Math.PI + 180) % 360;

    // Mapping sun orientation to compass directions
    const orientationMap = {
        'N': [337.5, 22.5],
        'NE': [22.5, 67.5],
        'E': [67.5, 112.5],
        'SE': [112.5, 157.5],
        'S': [157.5, 202.5],
        'SW': [202.5, 247.5],
        'W': [247.5, 292.5],
        'NW': [292.5, 337.5]
    };

    // Check if the sun is in the terrace's orientation range
    const terraceSunnyOrientation = venue.information.orientation;
    const [start, end] = orientationMap[terraceSunnyOrientation];

    return sunAzimuth >= start && sunAzimuth < end;
}