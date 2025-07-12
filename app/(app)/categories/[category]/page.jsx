import CategoryClient from "./categoryClient.jsx";
import {getPayload} from "payload";

export async function generateMetadata({ params }){
  // seo here

  console.log(params.category)
  let query = `https://thefoodclub.be/api/categories?where[url][equals]=${params.category}&depth=0`
  console.log(query)
  const res = await fetch(query, { cache: 'no-store' });

  const data = await res.json();

  // Safely find the one that matches params.category
  const category = data.docs.find(
      (cat) => cat.url === params.category
  );

  console.log('Matched category:', category.meta);
  console.log(data);

  return {
    title: category.meta.title,
    description: category.meta.description,
  }
}

export default function CategoriesPage() {
  return (
      <CategoryClient />
  );
}