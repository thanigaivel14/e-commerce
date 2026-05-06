import Product from "../model/product.js"

const seedProduct = async () => {
    try {
        const res = await fetch("https://fakestoreapi.com/products");
        const data = await res.json();
        // console.log(data);
        const formatted = data.map((p) => ({
            name: p.title,
            imageURL: p.image,
            description: p.description,
            price: Number((p.price*93).toFixed(2)),
            quantity:100,
            rating:p.rating.rate,

        }))
        await Product.insertMany(formatted);
        console.log("data added")
    }

    catch (e) {
        console.log(e.message);
    }
}

export default seedProduct;