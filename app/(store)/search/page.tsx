// import ProductGrid from "@/components/ProductGrid";
// import { searchProductByName } from "@/sanity/lib/products/searchProductByName";

// async function SearchPage({
//     searchParams
// }:{
//     searchParams:{
//         query:string;
//     }
// }) {
//     const {query} = searchParams
//     const products = await searchProductByName(query)

//     return(
//         <div>
//             <ProductGrid products={products}/>
//         </div>
//     )
// }

// export default SearchPage


import ProductGrid from "@/components/ProductGrid";
import { searchProductByName } from "@/sanity/lib/products/searchProductByName";

async function SearchPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
    const query = searchParams.query || "";
    const products = await searchProductByName(query);

    return (
        <div>
            <ProductGrid products={products} />
        </div>
    );
}

export default SearchPage;
