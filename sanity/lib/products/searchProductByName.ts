import { defineQuery } from "next-sanity"
import { sanityFetch } from "../live";

export const searchProductByName = async (searchParam: string) =>{

    const PRODUCT_SEACH_QUERY = defineQuery(`
        *[
            _type == "product"
            && name match $searchParam
            ] | order(name asc)
    `);

    try {
        const products = await sanityFetch({
        query: PRODUCT_SEACH_QUERY,
        params: {
            searchParam:`${searchParam}*`, // ✅ ПЕРЕДАЧА ПАРАМЕТРУ
        },
        });

        return products.data || null;
    } catch (err) {
        console.error("Error fetching sale:", err);
        return [];
    }
}