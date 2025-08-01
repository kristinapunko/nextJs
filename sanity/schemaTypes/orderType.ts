import {BasketIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const orderType = defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  icon: BasketIcon,
  fields: [
    defineField({
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      validation: (Rule:any)=>Rule.required(),
    }),
    defineField({
        name: 'stripeCheckoutSessionId',
        title: 'Stripe Checkout Session Id',
        type: 'string',
    }),
    defineField({
        name: 'stripeCustomerId',
        title: 'Stripe Customer Id',
        type: 'string',
        validation: (Rule)=>Rule.required(),
    }),
    defineField({
        name: 'customerName',
        title: 'Customer Name',
        type: 'string',
        validation: (Rule)=>Rule.required(),
    }),
    defineField({
        name: 'email',
        title: 'Customer Email',
        type: 'string',
        validation: (Rule)=>Rule.required(),
    }),
    defineField({
        name: 'stripePaymentIntentId',
        title: 'Stripe Payment Intent Id',
        type: 'string',
        validation: (Rule)=>Rule.required(),
    }),
    defineField({
        name: 'products',
        title: 'Products',
        type: 'array',
        of:[
            defineArrayMember({
                type:"object",
                fields:[
                    defineField({
                        name: 'products',
                        title: 'Products Bought',
                        type:"reference",
                        to:[{type:"product"}],
                    }),
                    defineField({
                        name: 'quantiti',
                        title: 'Quantiti Purchased',
                        type:"number",
                    })
                ],
                preview: {
                    select: {
                        product:"product.name",
                        quantity: "quantity",
                        image: "product.image",
                        price: "product.price",
                        currency:"product.currency"
                    },
                    prepare(select) {
                        return {
                            title: `${select.product} x ${select.quantity}`,
                            media: select.image,
                            subtitle: `${select.price * select.quantity}`,
                        };
                    }
                }    
            })
        ]
    }),
    defineField({
        name: 'totalPrice',
        title: 'Total Price',
        type: 'number',
        validation: (Rule)=>Rule.required().min(0),
    }),
    defineField({
        name: 'currency',
        title: 'Currency',
        type: 'string',
        validation: (Rule)=>Rule.required(),
    }),
    defineField({
        name: 'amountDiscount',
        title: 'Amount Discount',
        type: 'number',
        validation: (Rule)=>Rule.min(0),
    }),
    defineField({
        name: 'status',
        title: 'Order Status',
        type: 'string',
        options:{
            list:[
                {title: "Pending", value:"pending"},
                {title: "Paid", value:"paid"},
                {title: "Shipped", value:"shipped"},
                {title: "Delivered", value:"delivered"},
                {title: "Cancellede", value:"cancellede"}
            ]
        }
    }),
    defineField({
        name: 'orderDate',
        title: 'Order Date',
        type: 'datetime',
        validation: (Rule)=>Rule.required(),
      }),
  ],
  preview: {
    select: {
        name:"customerName",
        amount: "totalPrice",
        currency:"currency",
        orderId: "orderNumber",
        email:"email"
    },
    prepare(select) {
        const orderSnippet = `${select.orderId.slice(0, 5)}...${select.orderId.slice(-5)}`;
        return {
            title: `${select.name} (${orderSnippet})`,
            media: BasketIcon,
            subtitle: `${select.amount} ${select.currency}, ${select.email}`,
        };
    }
}  
})
