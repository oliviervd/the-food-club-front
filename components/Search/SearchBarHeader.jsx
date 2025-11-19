'use client'

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "/utils/utils.jsx";
import { Autocomplete, TextField, InputAdornment } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

const HeaderSearch = () => {
    const router = useRouter();
    const [searchValue, setSearchValue] = useState(null);

    // Fetch venues and cuisine data lazily (only when the field is opened)
    const [open, setOpen] = useState(false);
    const { data: searchData, isLoading } = useQuery({
        queryKey: ["header-search-options"],
        enabled: open, // do not fetch until user opens the autocomplete
        queryFn: async () => {
            const [venues, cuisines] = await Promise.all([
                fetchAPI('venue', 'en', { limit: 300, where: { _status: { equals: 'published' } } }),
                fetchAPI('cuisine', 'en', { limit: 300 })
            ]);

            return [
                ...cuisines.docs.map(cuisine => ({
                    type: 'cuisine',
                    name: cuisine.name,
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
        staleTime: 5 * 60 * 1000, // 5 minutes
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

    return (
        <div style={{
            display: 'flex', 
            alignItems: 'center', 
            maxWidth: '90%',
            height: '100%', 
            padding: '0 0px'
        }}>
            <Autocomplete
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                disablePortal
                id="header-search"
                options={searchOptions}
                getOptionLabel={(option) => option.name}
                loading={isLoading}
                value={searchValue}
                onChange={handleSearchSelect}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                renderInput={(params) => (
                    <TextField 
                        {...params} 
                        placeholder="looking for something?"
                        variant="standard"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <InputAdornment 
                                    position="end" 
                                    sx={{ 
                                        marginLeft: '10px',
                                        marginRight: '0',
                                        display: 'flex', 
                                        alignItems: 'center' ,
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    <SearchIcon
                                        sx={{ 
                                            color: 'var(--color-secondary)', 
                                            cursor: 'pointer',
                                            fontSize: '1.2rem',
                                            paddingRight: 0
                                        }} 
                                    />
                                </InputAdornment>
                            ),
                        }}
                    />
                )}
                renderOption={(props, option) => (
                    <li 
                        {...props} 
                        key={`${option.type}-${option.name}`}
                        style={{ 
                            fontFamily: 'var(--font-main)', 
                            fontSize: '1rem' 
                        }}
                    >
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
                    '& .MuiInputBase-root': {
                        paddingRight: '0 !important', // Remove right padding
                    },
                    '& .MuiInputBase-input': {
                        fontFamily: 'var(--font-main) !important',
                        fontSize: '1rem',
                        color: 'var(--color-secondary)',
                        paddingBottom: '4px',
                        paddingRight: '0 !important', // Ensure no right padding
                    },
                    '& .MuiInput-underline:before': {
                        borderBottomColor: 'var(--color-secondary)',
                    },
                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                        borderBottomColor: 'var(--color-main)',
                    },
                    '& .MuiInput-underline:after': {
                        borderBottomColor: 'var(--color-main)',
                    },
                    '& .MuiAutocomplete-listbox': {
                        fontFamily: 'var(--font-main) !important',
                        fontSize: '1rem',
                        borderRadius: '0 !important', // Remove border radius
                    },
                    '& .MuiPaper-root': {
                        borderRadius: '0 !important', // Ensure paper background also has no radius
                    },
                    '& .MuiMenu-paper': {
                        borderRadius: '0 !important',
                    },
                    '& .MuiPopover-paper': {
                        borderRadius: '0 !important',
                    },
                    '& .MuiAutocomplete-popper .MuiPaper-root': {
                        borderRadius: '0 !important',
                    }
                }}
                popupIcon={null} // Remove popup icon
                clearIcon={null} // Remove clear icon
                groupBy={(option) => option.type}
                filterOptions={(options, { inputValue }) =>
                    options.filter(option =>
                        option.name.toLowerCase().includes(inputValue.toLowerCase())
                    )
                }
            />
        </div>
    );
};

export default HeaderSearch;
