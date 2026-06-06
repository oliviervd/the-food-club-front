'use client';

import { useState } from 'react';
import { useUser } from '../contexts/UserContext.jsx';
import AuthModal from './AuthModal.jsx';

const ICONS = {
    favourite: '⭐',
    wantToGo: '📍',
    none: '🤍',
};

const SaveVenueButton = ({ venueId, venueName }) => {
    const { user, saveVenue, getSavedStatus } = useUser();
    const [showModal, setShowModal] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [pending, setPending] = useState(null); // status to save after login

    const currentStatus = getSavedStatus(venueId);

    const handleSave = async (status) => {
        setShowMenu(false);
        if (!user) {
            setPending(status);
            setShowModal(true);
            return;
        }
        await saveVenue(venueId, status);
    };

    const handleAfterLogin = async () => {
        setShowModal(false);
        if (pending) {
            await saveVenue(venueId, pending);
            setPending(null);
        }
    };

    const handleButtonClick = (e) => {
        e.preventDefault(); // prevent Link navigation
        e.stopPropagation();
        if (currentStatus) {
            // already saved — show menu to change or remove
            setShowMenu(prev => !prev);
        } else {
            setShowMenu(prev => !prev);
        }
    };

    return (
        <>
            <div className="save-venue__wrapper" onClick={e => e.preventDefault()}>
                <button
                    className={`save-venue__btn ${currentStatus ? 'save-venue__btn--saved' : ''}`}
                    onClick={handleButtonClick}
                    aria-label={`Save ${venueName}`}
                    title={currentStatus ? `Saved as ${currentStatus}` : 'Save this venue'}
                >
                    {currentStatus ? ICONS[currentStatus] : ICONS.none}
                </button>

                {showMenu && (
                    <div className="save-venue__menu">
                        <button
                            className={`save-venue__menu-item ${currentStatus === 'favourite' ? 'active' : ''}`}
                            onClick={() => handleSave('favourite')}
                        >
                            ⭐ favourite
                        </button>
                        <button
                            className={`save-venue__menu-item ${currentStatus === 'wantToGo' ? 'active' : ''}`}
                            onClick={() => handleSave('wantToGo')}
                        >
                            📍 want to go
                        </button>
                        {currentStatus && (
                            <button
                                className="save-venue__menu-item save-venue__menu-item--remove"
                                onClick={() => handleSave(currentStatus)}
                            >
                                ✕ remove
                            </button>
                        )}
                    </div>
                )}
            </div>

            {showModal && (
                <AuthModal
                    onClose={() => { setShowModal(false); setPending(null); }}
                    onSuccess={handleAfterLogin}
                />
            )}
        </>
    );
};

export default SaveVenueButton;