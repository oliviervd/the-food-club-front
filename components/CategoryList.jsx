import React, { useMemo, useState, useEffect, useCallback } from "react";
import {useRouter} from "next/navigation";
// import Loading from "../app/(app)/Loading.jsx";
import Link from "next/link";
import dynamic from 'next/dynamic';
const BroadCastForYou = dynamic(() => import('./BroadCastForYou.js'), { ssr: false, loading: () => null });
import Image from "next/image.js";

// TODO: Add hover effect on desktop (show text explaining the category)

// next/image blur placeholders require a base64 data URL. When the CMS provides a normal URL
// (e.g. thumbnailURL), fallback to a small base64 shimmer so the blur effect actually shows.
const toBase64 = (str) =>
    typeof window === 'undefined'
        ? Buffer.from(str).toString('base64')
        : window.btoa(str)

const shimmer = (w = 16, h = 9) =>
    `data:image/svg+xml;base64,${toBase64(
        `<svg width="${w}" height="${h}" xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'>
          <defs>
            <linearGradient id='g'>
              <stop stop-color='#f6f7f8' offset='20%' />
              <stop stop-color='#edeef1' offset='50%' />
              <stop stop-color='#f6f7f8' offset='70%' />
            </linearGradient>
          </defs>
          <rect width='100%' height='100%' fill='#f6f7f8' />
          <rect id='r' width='100%' height='100%' fill='url(#g)' />
          <animate xlink:href='#r' attributeName='x' from='-100%' to='100%' dur='1s' repeatCount='indefinite'  />
        </svg>`)}>`

const isDataURL = (str) => typeof str === 'string' && str.startsWith('data:')

const getBlur = (thumb, fallbackWidth = 16, fallbackHeight = 9) =>
    isDataURL(thumb) ? thumb : shimmer(fallbackWidth, fallbackHeight)

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

    // Render progressively to avoid blocking LCP
    // Removed global loading gate so above-the-fold content can paint ASAP

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
                                            src={cat.media.hero.url}
                                            placeholder="blur"
                                            blurDataURL={getBlur(cat.media.hero.thumbnailURL)}
                                            alt={`hero image for ${cat.name}`}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            sizes="(max-width: 600px) 100vw, 50vw"
                                            decoding="async"
                                            priority={false}
                                        />
                                        <h2>{cat.name}</h2>
                                        <p>{cat.slug}</p>
                                    </Link>
                                </div>
                                {/*
                                 <div className={"category-list__box special"}>
                                    <Link href={"/events/"}>
                                        <h2 style={{fontSize: "20px"}}>Smash this button for tasty food events.</h2>
                                        <p>we believe good food deserves proper celebration. </p>
                                    </Link>
                                </div>
                                */}

                            </React.Fragment>
                        );
                    }

                    if (index === 3) {
                        return (
                            <React.Fragment key={index}>
                                <div className={"category-list__box"}>
                                    <Link href={`/categories/${cat.url}`}>
                                        <Image
                                            src={cat.media.hero.url}
                                            placeholder="blur"
                                            blurDataURL={getBlur(cat.media.hero.thumbnailURL)}
                                            alt={`hero image for ${cat.name}`}
                                            fill
                                            style={{ objectFit: 'cover' , zIndex: "-1111"}}
                                            sizes="(max-width: 600px) 100vw, 50vw"
                                            decoding="async"
                                            priority={false}
                                        />
                                        <h2>{cat.name}</h2>
                                        <p>{cat.slug}</p>
                                    </Link>
                                </div>
                                {/*
                                 <div className={"category-list__box special"}>
                                    <BroadCastForYou type={'time'}/>
                                </div>
                                */}
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
                                    src={cat.media.hero.url}
                                    placeholder="blur"
                                    blurDataURL={getBlur(cat.media.hero.thumbnailURL)}
                                    alt={`hero image for ${cat.name}`}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    sizes="(max-width: 600px) 100vw, 50vw"
                                    decoding="async"
                                    priority={index === 0}
                                    fetchPriority={index === 0 ? 'high' : 'auto'}
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