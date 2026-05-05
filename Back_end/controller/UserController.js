import asynchandler from "express-async-handler"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.js";
import Cart from "../model/cart.js";
import Product from "../model/product.js"
import mongoose from "mongoose";

const getToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'1d'});
}
const is_dev = process.env.IS_DEV === "true";

const cookiesOption = {
  httpOnly: true,                // ✅ correct key
  sameSite: !is_dev ? "lax" : "none",
  secure: is_dev,
  maxAge: 24 * 60 * 60 * 1000    // ✅ 1 day in ms
};
// used to create new user
const register = asynchandler(async(req,res)=>{
    const{name,email,password} = req.body;
    console.log(req.body)
    if(!name || !email || !password) return res.status(400).json("requried");
    const checkuser = await User.findOne({email});
    if(checkuser){
        return res.status(200).json("user exist");
    }
    const salt = await bcrypt.genSalt();
    const hashpassword = await bcrypt.hash(password,salt);
         const newuser = await User.create({name,email,password:hashpassword})
 if(newuser){
 res.cookie('token',getToken(newuser._id),cookiesOption).status(201).json({userinfo:{id:newuser._id,name:newuser.name,email:newuser.email}})
 }
 else{
res.status(400); throw new Error('Invalid user data');
 }
})


// used to login for old user
const login  = asynchandler(async(req,res)=>{
const {email,password} = req.body;
const user = await User.findOne({email});
if(!user) return res.status(404).json("user not found");
const isMatch = await bcrypt.compare(password,user.password);
if(!isMatch){
    return res.status(400).json("password mismatched")
}

return res.cookie('token',getToken(user._id),cookiesOption).status(200).json({userinfo:{id:user._id,name:user.name,email:user.email,address:user.address}});


})


//used to fetch logined user info
const getMe = asynchandler(async(req,res)=>{
if(req.user){
    res.status(200).json({userinfo:req.user})
}
else{
    res.status(404).json({ message: "User not logged in" });
}
})

//add to cart 
const AddCart = asynchandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json("Product not found");
  }

  let cart = await Cart.findOne({ userId });

  // 🆕 Create cart if not exists
  if (!cart) {
    cart = await Cart.create({
      userId,
      item: [],
    });
  }

  // 🔍 Check if product already in cart
  const existingItem = cart.item.find(
    (item) => item.productId.toString() === productId
  );

  if (existingItem) {
    // ✅ Update quantity
    existingItem.quantity += Number(quantity);
  } else {
    // ✅ Add new product
    cart.item.push({
      productId: product._id,
      quantity,
      price: product.price,
    });
  }

  await cart.save();

  return res.status(200).json({
    message: "Product added to cart"
  });
});

const getCart = asynchandler(async(req,res)=>{
    const userId= req.user.id;
    const cart = await Cart.findOne({userId})
    if(!cart){
        return res.status(404).json("user not created an cart list")
    }
    const cartTemplate = {
      id:"24",
      name:"33",
      image:"hwqku",
      quantity:13,
      price:24
    }
    const list = cart.item;
    const cartList = await Promise.all(list.map(async(l)=>{
      const product = await Product.findById(l.productId);
      return{
        id:l.productId,
        name:product.name,
        imageUrl:product.imageUrl || "",
        description:product.description,
        price:product.price,
        quantity:l.quantity,
        cartId:l._id
      }
    }))
    return res.status(200).json(cartList);

})

const productQuantity = asynchandler(async (req, res) => {
  const { cartId, quantity } = req.body;
  const userId = req.user._id;

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return res.status(404).json("no cart found");
  }

  const updateList = cart.item.map((l) => {
    if (l._id.toString() === cartId) {
      return {
        ...l.toObject(),   // ✅ convert properly
        quantity,
      };
    }
    return l;
  });

  const updateCart = await Cart.updateOne(
    { userId,},   // ✅ correct filter
    { $set: { item: updateList } }
  );
  console.log(updateList)

  if (updateCart) {
    return res.status(200).json("cart updated");
  }
});

// Delete a single item from cart
const deleteCartItem = asynchandler(async (req, res) => {
  const { cartId } = req.params;
  const userId = req.user._id;

  const cart = await Cart.findOne({ userId });
  if (!cart) return res.status(404).json("Cart not found");

  cart.item = cart.item.filter((item) => item._id.toString() !== cartId);
  await cart.save();

  return res.status(200).json("Item removed from cart");
});

// Clear entire cart
const clearCart = asynchandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.findOneAndUpdate(
    { userId },
    { $set: { item: [] } },
    { new: true }
  );

  if (!cart) return res.status(404).json("Cart not found");

  return res.status(200).json("Cart cleared");
});

// Update user address
const updateAddress = asynchandler(async (req, res) => {
  const userId = req.user._id;
  const { name, phone, addressLine, pincode } = req.body;

  if (!name || !phone || !addressLine || !pincode) {
    return res.status(400).json("All address fields are required");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: { address: { name, phone, addressLine, pincode } } },
    { new: true }
  );

  if (!updatedUser) return res.status(404).json("User not found");

  return res.status(200).json({
    message: "Address updated",
    address: updatedUser.address,
  });
});

export{register,login,getMe,AddCart,getCart,productQuantity,deleteCartItem,clearCart,updateAddress}