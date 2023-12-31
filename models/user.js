const mongoose=require('mongoose');

const Schema=mongoose.Schema;
const userSchema=new Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  cart:{
    items:[
      {
        productId:{type:Schema.Types.ObjectId, ref:'Product',required:true},
        quantity:{type:Number,required:true}
      }
    ]
  }
});

userSchema.methods.addToCart=function(product){
  const cartProduct=this.cart.items.findIndex(cp=>{
    return cp.productId.toString()===product._id.toString();
  });
  let quantity=1;
  const updatedCartItems=[...this.cart.items];
  if(cartProduct>=0){
    quantity=this.cart.items[cartProduct].quantity+1;
    updatedCartItems[cartProduct].quantity=quantity
  }else{
    updatedCartItems.push({productId:product._id,quantity:quantity})
  }


  
  const updatedCart={items:updatedCartItems}
  this.cart=updatedCart;
  return this.save()
}

userSchema.methods.removerFromCart=function(prodId){
  const updatedCartItems=this.cart.items.filter(item=>{
    return item.productId.toString() !== prodId.toString();
  });
  this.cart.items=updatedCartItems;
  return this.save()
}

userSchema.methods.clearCart=function(){
  this.cart={items:[]};
  return this.save();
}

module.exports=mongoose.model('User',userSchema);

// const mongodb= require('mongodb');
// const getDb= require('../util/database').getDb;

// const ObjectId = mongodb.ObjectId;
// class User{
//   constructor(username,email,cart,id){
//     this.name=username;
//     this.email=email;
//     this.cart=cart;
//     this._id=id;
//   }
//   save(){
//     const db = getDb();
//     return db.collection('users').insertOne(this)

//   }
//   addToCart(product){
//     const cartProduct=this.cart.items.findIndex(cp=>{
//       return cp.productId.toString()===product._id.toString();
//     });
//     let quantity=1;
//     const updatedCartItems=[...this.cart.items];
//     if(cartProduct>=0){
//       quantity=this.cart.items[cartProduct].quantity+1;
//       updatedCartItems[cartProduct].quantity=quantity
//     }else{
//       updatedCartItems.push({productId:new mongodb.ObjectId(product._id),quantity:quantity})
//     }
    
    
//     updatedCartItems
//     const updatedCart={items:updatedCartItems}
//     const db=getDb();
//     return db.collection('users').updateOne({_id:new mongodb.ObjectId(this._id)},{$set:{cart:updatedCart}})


//   }

//   getCart(){
    
//     const db=getDb();
//     const productIds=this.cart.items.map(i=>{
//       return i.productId;
//     })
    
//     return db.collection('products').find({_id:{$in:productIds}}).toArray().then(products=>{
      
//       return products.map(p=>{
//         return {...p,quantity: this.cart.items.find(i=>{
//           return i.productId.toString()===p._id.toString();
//         }).quantity
//       }
//       })
//     });
//   }
//   deleteItem(prodId){
//     const db=getDb();
//     const updatedCartItems=this.cart.items.filter(item=>{
//       return item.productId.toString() !== prodId.toString();
//     });
//     return db.collection('users').updateOne({_id:new mongodb.ObjectId(this._id)},{$set:{cart:{items:updatedCartItems}}})


//   }
//   addOrder(){
//     const db = getDb();
//     return this.getCart()
//       .then(products => {
//         const order = {
//           items: products,
//           user: {
//             _id: new mongodb.ObjectId(this._id),
//             name: this.name
//           }
//         };
//         return db.collection('orders').insertOne(order);
//       })
//       .then(result => {
//         this.cart = { items: [] };
//         return db
//           .collection('users')
//           .updateOne(
//             { _id: new mongodb.ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       });
//   }
//   getOrders() {
//     const db = getDb();
//     return db
//       .collection('orders')
//       .find({ 'user._id': new ObjectId(this._id) })
//       .toArray();
//   }

//   static findByPk(userId){
//     const db = getDb();
//     return db.collection('users').findOne({_id: new mongodb.ObjectId(userId)}).then(user=>{
      
//       return user
//     }).catch(err=>console.log(err));

//   }

// }