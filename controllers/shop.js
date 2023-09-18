const Product = require('../models/product');


exports.getProducts = (req, res, next) => {
  Product.fetchAll()
  .then(products=>{
    //res.json(products)
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  }).catch(err=>{
    console.log(err)
  });
};

exports.getProduct = (req,res,next)=>{
  const prodid = req.params.productID;
  Product.findByPk(prodid).then(product=>{
    res.render('shop/product-detail',{product:product,pageTitle:product.title,path:'/products'})
    

  })
  .catch(err=>{
    console.log(err)
  });
  
  // Product.findBYID(prodid,product=>{
  //   res.render('shop/product-detail',{product:product,pageTitle:product.title,path:'/products'})

  // })
  
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
  .then(products=>{
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });

  }).catch(err=>{
    console.log(err)
  });
};

exports.getCart = (req, res, next) => {
  
  
  req.user.getCart().then(products=>{
    
      res.render('shop/cart', {
              path: '/cart',
              pageTitle: 'Your Cart',
              products:products,
              totalPrice:500
            });
    //console.log(cart)
  }).catch(err=>comsole.log(err));
  
  
};
exports.postCart =(req,res,next)=>{
  const prodId=req.body.productId;

  Product.findByPk(prodId).then(product=>{
    return req.user.addToCart(product)
  }).then(result=>{
    console.log(result)
    res.redirect('/cart')
  })
  

};
exports.postCartDelete=(req,res,next)=>{
  const prodId=req.body.productId;
  req.user.deleteItem(prodId)
  .then(()=>{
    res.redirect('/cart')
  })
  .catch(err=>console.log(err));


  
  // Product.findBYID(prodId,(product)=>{
  //   console.log(product)
  //   Cart.deletCartProduct(prodId,product.price);

  // })
  // console.log(prodId)
  // res.redirect('/cart');

}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
