import { defineQuery } from "next-sanity"
import { sanityFetch } from "../live";

export async function getMyOrders(userId:string) {
    if (!userId){
        throw new Error("user Id is required")
    }

    const MY_ORDERS_QUERY = defineQuery(`
        *[_type == "order" && clerkUserId == $userId] | order(orderDate desc) {
            ...,
            products[]{
                ...,
                product->
            }
        }
    `);

    try { 
    const orders = await sanityFetch({ 
        query: MY_ORDERS_QUERY, 
        params:{
            userId,
        }
    }); 
    console.log("orders.data",orders.data);
    
    return orders.data || []; 
    } catch (error) {
    console.error("Error fetching orders:", error); 
     throw new Error("Error fetching orders")
    }
}