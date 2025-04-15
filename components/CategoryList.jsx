import React, { useMemo, useState, useEffect, useCallback } from "react";
import {useRouter} from "next/navigation";
import DitherImage from "./DitherImage.jsx";import { useNavigate } from "react-router-dom";
import Loading from "../app/Loading.jsx";
import Link from "next/link";

// TODO: Add hover effect on desktop (show text explaining the category)

const CategoryList = ({ data, home }) => {
    const router = useRouter();

    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [loadedImagesCount, setLoadedImagesCount] = useState(0);


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

            if (newCount === totalImages) {
                setImagesLoaded(true); // All images have loaded
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
                categories.map((cat) => {
                    const _cat = cat.item.value;
                    const mediaUrl = _cat?.media?.hero?.sizes?.tablet?.url;

                    // Skip categories without valid media
                    if (!mediaUrl) return null;

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