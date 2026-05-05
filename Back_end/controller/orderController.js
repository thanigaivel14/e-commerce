import asyncHandler from "express-async-handler";
import User from "../model/user.js";
import Product from "../model/product.js";
import Order from "../model/order.js";
import Cart from "../model/cart.js";

// ====================== ORDER HISTORY ======================
const orderHis = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const orders = await Order.find({ userId });

    if (orders.length === 0) {
        return res.status(200).json([]); // ✅ consistent response
    }

    return res.status(200).json(orders);
});


// ====================== SINGLE ORDER ======================
const singleOrder = asyncHandler(async (req, res) => {
    const { pId, quantity, otherPrice } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json("User not found");

    const { name, phone, pincode, addressLine } = user.address || {};

    if (!name || !phone || !pincode || !addressLine) {
        return res.status(400).json("Please complete address");
    }

    const product = await Product.findById(pId);
    if (!product) {
        return res.status(404).json("Product not found");
    }

    // ✅ Safe other price
    const safeOtherPrice = Number(otherPrice) || 0;

    // ✅ Atomic stock update (prevents overselling)
    const updatedProduct = await Product.findOneAndUpdate(
        { _id: pId, quantity: { $gte: quantity } },
        { $inc: { quantity: -quantity } },
        { new: true }
    );

    if (!updatedProduct) {
        return res.status(400).json(
            `Only ${product.quantity} items available`
        );
    }

    const finalPrice = product.price + safeOtherPrice;

    const item = [
        {
            productId: product._id,
            name: product.name,
            price: product.price, // ✅ DB price only
            quantity,
            imageUrl: product.imageURL,
        },
    ];

    const order = await Order.create({
        userId,
        item,
        totalAmount: (product.price * quantity) + safeOtherPrice,
        address: user.address,
        paymentMethod: "COD",
        paymentStatus: "PENDING",
        orderStatus: "PLACED",
        createdAt: new Date(),
        delivered: false, // ✅ fixed typo
        date: new Date().toISOString().split("T")[0],
    });

    return res.status(201).json({
        message: "Order created successfully",
        order,
    });
});


// ====================== CART ORDER ======================
const cartOrder = asyncHandler(async (req, res) => {
    const { otherPrice } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json("User not found");

    const { name, phone, pincode, addressLine } = user.address || {};

    if (!name || !phone || !pincode || !addressLine) {
        return res.status(400).json("Please complete address");
    }

    const cartList = await Cart.findOne({ userId });

    if (!cartList || cartList.item.length === 0) {
        return res.status(400).json("Cart is empty");
    }

    const items = cartList.item;

    // ✅ Fetch products
    const products = await Promise.all(
        items.map(item => Product.findById(item.productId))
    );

    if (products.includes(null)) {
        return res.status(400).json("Some products were deleted");
    }

    // ✅ Create product map for fast lookup
    const productMap = {};
    products.forEach(p => {
        productMap[p._id.toString()] = p;
    });

    // ✅ Validate stock & price
    for (const item of items) {
        const product = productMap[item.productId.toString()];

        if (!product) continue;

        if (product.quantity < item.quantity) {
            return res.status(400).json(
                `${product.name} only ${product.quantity} available`
            );
        }

        if (product.price !== item.price) {
            return res.status(400).json(
                `${product.name} price changed to ${product.price}`
            );
        }
    }

    // ✅ Create order items
    const orderItems = items.map(item => {
        const product = productMap[item.productId.toString()];

        return {
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
            imageUrl: product.imageURL,
        };
    });

    // ✅ Safe other price
    const safeOtherPrice = Number(otherPrice) || 0;

    // ✅ Total
    const totalAmount =
        orderItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        ) + safeOtherPrice;

    // ✅ Reduce stock atomically
    for (const item of items) {
        const updated = await Product.findOneAndUpdate(
            {
                _id: item.productId,
                quantity: { $gte: item.quantity },
            },
            {
                $inc: { quantity: -item.quantity },
            }
        );

        if (!updated) {
            return res.status(400).json(
                "Stock issue while processing order"
            );
        }
    }

    // ✅ Create order
    const order = await Order.create({
        userId,
        item: orderItems,
        totalAmount,
        address: user.address,
        paymentMethod: "COD",
        paymentStatus: "PENDING",
        orderStatus: "PLACED",
        createdAt: new Date(),
        delivered: false,
        date: new Date().toISOString().split("T")[0],
    });

    // ✅ Clear cart after order
    await Cart.findOneAndUpdate(
        { userId },
        { $set: { item: [] } }
    );

    return res.status(201).json({
        message: "Cart order placed successfully",
        order,
    });
});

export { cartOrder, singleOrder, orderHis };