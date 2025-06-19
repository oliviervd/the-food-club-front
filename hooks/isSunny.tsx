
// hook that fetches weather data from ..
import {useState, useEffect} from 'react'

interface WeatherData {
    temperature: number;
    description: string;
    humidity: number;
    windSpeed: number;
    clouds: number;
}

interface WeatherError {
    message: string;
}

const useWeather = (city: string) => {
    const [weather, setWeather] = useState<WeatherData | WeatherError | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<WeatherError | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                setLoading(true);
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=a86bd7fc2cf16d4f1b58c44c112f599d&units=metric`);

                if (!response.ok) {
                    throw new Error('Weather data fetch failed');
                }

                const data = await response.json();

                setWeather({
                    temperature: data.main.temp,
                    description: data.weather[0].description,
                    humidity: data.main.humidity,
                    windSpeed: data.wind.speed,
                    clouds: data.clouds.all
                });
                setError(null);
            } catch (error) {
                setError({ message: error instanceof Error ? error.message : 'Failed to fetch weather data' });
            } finally {
                setLoading(false);
            }
        }

        fetchWeather();
    }, [city]);

    const isSunny = weather && !('message' in weather) && weather.clouds < 25 && weather.description.toLowerCase().includes('clear');
    console.log(weather)
    return { weather, loading, error, isSunny };
}

export default useWeather;