
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
import ProductsView from "../../components/ProductsView"
import {getAllCategories} from "@/sanity/lib/products/getAllCategories"
import BaskFridayBanner from "@/components/BaskFridayBanner";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function Home() {
  const products = await getAllProducts();
  const categories = await getAllCategories();

  console.log(
    crypto.randomUUID().slice(0, 5) +
      `>>> Rerendered the home page cache for ${products.length} products and ${categories.length} categories`
  );

  return (
    <div>
        <BaskFridayBanner/>
        <ProductsView products={products} categories={categories}/>

      </div>
  );
}
