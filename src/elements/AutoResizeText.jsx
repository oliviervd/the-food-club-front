// src/AutoResizeText.jsx
import React, { useState, useEffect, useRef } from 'react';

const AutoResizeText = ({ text, maxFontSize = 100, minFontSize = 10 , padding = "15px 0px"}) => {

    const [fontSize, setFontSize] = useState(maxFontSize);
    const containerRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const adjustFontSize = () => {
            const container = containerRef.current;
            const textElement = textRef.current;
            if (!container || !textElement) return;

            let currentFontSize = maxFontSize;
            textElement.style.fontSize = `${currentFontSize}px`;

            while (
                (textElement.scrollWidth > container.clientWidth)  &&
                currentFontSize > minFontSize
                ) {
                currentFontSize -= 1;
                textElement.style.fontSize = `${currentFontSize}px`;
            }

            setFontSize(currentFontSize);
        };

        adjustFontSize();
        window.addEventListener('resize', adjustFontSize);

        return () => window.removeEventListener('resize', adjustFontSize);
    }, [text, maxFontSize, minFontSize]);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
            <div className={"text-logo"}
                ref={textRef}
                style={{fontSize: `${fontSize}px`, whiteSpace: 'nowrap', overflow: 'hidden', padding: padding}}
            >
                {text}
            </div>
        </div>
    );
};

export default AutoResizeText;