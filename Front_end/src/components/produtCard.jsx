import { useNavigate } from "react-router-dom";
import demoImage from "../assets/demo.png";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const imageUrl = product.imageURL && product.imageURL.length > 0 ? product.imageURL : demoImage;

  return (
    <div
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer group"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      {/* Image */}
      <div className="h-52 bg-gray-50 flex items-center justify-center overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = demoImage; }}
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h2 className="text-base font-semibold text-gray-800 line-clamp-2 leading-snug">
          {product.name}
        </h2>

        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-xl font-bold text-orange-500">₹{product.price}</span>
          <span className="text-xs text-yellow-600 font-medium bg-yellow-50 px-2 py-0.5 rounded-full">
            ⭐ {product.rating?.rate || 4.2}
          </span>
        </div>

        <p className="text-xs text-gray-400">
          {product.review?.length || 0} reviews
        </p>

        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/product/${product._id}`); }}
          className="mt-2 w-full bg-orange-500 text-white py-2 rounded-xl hover:bg-orange-600 transition font-medium text-sm"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
