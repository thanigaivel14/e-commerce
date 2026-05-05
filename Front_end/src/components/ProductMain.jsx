import useProduct from "../context/ProductContext";
import ProductCard from "./produtCard.jsx";

const ProductMain = () => {
  const { productList } = useProduct();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {productList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg font-medium">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productList.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductMain;
