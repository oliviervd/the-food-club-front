import { useState, useEffect } from "react";
import Banner from "./Banner.jsx";
const CityDropdown = ({ cities = [], defaultCity = "", onChange }) => {
    const [selectedCity, setSelectedCity] = useState(defaultCity || cities[0]);
    const [open, setOpen] = useState(false);

    const handleCityChange = (city) => {
        setSelectedCity(city);
        onChange && onChange(city);
        setOpen(false);
    };

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, []);

    return (
        <>
            <div className={"city-popup"} onClick={() => setOpen(true)}>
                <Banner content={`I'm sick of ${selectedCity}, let's swap city!`}/>
            </div>

            {open && (
                <div className="city-popup">
                    <div className="city-popup-inner">
                        {cities.map((city, index) => (
                            <div
                                key={index}
                                onClick={() => handleCityChange(city)}
                            >
                                <h2>{`${city}`}</h2>
                            </div>
                        ))}


                    </div>

                </div>

            )}
        </>
    );
};

export default CityDropdown;