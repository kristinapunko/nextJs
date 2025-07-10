import {TagIcon} from '@sanity/icons'
import { title } from 'process';
import {defineField, defineType} from 'sanity'

export const salesType = defineType({
  name: 'sale',
  title: 'Sale',
  type: 'document',
  icon: TagIcon,
  fields:[
    defineField({
        name: 'title',
        type: 'string',
        title: 'Sale Title',      
    }),
    defineField({
        name: 'description',
        type: 'text',
        title: 'Sale Description',      
    }),
    defineField({
        name: 'discountAmount',
        type: 'number',
        title: 'Discount Amount',   
        description:"Amount"   
    }),
    defineField({
        name: 'couponCode',
        type: 'string',
        title: 'Coupon Code',      
    }),
    defineField({
        name: 'validForm',
        type: 'datetime',
        title: 'Valid Form',      
    }),
    defineField({
        name: 'validUntil',
        type: 'datetime',
        title: 'Valid Until', 
    }),
    defineField({
        name: 'IsActive',
        type: 'boolean',
        title: 'Is Active', 
        description:"Toggle to active/deactive the sale",
        initialValue: true,
    }),
  ],
  preview: {
    select: {
        title:"title",
        discountAmount:"discountAmount",
        couponCode:"couponCode",
        IsActive:"IsActive"
    },
    prepare(selection) {
        const {title, discountAmount, couponCode, IsActive} = selection;
        return {
            title,
            subtitle: `${discountAmount}% off - Code: ${couponCode} - ${status}`,
        };
    }
}  
})