import ProductsView from "@/components/ProductsView";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getProductsByCotegory } from "@/sanity/lib/products/getProductsByCotegory";

async function CategoryPage(
    { params }: {params: Promise<{ slug: string}>}) 
    {
    
        const {slug} = await params;
        const products = await getProductsByCotegory(slug);
        const categories = await getAllCategories();

        return(
            <div>
                {/* <h1>
                    {slug
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}{" "}
                    Collection
                </h1> */}
                <ProductsView products={products} categories={categories}/>
            </div>
        )
}

export default CategoryPage;