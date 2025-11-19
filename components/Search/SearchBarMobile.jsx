'use client'

import "styles/searchBar.css"

import {Autocomplete, TextField, Chip} from "@mui/material";
import {useRouter} from "next/navigation";
import {useState, useMemo, useCallback} from "react";
import {fetchAPI} from "../../utils/utils.jsx";
import {useQuery} from "@tanstack/react-query";

const SearchBarMobile = () => {

    const router = useRouter();
    const [searchValue, setSearchValue] = useState(null);
    const [shouldFetch, setShouldFetch] = useState(false); // defer heavy fetch until interaction

    // fetch venues and cuisine data only after user interacts
    const { data: searchData, isLoading } = useQuery({
        queryKey: ["search-options"],
        queryFn: async () => {
            const [venues, cuisines] = await Promise.all([
                fetchAPI('venue', 'en', { limit: 300, where: { _status: { equals: 'published' } } }),
                fetchAPI('cuisine', 'en', { limit: 300 })
            ]);

            // Combine and transform venues and cuisines
            return [
                ...cuisines.docs
                    .map(cuisine => ({
                        type: 'category',
                        name: cuisine.name.charAt(0).toUpperCase() + String(cuisine.name).slice(1),
                        url: `/venues/${cuisine.name}`,
                        })),
                ...venues.docs
                    .filter(venue => venue._status === 'published')
                    .map(venue => ({
                        type: 'venue',
                        name: venue.venueName,
                        url: `/venue/${venue.url}`,
                     }))
            ];
        },
        // Cache the results to improve performance
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: shouldFetch, // only fetch when input is focused
        refetchOnWindowFocus: false,
    });

    // Memoize search options to prevent unnecessary re-renders
    const searchOptions = useMemo(() => {
        return searchData || [];
    }, [searchData]);

    const handleSearchSelect = (event, value) => {
        if (value) {
            router.push(value.url);
        }
    };

    const handleFocus = useCallback(() => {
        setShouldFetch(true);
    }, []);

    return (
        <div className="search-bar__container">
            <Autocomplete
                disablePortal
                id="search-bar"
                options={searchOptions}
                getOptionLabel={(option) => option.name}
                loading={isLoading}
                value={searchValue}
                onChange={handleSearchSelect}
                onFocus={handleFocus}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="searching for something specific?"
                        variant="outlined"
                        onFocus={handleFocus}
                    />
                )}
                renderOption={(props, option) => (
                    <li {...props} key={`${option.type}-${option.name}`}>
                        {option.name}
                        <span style={{
                            marginLeft: '10px',
                            fontSize: '0.8em',
                            color: option.type === 'venue' ? 'green' : 'blue'
                        }}>
                            {option.type}
                        </span>
                    </li>
                )}
                sx={{
                    width: '100%',
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '0', // Remove border radius
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'var(--color-main)', // Set border color
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'var(--color-main)', // Hover state
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'var(--color-main)', // Focused state
                        }
                    },
                    // Font customization
                    '& .MuiInputBase-input': {
                        fontFamily: 'DM-sans !important',
                        fontSize: '1rem',
                    },
                    '& .MuiInputLabel-root': {
                        fontFamily: 'DM-sans !important',
                        fontSize: '0.9rem',
                    },
                    '& .MuiAutocomplete-listbox': {
                        fontFamily: 'DM-sans-italic !important',
                        fontSize: '1rem',
                    }
                }}
                groupBy={(option) => option.type}
                filterOptions={(options, { inputValue }) =>
                    options.filter(option =>
                        option.name.toLowerCase().includes(inputValue.toLowerCase())
                    )
                }
            />
        </div>
    )

}

export default SearchBarMobile