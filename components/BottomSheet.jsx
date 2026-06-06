'use client';

import { useRef, useState, useEffect } from 'react';
import { useDrag } from '@use-gesture/react';

// Snap points as percentage of screen height from top
const SNAP_CLOSED = 1.0;   // fully off screen
const SNAP_HALF = 0.55;    // half open — shows key info
const SNAP_FULL = 0.08;    // fully open — shows everything

const BottomSheet = ({
                         isOpen,
                         onClose,
                         children,
                         initialSnap = 'half', // 'half' | 'full'
                     }) => {
    const sheetRef = useRef(null);
    const [snap, setSnap] = useState(SNAP_CLOSED);
    const [isDragging, setIsDragging] = useState(false);
    const [windowHeight, setWindowHeight] = useState(0);

    useEffect(() => {
        setWindowHeight(window.innerHeight);
        const handleResize = () => setWindowHeight(window.innerHeight);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Open/close
    useEffect(() => {
        if (isOpen) {
            setSnap(initialSnap === 'full' ? SNAP_FULL : SNAP_HALF);
        } else {
            setSnap(SNAP_CLOSED);
        }
    }, [isOpen, initialSnap]);

    const getTranslateY = (snapPoint) => windowHeight * snapPoint;

    const bind = useDrag(
        ({ active, movement: [, my], velocity: [, vy], direction: [, dy], last }) => {
            setIsDragging(active);

            if (last) {
                const currentY = getTranslateY(snap) + my;
                const currentSnapRatio = currentY / windowHeight;

                // Fast swipe down → close
                if (vy > 0.5 && dy > 0) {
                    onClose();
                    setSnap(SNAP_CLOSED);
                    return;
                }

                // Fast swipe up → full
                if (vy > 0.5 && dy < 0) {
                    setSnap(SNAP_FULL);
                    return;
                }

                // Snap to nearest point
                const snapPoints = [SNAP_FULL, SNAP_HALF, SNAP_CLOSED];
                const nearest = snapPoints.reduce((prev, curr) =>
                    Math.abs(curr - currentSnapRatio) < Math.abs(prev - currentSnapRatio) ? curr : prev
                );

                if (nearest === SNAP_CLOSED) {
                    onClose();
                }
                setSnap(nearest);
            }
        },
        {
            axis: 'y',
            filterTaps: true,
            bounds: { top: -windowHeight * 0.9, bottom: windowHeight * 0.5 },
            rubberband: true,
        }
    );

    const translateY = getTranslateY(snap);

    return (
        <>
            {/* Backdrop — tap to close */}
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 99998,
                        background: 'transparent',
                    }}
                    onClick={onClose}
                />
            )}

            {/* Sheet */}
            <div
                ref={sheetRef}
                style={{
                    position: 'fixed',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: `${windowHeight * (1 - SNAP_FULL)}px`,
                    background: 'var(--color-main, #c9ff00)',
                    borderTop: '2px solid var(--color-secondary, #000eff)',
                    borderLeft: '2px solid var(--color-secondary, #000eff)',
                    borderRight: '2px solid var(--color-secondary, #000eff)',
                    zIndex: 99999,
                    transform: `translateY(${translateY}px)`,
                    transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    touchAction: 'none',
                    willChange: 'transform',
                }}
            >
                {/* Drag handle */}
                <div
                    {...bind()}
                    style={{
                        padding: '12px 0 8px',
                        display: 'flex',
                        justifyContent: 'center',
                        cursor: 'grab',
                        flexShrink: 0,
                        touchAction: 'none',
                    }}
                >
                    <div style={{
                        width: 44,
                        height: 4,
                        background: 'var(--color-secondary, #000eff)',
                        opacity: 0.3,
                        borderRadius: 2,
                    }} />
                </div>

                {/* Scrollable content */}
                <div style={{
                    flex: 1,
                    overflowY: snap === SNAP_FULL ? 'auto' : 'hidden',
                    WebkitOverflowScrolling: 'touch',
                }}>
                    {children}
                </div>
            </div>
        </>
    );
};

export default BottomSheet;