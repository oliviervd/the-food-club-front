'use client';

import { useState } from 'react';
import { useUser } from '../contexts/UserContext.jsx';
import AuthModal from './AuthModal.jsx';
import TurnedInOutlinedIcon from '@mui/icons-material/TurnedInOutlined';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import PlaceIcon from '@mui/icons-material/Place';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const SaveVenueButton = ({ venueId, venueName }) => {
    const { user, saveVenue, getSavedStatus } = useUser();
    const [showModal, setShowModal] = useState(false);
    const [pending, setPending] = useState(null);

    const currentStatus = getSavedStatus(venueId);

    const handleSave = async (status) => {
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

    const isFavourite = currentStatus === 'favourite';
    const isWantToGo = currentStatus === 'wantToGo';

    const iconSx = { fontSize: '2em' };

    return (
        <>
            <div
                className="save-venue__wrapper"
                onClick={e => { e.preventDefault(); e.stopPropagation(); }}
            >
                {/* Favourite button */}
                <button
                    className={`save-venue__btn ${isFavourite ? 'save-venue__btn--active' : ''}`}
                    onClick={() => handleSave('favourite')}
                    aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
                    title={isFavourite ? 'Remove from favourites' : 'Favourite'}
                >
                    {isFavourite
                        ? <TurnedInIcon sx={iconSx}/>
                        : <TurnedInOutlinedIcon sx={iconSx}/>
                    }
                </button>

                {/* Want to go button */}
                <button
                    className={`save-venue__btn ${isWantToGo ? 'save-venue__btn--active' : ''}`}
                    onClick={() => handleSave('wantToGo')}
                    aria-label={isWantToGo ? 'Remove from want to go' : 'Add to want to go'}
                    title={isWantToGo ? 'Remove from want to go' : 'Want to go'}
                >
                    {isWantToGo
                        ? <FavoriteIcon sx={iconSx}/>
                        : <FavoriteBorderIcon sx={iconSx} />
                    }
                </button>
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