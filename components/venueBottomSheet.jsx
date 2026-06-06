'use client';

import Link from 'next/link';
import BottomSheet from './BottomSheet.jsx';
import SaveVenueButton from './saveButton.jsx';

const getCurrentDay = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
};

const getHeroUrl = (media, preferred = 'mobileFriendly') => {
    const sizes = media?.hero?.sizes || {};
    const isValidUrl = (url) => {
        if (!url || typeof url !== 'string') return false;
        try {
            const parsed = new URL(url);
            return parsed.pathname.length > 1;
        } catch { return false; }
    };
    const candidates = [
        sizes[preferred]?.url,
        sizes.tablet?.url,
        sizes.mobileFriendly?.url,
        sizes.mobileThumbnail?.url,
        media?.hero?.url,
    ];
    return candidates.find(isValidUrl) || null;
};

const VenueBottomSheet = ({ venue, isOpen, isSunny, routeInfo, savedLabel, onClose, onDirections }) => {
    if (!venue) return null;

    const heroUrl = getHeroUrl(venue.media, 'mobileFriendly');
    const today = getCurrentDay();
    const address = venue.information?.address;
    const items = [
        ...(venue.information?.cuisine || []),
        ...(venue.information?.dishes || []),
        ...(venue.information?.drinks || []),
    ];

    return (
        <BottomSheet isOpen={isOpen} onClose={onClose} initialSnap="half">
            {/* Hero image */}
            {heroUrl && (
                <div style={{ position: 'relative', width: '100%', height: 160, flexShrink: 0, overflow: 'hidden' }}>
                    <img
                        src={heroUrl}
                        alt={`hero image for ${venue.venueName}`}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    {isSunny && (
                        <div style={{
                            position: 'absolute', top: 8, left: 8,
                            background: '#FFB700', color: '#000',
                            padding: '2px 8px', fontSize: '0.75rem',
                            fontFamily: 'inherit',
                        }}>
                            sunny terrace
                        </div>
                    )}
                    {savedLabel && (
                        <div style={{
                            position: 'absolute', bottom: 8, left: 8,
                            background: 'var(--color-main)',
                            border: '1px solid var(--color-secondary)',
                            padding: '2px 8px', fontSize: '0.75rem',
                            fontFamily: 'inherit', color: 'var(--color-secondary)',
                        }}>
                            {savedLabel}
                        </div>
                    )}
                </div>
            )}

            {/* Content */}
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>

                {/* Name + save */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--color-secondary)', lineHeight: 1.1 }}>
                        {venue.venueName}
                    </h2>
                    <SaveVenueButton venueId={venue.id} venueName={venue.venueName} />
                </div>

                {/* Address */}
                {address && (
                    <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.6, color: 'var(--color-secondary)' }}>
                        {address.street} {address.houseNumber}, {address.postalCode} {address.city}
                    </p>
                )}

                {/* Tags */}
                {items.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {items.map((item) => (
                            <Link
                                key={item.id || item.name}
                                href={`/venues/${item.name}`}
                                style={{
                                    border: '2px solid var(--color-secondary)',
                                    padding: '2px 8px',
                                    fontSize: '0.75rem',
                                    color: 'var(--color-secondary)',
                                    textDecoration: 'none',
                                    background: 'var(--color-main)',
                                }}
                            >
                                {item.name}
                            </Link>
                        ))}
                        {venue.damage && (
                            <span style={{
                                border: '2px solid var(--color-secondary)',
                                padding: '2px 8px',
                                fontSize: '0.75rem',
                                color: 'var(--color-secondary)',
                            }}>
                                {venue.damage.replaceAll('*', '€')}
                            </span>
                        )}
                    </div>
                )}

                <hr style={{ border: 'none', borderTop: '1px solid var(--color-secondary)', opacity: 0.2, margin: 0 }} />

                {/* Action buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button
                        onClick={onDirections}
                        style={{
                            width: '100%', padding: '12px',
                            background: 'var(--color-secondary)', color: 'var(--color-main)',
                            border: 'none', fontFamily: 'inherit', fontSize: '0.9rem',
                            cursor: 'pointer',
                        }}
                    >
                        {routeInfo
                            ? `${routeInfo.distanceKm} km · ~${routeInfo.durationMin} min →`
                            : 'get directions →'
                        }
                    </button>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {venue.information?.reservations && (
                            <a
                                href={venue.information.reservations}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'block', padding: '10px',
                                    border: '2px solid var(--color-secondary)',
                                    color: 'var(--color-secondary)', textDecoration: 'none',
                                    textAlign: 'center', fontSize: '0.85rem',
                                    background: 'var(--color-main)',
                                }}
                            >
                                book a table
                            </a>
                        )}
                        <Link
                            href={`/venue/${venue.url}`}
                            style={{
                                display: 'block', padding: '10px',
                                border: '2px solid var(--color-secondary)',
                                color: 'var(--color-secondary)', textDecoration: 'none',
                                textAlign: 'center', fontSize: '0.85rem',
                                background: 'var(--color-main)',
                                gridColumn: venue.information?.reservations ? 'auto' : '1 / -1',
                            }}
                        >
                            read review →
                        </Link>
                    </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--color-secondary)', opacity: 0.2, margin: 0 }} />

                {/* Opening hours */}
                {venue.information?.hours && venue.information.hours.length > 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {venue.information.hours.map((day) => (
                            <div
                                key={day.id || day.dayOfWeek}
                                style={{
                                    display: 'flex', justifyContent: 'space-between',
                                    fontSize: '0.8rem', color: 'var(--color-secondary)',
                                    fontWeight: day.dayOfWeek === today ? '600' : '400',
                                    paddingBottom: 4,
                                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                                }}
                            >
                                <span>{day.dayOfWeek}</span>
                                <span>
                                    {day.isClosed ? 'closed' : day.periods?.map(p =>
                                        `${p.openTime || ''}–${p.closeTime || p.closeTimeSpecial || ''}`
                                    ).join(', ')}
                                </span>
                            </div>
                        ))}
                        {venue.information.remarks && (
                            <p style={{ margin: '4px 0 0', fontSize: '0.75rem', opacity: 0.6, color: 'var(--color-secondary)' }}>
                                {venue.information.remarks}
                            </p>
                        )}
                    </div>
                )}

                {/* Bottom padding for safe area */}
                <div style={{ height: 24 }} />
            </div>
        </BottomSheet>
    );
};

export default VenueBottomSheet;