// import { Metadata } from "@/actions/createCheckoutSession";
// import { backendClient } from "@/sanity/lib/backendClient";
// import stripe from "@/sanity/lib/stripe";
// import { error, log } from "console";
// import { headers } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";
// import { asLoadable } from "sanity";
// import Stripe from "stripe";

// export async function POST(req:NextRequest) {
//     const body = await req.text();
//     const headersList = await headers();
//     const sig = headersList.get("stripe-signature");

//     if(!sig){
//         return NextResponse.json({error:"No signature"}, {status: 400})
//     }

//     const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

//     if (!webhookSecret){
//         console.log("Stripe webhook secret is not set.");
//         return NextResponse.json(
//             {error: "Stripe webhook secret is not set"},
//             {status: 400}
//         )       
//     }

//     let event: Stripe.Event;
//     try{
//         event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
//     } catch (err){
//         console.error("Webhook signature verification faild", err);
//         return NextResponse.json(
//             {error: `Webhook Error: ${err}`},
//             {status:400}
//         )
//     }
    
//     if(event.type === "checkout.session.completed"){
//         const session = event.data.object as Stripe.Checkout.Session;
//         console.log("📦 Stripe session metadata:", session.metadata);

//         try{
//             const order = await createOrderInSanity(session);
//             console.log("Order created in Sanity:", order);
           

//         }catch(err){
//             console.error("Error creating order in Sanity:", err);
//             return NextResponse.json(
//                 {error: "Error creating order"},
//                 {status:400}
//             )
//         }
//     }
    
//     return NextResponse.json({received: true})
// }   

// async function createOrderInSanity(session:Stripe.Checkout.Session) {
//     const {
//         id,
//         amount_total,
//         currency,
//         metadata,
//         payment_intent,
//         customer,
//         total_details,
//     } = session

//     const { orderNumber, customerName, customerEmail, clerkUserId} = metadata as Metadata
    
//     const lineItemWithProduct = await stripe.checkout.sessions.listLineItems(
//         id,
//         {
//             expand: ["data.price.product"]
//         }
//     );

//     const sanityProducts = lineItemWithProduct.data.map((item)=>({
//         _key: crypto.randomUUID(),
//         product:{
//             _type: "reference",
//             _ref: (item.price?.product as Stripe.Product)?.metadata?.id,
//         },
//         quantity: item.quantity || 0
//     }))

//     const order = await backendClient.create({ 
//         _type: "order", 
//         orderNumber, 
//         stripeCheckoutSessionId: id, 
//         stripePaymentIntentId: payment_intent, 
//         customerName, 
//         stripeCustomerId: customer, 
//         clerkUserId: clerkUserId, 
//         email: customerEmail, 
//         currency, 
//         amountDiscount: total_details?.amount_discount 
//         ? total_details.amount_discount / 100 
//         : 0,
//         products: sanityProducts,
//         totalPrice: amount_total ? amount_total/100 : 0,
//         status: "paid",
//         orderDate: new Date().toISOString(),
//     });

//     return order;
// }


import { Metadata } from "@/actions/createCheckoutSession";
import { backendClient } from "@/sanity/lib/backendClient";
import stripe from "@/sanity/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
    const body = await req.text();
    const headersList = headers();
    const sig = (await headersList).get("stripe-signature");

    if (!sig) {
        console.error("❌ No Stripe signature found in headers.");
        return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error("❌ Stripe webhook secret is not set in env.");
        return NextResponse.json(
            { error: "Stripe webhook secret is not set" },
            { status: 400 }
        );
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
        console.error("❌ Webhook signature verification failed:", err);
        return NextResponse.json(
            { error: `Webhook Error: ${(err as Error).message}` },
            { status: 400 }
        );
    }

    // ✅ Перевіряємо подію
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log("✅ Stripe session received:");
        console.dir(session, { depth: null });

        if (!session.metadata) {
            console.error("❌ Metadata is missing in Stripe session.");
            return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
        }

        try {
            const order = await createOrderInSanity(session);
            console.log("✅ Order created in Sanity:", order);
        } catch (err) {
            console.error("❌ Error creating order in Sanity:", err);
            return NextResponse.json(
                { error: "Error creating order" },
                { status: 400 }
            );
        }
    } else {
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
}

async function createOrderInSanity(session: Stripe.Checkout.Session) {
    const {
        id,
        amount_total,
        currency,
        metadata,
        payment_intent,
        customer,
        total_details,
    } = session;

    const { orderNumber, customerName, customerEmail, clerkUserId } = metadata as Metadata;

    console.log("📝 Order metadata parsed:", {
        orderNumber,
        customerName,
        customerEmail,
        clerkUserId
    });

    const lineItems = await stripe.checkout.sessions.listLineItems(id, {
        expand: ["data.price.product"],
    });

    console.log("📦 Stripe line items:");
    console.dir(lineItems.data, { depth: null });

    const sanityProducts = lineItems.data.map((item) => {
        const stripeProduct = item.price?.product as Stripe.Product;
        const sanityProductId = stripeProduct?.metadata?.id;

        if (!sanityProductId) {
            console.warn("⚠️ Missing sanity product ID in Stripe product metadata:", stripeProduct);
        }

        return {
            _key: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
            product: {
                _type: "reference",
                _ref: sanityProductId,
            },
            quantity: item.quantity || 0,
        };
    });

    const orderData = {
        _type: "order",
        orderNumber,
        stripeCheckoutSessionId: id,
        stripePaymentIntentId: payment_intent,
        customerName,
        stripeCustomerId: customer,
        clerkUserId,
        email: customerEmail,
        currency,
        amountDiscount: total_details?.amount_discount
            ? total_details.amount_discount / 100
            : 0,
        products: sanityProducts,
        totalPrice: amount_total ? amount_total / 100 : 0,
        status: "paid",
        orderDate: new Date().toISOString(),
    };

    console.log("📤 Sending order to Sanity:", orderData);

    try {
        const order = await backendClient.create(orderData);
        return order;
    } catch (err) {
        console.error("❌ Sanity order creation failed:", err);
        throw err;
    }
}
