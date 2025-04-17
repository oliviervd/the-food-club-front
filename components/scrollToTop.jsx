"use client";

import { useEffect, useState } from "react";
import { useIsMobile } from "../hooks/isMobile"; // adjust path if needed

const ScrollToTop = () => {
    const [visible, setVisible] = useState(false);
    const isMobile = useIsMobile();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        if (isMobile) {
            window.addEventListener("scroll", handleScroll);
        }

        return () => window.removeEventListener("scroll", handleScroll);
    }, [isMobile]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!isMobile || !visible) return null;

    return (
        <p
            onClick={scrollToTop}
            className="scroll-to-top-button"
            style={{fontSize: "25px"}}
        >
            &#8613;

        </p>
    );
};

export default ScrollToTop;