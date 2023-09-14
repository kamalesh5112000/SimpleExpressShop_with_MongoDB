const mongodb= require('mongodb');
const getDb= require('../util/database').getDb;

class User{
  constructor(username,email,cart,id){
    this.name=username;
    this.email=email;
    this.cart=cart;
    this._id=id;
  }
  save(){
    const db = getDb();
    return db.collection('users').insertOne(this)

  }
  addToCart(product){
    const cartProduct=this.cart.items.findIndex(cp=>{
      return cp.productId.toString()===product._id.toString();
    });
    let quantity=1;
    const updatedCartItems=[...this.cart.items];
    if(cartProduct>=0){
      quantity=this.cart.items[cartProduct].quantity+1;
      updatedCartItems[cartProduct].quantity=quantity
    }else{
      updatedCartItems.push({productId:new mongodb.ObjectId(product._id),quantity:quantity})
    }
    
    
    updatedCartItems
    const updatedCart={items:updatedCartItems}
    const db=getDb();
    return db.collection('users').updateOne({_id:new mongodb.ObjectId(this._id)},{$set:{cart:updatedCart}})


  }
  static findByPk(userId){
    const db = getDb();
    return db.collection('users').findOne({_id: new mongodb.ObjectId(userId)}).then(user=>{
      console.log(user)
      return user
    }).catch(err=>console.log(err));

  }

}

module.exports=User;