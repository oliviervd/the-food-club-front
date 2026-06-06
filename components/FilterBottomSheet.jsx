'use client';

import BottomSheet from './BottomSheet.jsx';
import { Autocomplete, Chip, TextField } from '@mui/material';

const FilterBottomSheet = ({
                               isOpen,
                               onClose,
                               isMounted,
                               // filter states
                               showOpenOnly, setShowOpenOnly,
                               hasTerrace, setHasTerrace,
                               hasTakeAway, setHasTakeAway,
                               showSavedOnly, setShowSavedOnly,
                               selectedDays, toggleDay,
                               selectedService, toggleService,
                               selectedBudget, toggleBudget,
                               selectedDish, setSelectedDish,
                               selectedCuisine, setSelectedCuisine,
                               cuisines,
                               user,
                               activeFiltersCount,
                               filteredCount,
                               onReset,
                               clearRoute,
                           }) => {
    const dayMap = {
        'mo': 'monday', 'tu': 'tuesday', 'we': 'wednesday',
        'th': 'thursday', 'fr': 'friday', 'sa': 'saturday', 'su': 'sunday'
    };

    const pill = (label, active, onToggle) => (
        <div
            key={label}
            onClick={() => { clearRoute?.(); onToggle(); }}
            style={{
                padding: '6px 12px',
                border: '2px solid var(--color-secondary)',
                background: active ? 'var(--color-secondary)' : 'var(--color-main)',
                color: active ? 'var(--color-main)' : 'var(--color-secondary)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontFamily: 'inherit',
                borderStyle: active ? 'solid' : 'dotted',
                whiteSpace: 'nowrap',
            }}
        >
            {label}
        </div>
    );

    const sectionLabel = (text) => (
        <p style={{ margin: '12px 0 6px', fontWeight: 'bold', fontSize: '0.75rem', color: 'var(--color-secondary)' }}>
            {text}
        </p>
    );

    return (
        <BottomSheet isOpen={isOpen} onClose={onClose} initialSnap="half">
            <div style={{ padding: '0 16px 24px' }}>

                {sectionLabel('LOOKING FOR')}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {pill('open now', showOpenOnly, () => setShowOpenOnly(!showOpenOnly))}
                    {pill('terrace', hasTerrace, () => setHasTerrace(!hasTerrace))}
                    {pill('take-away', hasTakeAway, () => setHasTakeAway(!hasTakeAway))}
                    {user && pill('my list', showSavedOnly, () => setShowSavedOnly(!showSavedOnly))}
                </div>

                {sectionLabel('SERVES')}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {['breakfast', 'brunch', 'lunch', 'dinner', 'snack', 'drinks', 'coffee'].map(s =>
                        pill(s, selectedService.includes(s), () => toggleService(s))
                    )}
                </div>

                {sectionLabel('OPEN ON')}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {Object.entries(dayMap).map(([short, full]) =>
                        pill(short, selectedDays.includes(full), () => toggleDay(full))
                    )}
                </div>

                {sectionLabel('BUDGET')}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {['💸', '💸💸', '💸💸💸', '💸💸💸💸', '💸💸💸💸💸'].map(b =>
                        pill(b, selectedBudget.includes(b), () => toggleBudget(b))
                    )}
                </div>

                {isMounted && cuisines.length > 0 && (
                    <>
                        {sectionLabel('DISH')}
                        <Autocomplete
                            freeSolo disablePortal multiple
                            options={cuisines.filter(c => c.type === 'dish')}
                            getOptionLabel={(o) => o.name}
                            value={selectedDish}
                            onChange={(_, v) => setSelectedDish(v)}
                            sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-secondary)', borderStyle: 'dotted' } }}
                            renderInput={(params) => <TextField {...params} placeholder="Pick a dish…" size="small" />}
                            renderTags={(value, getTagProps) => value.map((option, index) => (
                                <Chip key={index} label={option.name} {...getTagProps({ index })} size="small"
                                      sx={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-main)' }} />
                            ))}
                        />

                        {sectionLabel('CUISINE')}
                        <Autocomplete
                            freeSolo disablePortal multiple
                            options={cuisines.filter(c => c.type === 'cuisine')}
                            getOptionLabel={(o) => o.name}
                            value={selectedCuisine}
                            onChange={(_, v) => setSelectedCuisine(v)}
                            sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-secondary)' } }}
                            renderInput={(params) => <TextField {...params} placeholder="Pick a cuisine…" size="small" />}
                            renderTags={(value, getTagProps) => value.map((option, index) => (
                                <Chip key={index} label={option.name} {...getTagProps({ index })} size="small"
                                      sx={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-main)' }} />
                            ))}
                        />
                    </>
                )}

                <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button
                        onClick={onClose}
                        style={{
                            width: '100%', padding: 14,
                            background: 'var(--color-secondary)', color: 'var(--color-main)',
                            border: 'none', fontFamily: 'inherit', fontSize: '0.9rem',
                            cursor: 'pointer',
                        }}
                    >
                        show {filteredCount} venue{filteredCount !== 1 ? 's' : ''}
                    </button>

                    {activeFiltersCount > 0 && (
                        <button
                            onClick={onReset}
                            style={{
                                width: '100%', padding: 10,
                                background: 'transparent', color: 'var(--color-secondary)',
                                border: '1px solid var(--color-secondary)', fontFamily: 'inherit',
                                fontSize: '0.85rem', cursor: 'pointer',
                                borderStyle: 'dotted',
                            }}
                        >
                            reset filters
                        </button>
                    )}
                </div>
            </div>
        </BottomSheet>
    );
};

export default FilterBottomSheet;