import {useQuery} from "@tanstack/react-query";

export function fetchAPI(endpoint) {
    // fetch all data from a certain collection.
    const {data, isLoading, status} = useQuery({
        queryKey:[endpoint],
        queryFn: () =>
            fetch(`https://p01--cms--j4bvc8vdjtjb.code.run/api/${endpoint}/?limit=0`,{
                credentials: 'include',
                method: 'GET'
            }).then((req)=>req.json())
    })
    return data
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

export function colorWordInString(string, substring) {
    // based on a given substring, replace the style using a span.
    const words = string.split("");
    const styledWords = words.map((w) => {
        //if the word matches
        if (w === substring) {
            return `<span className="highlight">${w}</span>`;
        }
        //else
        return w;
    });

    const hightlightedTitle = styledWords.join("");
    return hightlightedTitle;
}