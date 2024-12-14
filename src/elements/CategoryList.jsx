import React, { useMemo } from "react";
import DitherImage from "./DitherImage.jsx";
import { useNavigate } from "react-router-dom";

// TODO: Add hover effect on desktop (show text explaining the category)

const CategoryList = ({ data, home }) => {
    const nav = useNavigate();

    // Function to navigate to category
    const navigateTo = (route) => {
        nav(`/categories/${route}`);
    };

    // Memoize categories derived from data
    const categories = useMemo(() => {
        if (data?.docs && data.docs.length > 0) {
            return data.docs[0]?.items || [];
        }
        return [];
    }, [data]);

    // Early return for empty categories
    if (!categories.length) {
        return (
            <section className="category-list__container">
                <p></p>
            </section>
        );
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
                            onClick={() => navigateTo(_cat.url)}
                        >
                            <DitherImage url={mediaUrl} dim={true} />
                            <h2>{_cat.categoryTitle}</h2>
                            <p>{_cat.categorySubTitles}</p>
                        </div>
                    );
                })}
        </section>
    );
};

export default CategoryList;