import Product from "../model/product.js"

const seedProduct = async () => {
    try {
        const res = await fetch("https://fake-store-api.mock.beeceptor.com");
        const data = await res.text();
        // console.log(data);
        const formatted = data.map((p) => ({
            name: p.name,
            imageURL: p.image,
            description: p.description,
            price: p.price,
        }))
        await Product.insertMany(formatted);
        console.log("data added")
    }

    catch (e) {
        console.log(e.message);
    }
}

export default seedProduct;