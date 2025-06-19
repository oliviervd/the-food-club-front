import React, { useMemo, useState, useEffect, useCallback } from "react";
import {useRouter} from "next/navigation";
import DitherImage from "./DitherImage.jsx";import { useNavigate } from "react-router-dom";
import Loading from "../app/Loading.jsx";
import Link from "next/link";
import BroadCastForYou from "./BroadCastForYou.js";

// TODO: Add hover effect on desktop (show text explaining the category)

const CategoryList = ({ data, home }) => {
    const router = useRouter();

    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [loadedImagesCount, setLoadedImagesCount] = useState(0);


    useEffect(() => {
        const fallbackTimeout = setTimeout(() => {
            setImagesLoaded(true);
        }, 10); // fallback after 4s

        return () => clearTimeout(fallbackTimeout);
    }, []);

    // Memoize categories derived from data
    const categories = useMemo(() => {
        if (data?.docs && data.docs.length > 0) {
            return data.docs[0]?.items || [];
        }
        return [];
    }, [data]);

    // Early return for empty categories
    const totalImages = useMemo(() => {
        return categories.reduce((count, cat) => {
            const _cat = cat.item.value;
            return count + (_cat?.media?.hero?.sizes?.tablet?.url ? 1 : 0);
        }, 0);
    }, [categories]);

    // Handler for image load events
    const handleImageLoad = useCallback(() => {
        setLoadedImagesCount((loadedCount) => {
            const newCount = loadedCount + 1;
            console.log("Image loaded:", newCount, "/", totalImages);
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
            <div className={"category-list__box special"}>
                <BroadCastForYou type={'time'}/>
            </div>
            {!home &&
                categories.map((cat, index) => {
                    const _cat = cat.item.value;
                    const mediaUrl = _cat?.media?.hero?.sizes?.tablet?.url;

                    // Skip categories without valid media
                    if (!mediaUrl) return null;

                    if (index === 3) {
                        return (
                            <React.Fragment key={index}>
                                <div className={"category-list__box"}>
                                    <Link href={`/categories/${_cat.url}`}>
                                        <DitherImage url={_cat.media.hero.sizes.tablet.url} dim={true}/>
                                        <h2>{_cat.categoryTitle}</h2>
                                        <p>{_cat.categorySubTitles}</p>
                                    </Link>
                                </div>
                                <div className={"category-list__box special"}>
                                    <BroadCastForYou type={'advice'}/>
                                </div>
                            </React.Fragment>

                        );
                    }

                    return (
                        <div
                            key={_cat.id || _cat.url} // Use id/url for unique keys if available
                            className={"category-list__box"}
                        >
                            <Link href={`/categories/${_cat.url}`}>
                                {/* Use the onLoad handler to detect when the image has loaded */}
                                <DitherImage url={mediaUrl} dim={true} onLoad={handleImageLoad} />
                                <h2>{_cat.categoryTitle}</h2>
                                <p>{_cat.categorySubTitles}</p>
                            </Link>
                        </div>
                    );
                })}
        </section>
    );
};

export default CategoryList;