'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '../../../contexts/UserContext.jsx';
import Header from '../../../components/Header.jsx';
import Banner from '../../../components/Banner.jsx';
import ScrollToTop from '../../../components/scrollToTop.jsx';
import AuthModal from '../../../components/AuthModal.jsx';
import SaveVenueButton from '../../../components/saveButton.jsx';
import Loading from '../loading.jsx';

const MapSmall = dynamic(() => import('../../../components/mapSmall.jsx'), { ssr: false });

const getHeroUrl = (media, preferred = 'tablet') => {
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

export default function ProfileClient() {
    const { user, loading, logout } = useUser();
    const [showModal, setShowModal] = useState(false);
    const [highlightedVenue, setHighlightedVenue] = useState(null);
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' ? window.innerWidth < 600 : false
    );

    useEffect(() => {
        const checkWidth = () => setIsMobile(window.innerWidth < 600);
        checkWidth();
        window.addEventListener("resize", checkWidth);
        return () => window.removeEventListener("resize", checkWidth);
    }, []);

    if (loading) return (
        <>
            <Header landing={true} interact={true} />
            <Loading />
        </>
    );

    // Not logged in
    if (!user) return (
        <>
            <Header landing={true} interact={true} />
            <section className="home__container profile__not-logged-in">
                <h2>your saved spots live here.</h2>
                <p>log in or create an account to save your favourite restaurants.</p>
                <button className="profile__login-btn" onClick={() => setShowModal(true)}>
                    log in / join the club
                </button>
            </section>
            {showModal && (
                <AuthModal
                    onClose={() => setShowModal(false)}
                    onSuccess={() => setShowModal(false)}
                />
            )}
        </>
    );

    const savedVenues = user.savedVenues || [];

    // Extract venue objects for the map
    const venuesForMap = savedVenues
        .map(s => typeof s.venue === 'object' ? s.venue : null)
        .filter(Boolean);

    return (
        <>
            <Header landing={true} interact={true} />
            <ScrollToTop />
            {isMobile && (
                <Banner content={`hey ${user.firstName || user.email.split('@')[0]}`} />
            )}

            <section className="home__container">
                <div>
                    {/* Mobile view */}
                    {isMobile && (
                        <section>
                            <div className="profile__mobile-header">
                                <nav className="flex-buttons">
                                    <h2
                                        className={`link ${tab === 'favourite' ? 'selected' : ''}`}
                                        onClick={() => setTab('favourite')}
                                    >
                                        ⭐ fav ({savedVenues.filter(s => s.status === 'favourite').length})
                                    </h2>
                                    <h2
                                        className={`link ${tab === 'wantToGo' ? 'selected' : ''}`}
                                        onClick={() => setTab('wantToGo')}
                                    >
                                        📍 want ({savedVenues.filter(s => s.status === 'wantToGo').length})
                                    </h2>
                                    <h2 className="link" onClick={logout}>log out</h2>
                                </nav>
                            </div>

                            {savedVenues.length === 0 ? (
                                <div className="profile__empty">
                                    <p>
                                        {tab === 'favourite'
                                            ? "no favourites yet."
                                            : "nothing on your list yet."}
                                    </p>
                                    <Link href="/">browse venues →</Link>
                                </div>
                            ) : (
                                savedVenues.map((entry, index) => {
                                    const venue = typeof entry.venue === 'object' ? entry.venue : null;
                                    if (!venue) return null;
                                    const heroUrl = getHeroUrl(venue.media, 'mobileFriendly');
                                    if (!heroUrl) return null;

                                    return (
                                        <Link
                                            href={`/venue/${venue.url}`}
                                            key={venue.id || index}
                                            className="category-list__box"
                                            style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
                                        >
                                            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                                <img
                                                    src={heroUrl}
                                                    alt={`hero image for ${venue.venueName}`}
                                                    loading={index < 4 ? 'eager' : 'lazy'}
                                                    fetchpriority={index < 4 ? 'high' : 'auto'}
                                                    style={{
                                                        objectFit: 'cover',
                                                        width: '100%',
                                                        height: '100%',
                                                        border: "2px solid var(--color-main)",
                                                        boxSizing: 'border-box',
                                                        display: 'block',
                                                    }}
                                                />
                                                <SaveVenueButton venueId={venue.id} venueName={venue.venueName} />
                                            </div>
                                            <h2 style={{ textAlign: "center" }}>{venue.venueName}</h2>
                                        </Link>
                                    );
                                })
                            )}
                        </section>
                    )}

                    {/* Desktop view */}
                    {!isMobile && (
                        <section className="desktop">
                            <section className="venue-list__container-main">
                                <h2 className="header">
                                    {user.firstName || user.email.split('@')[0]}
                                </h2>
                                <section>
                                    <div className="cat_description" style={{ height: "200px", display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <h2 className="link" style={{ borderTop: '1px solid var(--color-secondary)' }} onClick={logout}>
                                            log out
                                        </h2>
                                    </div>

                                    {savedVenues.length === 0 ? (
                                        <div className="profile__empty">
                                            <p>
                                                {tab === 'favourite'
                                                    ? "no favourites yet — start saving your best meals."
                                                    : "nothing on your list yet — add some places you want to try."}
                                            </p>
                                            <Link href="/" className="link">browse venues →</Link>
                                        </div>
                                    ) : (
                                        savedVenues.map((entry, index) => {
                                            const venue = typeof entry.venue === 'object' ? entry.venue : null;
                                            if (!venue) return null;
                                            const heroUrl = getHeroUrl(venue.media, 'tablet');
                                            if (!heroUrl) return null;

                                            const isHighlighted = highlightedVenue?.url === venue.url;
                                            const borderStyle = {
                                                border: isHighlighted ? '2px solid var(--color-secondary)' : '',
                                                backgroundColor: isHighlighted ? 'var(--color-main)' : '',
                                                color: isHighlighted ? 'var(--color-secondary)' : '',
                                                transition: 'all 0.5s ease',
                                            };

                                            return (
                                                <div key={venue.id || index} className="venue">
                                                    <Link
                                                        href={`/venue/${venue.url}`}
                                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                                    >
                                                        <div
                                                            className="venue__image"
                                                            onMouseEnter={() => setHighlightedVenue(venue)}
                                                            onMouseLeave={() => setHighlightedVenue(null)}
                                                            style={{ height: "200px", position: 'relative', overflow: 'hidden' }}
                                                        >
                                                            <img
                                                                src={heroUrl}
                                                                alt={`hero image for ${venue.venueName}`}
                                                                loading={index < 4 ? 'eager' : 'lazy'}
                                                                fetchpriority={index < 4 ? 'high' : 'auto'}
                                                                style={{
                                                                    objectFit: 'cover',
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    border: "2px solid var(--color-main)",
                                                                    boxSizing: 'border-box',
                                                                    display: 'block',
                                                                }}
                                                            />
                                                            <SaveVenueButton venueId={venue.id} venueName={venue.venueName} />
                                                            <h2 style={borderStyle}>{venue.venueName}</h2>
                                                        </div>
                                                    </Link>
                                                </div>
                                            );
                                        })
                                    )}
                                </section>
                            </section>

                            <section className="venue-list__container-others" style={{ marginTop: "20px" }}>
                                <MapSmall
                                    venues={venuesForMap}
                                    highlight={highlightedVenue}
                                    onHover={setHighlightedVenue}
                                />
                            </section>
                        </section>
                    )}
                </div>
            </section>
        </>
    );
}