import ProductGrid from "@/components/ProductGrid";
import { searchProductByName } from "@/sanity/lib/products/searchProductByName";

async function SearchPage({
    searchParams
}:{
    searchParams:Promise<{
        query:string;
    }>
}) {
    const {query} = await searchParams
    const products = await searchProductByName(query)

    return(
        <div>
            <ProductGrid products={products}/>
        </div>
    )
}

export default SearchPage

// import ProductGrid from "@/components/ProductGrid";
// import { searchProductByName } from "@/sanity/lib/products/searchProductByName";

// // Define the expected type for searchParams
// interface SearchPageProps {
//   searchParams: Promise<Record<string, string | string[] | undefined>>;
// }

// async function SearchPage({ searchParams }: SearchPageProps) {
//   // Await the searchParams since it's a Promise
//   const resolvedSearchParams = await searchParams;
//   const query = resolvedSearchParams.query || "";
//   const products = await searchProductByName(query);

//   return (
//     <div>
//       <ProductGrid products={products} />
//     </div>
//   );
// }

// export default SearchPage;