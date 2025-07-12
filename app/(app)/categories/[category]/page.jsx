import CategoryClient from "./categoryClient.jsx";
import {getPayload} from "payload";

export async function generateMetadata({ params }){

  let query = `https://thefoodclub.be/api/categories?where[url][equals]=${params.category}&depth=0`
  const res = await fetch(query, { cache: 'no-store' });

  const data = await res.json();

  // Safely find the one that matches params.category
  const category = data.docs.find(
      (cat) => cat.url === params.category
  );

  return {
    title: category.meta.title,
    description: category.meta.description,
    image: category.meta.image.url,
    keywords: ["review", "food club", category.meta.title], // todo: add these as a separate SEO field in the collection backend
    openGraph: {
      title: category.meta.title,
      description: category.meta.description,
      images: [{url: category.meta.image.url, alt: `image of ${category.meta.title}`}],
      url: `https://thefoodclub.be/categories/${category.url}`,
      type: 'website',
      site_name: 'The Food Club',
    },
    twitter: {
      card: 'summary_large_image',
      title: category.meta.title,
      description: category.meta.description,
      images: [{url: category.meta.image.url, alt: `image of ${category.meta.title}`}],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        noImageIndex: false,
      }
    },
  }
}

export default function CategoriesPage() {
  return (
      <CategoryClient />
  );
}