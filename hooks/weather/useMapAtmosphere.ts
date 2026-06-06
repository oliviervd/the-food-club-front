import { useState, useEffect } from 'react';
import SunCalc from 'suncalc';

type AtmosphereState = {
    tileUrl: string;
    overlayColor: string | null;
    timeOfDay: 'night' | 'golden' | 'day';
};

const CITY_COORDS: Record<string, [number, number]> = {
    gent: [51.0544, 3.7256],
    brussels: [50.8484, 4.3572],
    antwerp: [51.2231, 4.4107],
};

const TILE_URLS = {
    day: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    golden: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    night: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
};

const getAtmosphere = (location: string): AtmosphereState => {
    const coords = CITY_COORDS[location] ?? CITY_COORDS.gent;
    const now = new Date();

    const times = SunCalc.getTimes(now, coords[0], coords[1]);
    const sunPosition = SunCalc.getPosition(now, coords[0], coords[1]);

    const nowMs = now.getTime();
    const goldenHourMs = 60 * 60 * 1000; // 1 hour window

    const isNight = sunPosition.altitude < 0;

    const isGoldenMorning =
        nowMs >= times.sunrise.getTime() - goldenHourMs &&
        nowMs <= times.sunrise.getTime() + goldenHourMs;

    const isGoldenEvening =
        nowMs >= times.sunset.getTime() - goldenHourMs &&
        nowMs <= times.sunset.getTime() + goldenHourMs;

    const isGolden = !isNight && (isGoldenMorning || isGoldenEvening);

    if (isNight) {
        return {
            tileUrl: TILE_URLS.night,
            overlayColor: 'rgba(10, 10, 40, 0.15)',
            timeOfDay: 'night',
        };
    }

    if (isGolden) {
        return {
            tileUrl: TILE_URLS.golden,
            overlayColor: 'rgba(255, 160, 30, 0.12)',
            timeOfDay: 'golden',
        };
    }

    return {
        tileUrl: TILE_URLS.day,
        overlayColor: null,
        timeOfDay: 'day',
    };
};


export const useMapAtmosphere = (location: string): AtmosphereState => {
    const [atmosphere, setAtmosphere] = useState<AtmosphereState>(() =>
        getAtmosphere(location)
    );

    // Recalculate when location changes
    useEffect(() => {
        setAtmosphere(getAtmosphere(location));
    }, [location]);

    // Recalculate every 5 minutes
    useEffect(() => {
        const interval = setInterval(() => {
            setAtmosphere(getAtmosphere(location));
        }, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [location]);

   return atmosphere;
};