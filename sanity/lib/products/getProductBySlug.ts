// import { defineQuery} from "next-sanity"; 
// import { sanityFetch } from "../live"; 
    
// export const getProductBySlug = async (slug:string) => { 

//     const PRODUCTS_BY_ID_QUERY= defineQuery( `
//         *[_type == "product" && slug.current == $slug] | order(name asc) [0]
//     `);
//     try { 
//     // Use sanityFetch to send the query 
//     const products = await sanityFetch({ 
//         query: PRODUCTS_BY_ID_QUERY, 
//         params:{
//             slug,
//         }
//     }); 
//     // Return the list of products, or an empty array if none are found 
//     return products.data || []; 
//     } catch (error) {
//     console.error("Error fetching all products:", error); 
//     return []; 
//     }
//     };


import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";
import { Product } from "@/sanity.types";

const PRODUCT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "product" && slug.current == $slug][0]
`);

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const { data: product } = await sanityFetch({
      query: PRODUCT_BY_SLUG_QUERY,
      params: { slug },
    });

    return product ?? null;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
};
