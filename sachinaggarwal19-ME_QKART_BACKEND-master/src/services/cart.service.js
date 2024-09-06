const httpStatus = require("http-status");
const { Cart, Product } = require("../models");
const ApiError = require("../utils/ApiError");
const config = require("../config/config");

// TODO: CRIO_TASK_MODULE_CART - Implement the Cart service methods

/**
 * Fetches cart for a user
 * - Fetch user's cart from Mongo
 * - If cart doesn't exist, throw ApiError
 * --- status code  - 404 NOT FOUND
 * --- message - "User does not have a cart"
 *
 * @param {User} user
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
const getCartByUser = async (user) => {
  const cartBody = await Cart.findOne({email:user.email})
  if(!cartBody) throw new ApiError(httpStatus.NOT_FOUND)
  return cartBody
}; 

/**
 * Adds a new product to cart
 * - Get user's cart object using "Cart" model's findOne() method
 * --- If it doesn't exist, create one
 * --- If cart creation fails, throw ApiError with "500 Internal Server Error" status code
 *
 * - If product to add already in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product already in cart. Use the cart sidebar to update or remove product from cart"
 *
 * - If product to add not in "products" collection in MongoDB, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product doesn't exist in database"
 *
 * - Otherwise, add product to user's cart
 *
 *
 *
 * @param {User} user
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
const addProductToCart = async (user, productId, quantity) => {

  let cartBody = await Cart.findOne({email:user.email})

  if(!cartBody){
    cartBody = await Cart.create
    ({
      email:user.email,
      cartItems:[],
      paymentOption:config.default_payment_option

    })
  }
  if(cartBody==null){
  throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR,"User does not have a cart");   

}


let productIndex=-1
for (let i = 0; i < cartBody.cartItems.length; i++) {
  if(productId== cartBody.cartItems[i].product._id){
    productIndex=i;
    
  }
}

if(productIndex==-1){
  let productBody = await Product.findOne({ _id :productId})
  if(productBody==null){
    throw new ApiError(httpStatus.BAD_REQUEST ,"Product doesn't exist in database");
  
  }
  cartBody.cartItems.push({product:productBody,quantity:quantity})
}
else{
  throw new ApiError(httpStatus.BAD_REQUEST ,"Product already in cart. Use the cart sidebar to update or remove product from cart");

}
await cartBody.save();
return cartBody;
}

/**
 * Updates the quantity of an already existing product in cart
 * - Get user's cart object using "Cart" model's findOne() method
 * - If cart doesn't exist, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "User does not have a cart. Use POST to create cart and add a product"
 *
 * - If product to add not in "products" collection in MongoDB, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product doesn't exist in database"
 *
 * - If product to update not in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product not in cart"
 *
 * - Otherwise, update the product's quantity in user's cart to the new quantity provided and return the cart object
 *
 *
 * @param {User} user
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Cart>
 * @throws {ApiError}
 */
const updateProductInCart = async (user, productId, quantity) => {
  let cartBody = await Cart.findOne({email:user.email})

  
  if(cartBody==null){
  throw new ApiError(httpStatus.BAD_REQUEST,"User does not have a cart. Use POST to create cart and add a product")

};

  let productBody = await Product.findOne({ _id :productId})
  if(productBody==null){
    throw new ApiError(httpStatus.BAD_REQUEST ,"Product doesn't exist in database")}
  
let productIndex=-1
for (let i = 0; i < cartBody.cartItems.length; i++) {
  if(productId== cartBody.cartItems[i].product._id){
    productIndex=i;
    break;
  }
}
if(productIndex==-1){
      throw new ApiError(httpStatus.BAD_REQUEST ,"Product doesn't exist in database")
}else{
cartBody.cartItems[productIndex].quantity=quantity

}
await cartBody.save()
return cartBody
};

/**
 * Deletes an already existing product in cart
 * - If cart doesn't exist for user, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "User does not have a cart"
 *
 * - If product to update not in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product not in cart"
 *
 * Otherwise, remove the product from user's cart
 *
 *
 * @param {User} user
 * @param {string} productId
 * @throws {ApiError}
 */
const deleteProductFromCart = async (user, productId) => {
  let cartBody = await Cart.findOne({email:user.email})

  
  if(cartBody==null){
  throw new ApiError(httpStatus.BAD_REQUEST,"User does not have a cart")   

};


let productIndex=-1
for (let i = 0; i < cartBody.cartItems.length; i++) {
  if(productId== cartBody.cartItems[i].product._id){
    productIndex=i;
    break;
  }
}

if(productIndex==-1){
      throw new ApiError(httpStatus.BAD_REQUEST ,"Product not in cart")
  
  }
  

else{
  cartBody.cartItems.splice(productIndex,1)

}
await cartBody.save()

};

const checkout  = async (user) => {
  let userCart = await Cart.findOne({email:user.email})

  if(!userCart){
    throw new ApiError(httpStatus.NOT_FOUND,"User does not have a cart");}

    if(!userCart){
      throw new ApiError(httpStatus.NOT_FOUND,"User does not have a cart");}
  
      if(userCart.cartItems.length===0){
        throw new ApiError(httpStatus.BAD_REQUEST,"User cart is empty");}

        if(!(await user.hasSetNonDefaultAddress())){
          throw new ApiError(httpStatus.BAD_REQUEST,"User cart is empty");}

          let  totalCost=0
          userCart.cartItems.forEach(element => {totalCost+=element.product.cost*element.quantity
            
          });


          if(user.walletMoney<totalCost){
            throw new ApiError(httpStatus.BAD_REQUEST,"walle tMoney is less");}
       
            user.walletMoney-=totalCost
            user.save() 

            userCart.cartItems=[]
            userCart.save() 
            return userCart
}


module.exports = {
  getCartByUser,
  addProductToCart,
  updateProductInCart,
  deleteProductFromCart,
  checkout

};
