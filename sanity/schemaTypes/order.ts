

export default {
    name: 'order',
    type: 'document',
    title: 'Order',
   fields: [
    {
        name:'firstName',
        type:'string',
        title:'First Name'
    },
    {
     name:'lastName',
     title:'Last Name',
     type:'string'
    },
    {
        name:'email',
        title:'Email Address',
        type:'email'
    },
    {
        name:'company',
        title:'Company',
        type:'string'
    },
    {
        name:'country',
        title:'Country',
        type:'string'
    },
    {
        name:'city',
        title:'City',
        type:'string'
    },
    {
        name:'address1',
        title:'Address Line 1',
        type:'string'
    },
    {
        name:'address2',
        title:'Address Line 2',
        type:'string'
    },
    {
        name:'phone',
        title:'Phone Number',
        type:'string'
    },
   {
    name:'zipCode',
    title:'Zip Code',
    type:'string'
   },
   {
    name : 'discount',
    title : 'Discount',
    type : 'number',
   },
   {
    name: 'cartItems',
    title: 'Cart Items',
    type: 'array',
    of: [{ type: 'reference', to: { type: 'food' } }] 
  },
  
   {
    name:'total',
    title:'Total',
    type:'number'
   },
   {
    name : 'status',
    title : 'Order Status',
    type : 'string',
    options:{
        list:[
             {title:'Pending',value:'pending'},
            {title:'Processing',value:'processing'},
            {title:'Completed',value:'completed'},
            {title:'Cancelled',value:'cancelled'},
            {title:'dispatched',value:'dispatched'}
        ],
        layout:'radio'
    },
    initialValue:'pending'
 }
   ]

}