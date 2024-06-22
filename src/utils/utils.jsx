import {useQuery} from "@tanstack/react-query";
import {useEffect, useState, useRef} from "react";

// handle location changes


export function handleLocationChange(newLocation, setLocation, setBgColor) {
    const clubColors = {
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

/*export function fetchAPI(endpoint, locale) {
    // fetch all data from a certain collection based on a given locale and limit.
    const {data, isLoading, status} = useQuery({
        queryKey:[endpoint],
        queryFn: () =>
            fetch(`https://p01--cms--j4bvc8vdjtjb.code.run/api/${endpoint}/?locale=${locale}&limit=1000`,{
                credentials: 'include',
                method: 'GET'
            }).then((req)=>req.json())
    })
    return data
}*/

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

export function useIntersectionObserver({delay}) {
    // function that checks if an element is in the viewport
    const [isIntersecting, setIsIntersecting] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting)
            }
        )

        // delay added to the intersection observer
        const timerId = setTimeout(()=>{
            if (ref.current){
                observer.observe(ref.current)
            }
        }, delay)

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current)
            }
            clearTimeout(timerId)
        }
    }, []);

    return [ref, isIntersecting]
}

export function InComponent({children}) {
    const [ref, isIntersecting] = useIntersectionObserver(0)

    return (
        <div ref={ref} className={`-in-section ${isIntersecting ? 'is-visible' : ''}`}>
            {children}
        </div>
    )
}

export function isObject(input) {
    if (typeof input === "object" && input[1]) {
        return true;
    } else {
        return false;
    }
}