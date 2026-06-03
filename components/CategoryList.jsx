import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image.js";

import { shuffleArray } from "../utils/utils.jsx";
import { getBlur } from "../utils/blur";

const CategoryList = ({ data, home }) => {
    const categories = useMemo(() => {
        return data?.docs?.length > 0 ? shuffleArray(data.docs) : [];
    }, [data]);

    if (home) return null;

    return (
        <section className="category-list__container">
            {categories.map((cat, index) => {
                const mediaUrl = cat?.media?.hero?.sizes?.tablet?.url;
                if (!mediaUrl) return null;

                return (
                    <div
                        key={cat.id || cat.url}
                        className="category-list__box"
                    >
                        <Link href={`/categories/${cat.url}`}>
                            <Image
                                src={mediaUrl}
                                placeholder="blur"
                                blurDataURL={getBlur(cat.media.hero?.thumbnailURL)}
                                alt={`hero image for ${cat.name}`}
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="(max-width: 600px) 100vw, 50vw"
                                decoding="async"
                                priority={index < 2}
                                fetchPriority={index < 2 ? 'high' : 'auto'}
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