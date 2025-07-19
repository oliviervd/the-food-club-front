import React, { useMemo, useState, useEffect, useCallback } from "react";
import {useRouter} from "next/navigation";
import Loading from "../app/(app)/Loading.jsx";
import Link from "next/link";
import BroadCastForYou from "./BroadCastForYou.js";
import Image from "next/image.js";

// TODO: Add hover effect on desktop (show text explaining the category)

const CategoryList = ({ data, home }) => {
    const router = useRouter();
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [loadedImagesCount, setLoadedImagesCount] = useState(0);

    const shuffleArray = (array) => {
        const arr = [...array]; // avoid mutating original
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    useEffect(() => {
        const fallbackTimeout = setTimeout(() => {
            setImagesLoaded(true);
        }, 10); // fallback after 4s

        return () => clearTimeout(fallbackTimeout);
    }, []);

    // Memoize categories derived from data
    const categories = useMemo(() => {
        if (data?.docs?.length > 0) {
            return shuffleArray(data.docs); // shuffle once per render
        }
        return [];
    }, [data]);

    // Early return for empty categories
    const totalImages = useMemo(() => {
        return categories.reduce((count, cat) => {
            return count + (cat?.media?.hero?.sizes?.tablet?.url ? 1 : 0);
        }, 0);
    }, [categories]);

    // Handler for image load events
    const handleImageLoad = useCallback(() => {
        setLoadedImagesCount((loadedCount) => {
            const newCount = loadedCount + 1;
            //console.log("Image loaded:", newCount, "/", totalImages);
            if (newCount === totalImages) {
                setImagesLoaded(true);
            }
            return newCount;
        });
    }, [totalImages]);

    useEffect(() => {
        // If there are no images to load, immediately hide loading.
        if (totalImages === 0) {
            setImagesLoaded(true);
        }
    }, [totalImages]);

    if (!imagesLoaded) {
        return <Loading/>
    }


    return (
        <section className="category-list__container">

            {!home &&
                categories.map((cat, index) => {
                    const mediaUrl = cat?.media?.hero?.url;

                    // Skip categories without valid media
                    if (!mediaUrl) return null;

                    if (index === 1) {
                        return (
                            <React.Fragment key={index}>
                                <div className={"category-list__box"}>
                                    <Link href={`/categories/${cat.url}`}>
                                        <Image
                                            src={cat.media.hero.sizes.mobileFriendly.url || cat.media.hero.url}
                                            alt={`hero image for ${cat.name}`}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            sizes="100vw"
                                            priority={false} // or true for critical images
                                        />
                                        <h2>{cat.name}</h2>
                                        <p>{cat.slug}</p>
                                    </Link>
                                </div>
                                <div className={"category-list__box special"}>
                                    <Link href={"/events/"}>
                                        <h2 style={{fontSize: "20px"}}>Smash this button for tasty food events.</h2>
                                        <p>we believe good food deserves proper celebration. </p>
                                    </Link>
                                </div>
                            </React.Fragment>
                        );
                    }

                    if (index === 3) {
                        return (
                            <React.Fragment key={index}>
                                <div className={"category-list__box"}>
                                    <Link href={`/categories/${cat.url}`}>
                                        <Image
                                            src={cat.media.hero.sizes.mobileFriendly.url || cat.media.hero.url}
                                            alt={`hero image for ${cat.name}`}
                                            fill
                                            style={{ objectFit: 'cover' , zIndex: "-1111"}}
                                            sizes="100vw"
                                            priority={false} // or true for critical images
                                        />
                                        <h2>{cat.name}</h2>
                                        <p>{cat.slug}</p>
                                    </Link>
                                </div>
                                <div className={"category-list__box special"}>
                                    <BroadCastForYou type={'time'}/>
                                </div>
                            </React.Fragment>
                        );
                    }

                    return (
                        <div
                            key={cat.id || cat.url} // Use id/url for unique keys if available
                            className={"category-list__box"}
                        >
                            <Link href={`/categories/${cat.url}`}>
                                {/* Use the onLoad handler to detect when the image has loaded */}
                                <Image
                                    src={cat.media.hero.sizes.mobileFriendly.url || cat.media.hero.url}
                                    alt={`hero image for ${cat.name}`}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    sizes="100vw"
                                    priority={false} // or true for critical images
                                />
                                <h2>{cat.name}</h2>
                                <p>{cat.slug}</p>
                            </Link>
                        </div>
                    );
                })}
        </section>
    );
};

export default CategoryList;