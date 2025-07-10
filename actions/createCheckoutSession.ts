// "use server"

// import { BasketItem } from "@/app/store/store"
// import { imageUrl } from "@/sanity/lib/imageUrl";
// import stripe from "@/sanity/lib/stripe";

// export type Metadata = {
//     orderNumber: string,
//     customerName:string,
//     customerEmail: string,
//     clerkUserId: string
// }

// export type GroupedBasketItem = {
//    product: BasketItem["product"];
//    quantity: number
// };

// export async function createCheckoutSession(
//     items: GroupedBasketItem[],
//     metadata:Metadata
// ){
//     try{
//         const itemsWithoutPrice = items.filter((item) => !item.product.price);
//         if (itemsWithoutPrice.length > 0){
//             throw new Error("Some items do not have a price");
//         }
        
//         const customers = await stripe.customers.list({
//             email: metadata.customerEmail,
//             limit:1
//         });

//         let customerId: string | undefined;
//         if (customers.data.length>0){
//             customerId = customers.data[0].id;
//         }

//         const session = await stripe.checkout.sessions.create({
//             customer: customerId,
//             customer_creation: customerId ? undefined : "always",
//             customer_email: !customerId ? metadata.customerEmail : undefined,
//             metadata,
//             mode:"payment",
//             allow_promotion_codes:true,
//             success_url:`${`https://${process.env.VERCEL_URL}` || process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
//             cancel_url: `${`https://${process.env.VERCEL_URL}` || process.env.NEXT_PUBLIC_BASE_URL}/basket`,
//             line_items: items.map((item) =>({
//                 price_data:{
//                     currency:"gbp",
//                     unit_amount: Math.round(item.product.price! * 100),
//                     product_data:{
//                         name: item.product.name || "Unnamed",
//                         description:`Product ID: ${item.product._id}`,
//                         metadata:{
//                             id: item.product._id,
//                         },
//                         images: item.product.image
//                             ? [imageUrl(item.product.image).url()]
//                             : undefined
//                     }
//                 },
//                 quantity:item.quantity
//             }))
//         })
//     } catch (err){
//         console.error("Error creating checkout session", err);
//         throw err; 
//     }
    
// }

"use server";

import { BasketItem } from "@/app/store/store";
import { imageUrl } from "@/sanity/lib/imageUrl";
import stripe from "@/sanity/lib/stripe";

export type Metadata = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
};

export type GroupedBasketItem = {
  product: BasketItem["product"];
  quantity: number;
};

export async function createCheckoutSession(
  items: GroupedBasketItem[],
  metadata: Metadata
) {
  try {
    const itemsWithoutPrice = items.filter((item) => !item.product.price);
    if (itemsWithoutPrice.length > 0) {
      throw new Error("Some items do not have a price");
    }

    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });

    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_creation: customerId ? undefined : "always",
      customer_email: !customerId ? metadata.customerEmail : undefined,
      metadata,
      mode: "payment",
      allow_promotion_codes: true,
      success_url: `${
        process.env.NEXT_PUBLIC_BASE_URL || `https://${process.env.VERCEL_URL}`
      }/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
      cancel_url: `${
        process.env.NEXT_PUBLIC_BASE_URL || `https://${process.env.VERCEL_URL}`
      }/basket`,      
      line_items: items.map((item) => ({
        price_data: {
          currency: "gbp",
          unit_amount: Math.round(item.product.price! * 100),
          product_data: {
            name: item.product.name || "Unnamed Product",
            description: `Product ID: ${item.product._id}`,
            metadata: {
              id: item.product._id,
            },
            images:
              item.product.image && imageUrl(item.product.image)?.url()
                ? [imageUrl(item.product.image).url()]
                : [],
          },
        },
        quantity: item.quantity,
      })),
    });

    return session.url;
  } catch (err) {
    console.error("Error creating checkout session", err);
    throw err;
  }
}
