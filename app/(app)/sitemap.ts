import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Fetch venues (published)
    const venueRes = await fetch(
        "https://thefoodclub.be/api/venues?limit=1000&where[_status][equals]=published",
        //{ cache: "no-store" }
    );
    const venueData = await venueRes.json();

    // Fetch categories (published)
    const categoryRes = await fetch(
        "https://thefoodclub.be/api/categories?limit=1000&where[_status][equals]=published",
        //{ cache: "no-store" }
    );
    const categoryData = await categoryRes.json();

    // Fetch cuisines (published)
    const cuisineRes = await fetch(
        "https://thefoodclub.be/api/cuisines?limit=1000",
        //{ cache: "no-store" }
    );
    const cuisineData = await cuisineRes.json();

    // Map venue URLs
    const venueRoutes = venueData.docs.map((venue: any) => ({
        url: `/venue/${encodeURIComponent(venue.url)}`,
        lastModified: venue.updatedAt || new Date().toISOString(),
    }));

    // Map category URLs
    const categoryRoutes = categoryData.docs.map((category: any) => ({
        url: `/categories/${encodeURIComponent(category.url)}`,
        lastModified: category.updatedAt || new Date().toISOString(),
    }));

    // Map cuisine URLs
    const cuisineRoutes = cuisineData.docs.map((cuisine: any) => ({
        url: `/venues/${encodeURIComponent(cuisine.name.toLowerCase())}`,
        lastModified: cuisine.updatedAt || new Date().toISOString(),
    }));

    // Static pages
    const staticRoutes = [
        { url: `/`, lastModified: new Date().toISOString() },
        { url: `/about`, lastModified: new Date().toISOString() },
    ];

    // Combine all routes
    return [...staticRoutes, ...categoryRoutes, ...cuisineRoutes, ...venueRoutes].map((route) => ({
        ...route,
        url: `https://thefoodclub.be${route.url}`,
    }));
}