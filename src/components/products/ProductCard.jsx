import { memo } from 'react'
import { useNavigate } from 'react-router-dom'

function ProductCard({ product }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer
                 hover:shadow-md transition-shadow flex flex-col"
    >
      <img
        src={product.thumbnail}
        alt={product.title}
        className="w-full h-36 object-cover rounded-md mb-3"
        loading="lazy"
      />
      <h3 className="font-medium text-sm text-gray-900 truncate">{product.title}</h3>
      <p className="text-xs text-gray-500 capitalize mb-2">{product.category}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="font-semibold text-gray-900">${product.price}</span>
        <span className="text-xs text-yellow-600 font-medium">★ {product.rating}</span>
      </div>
      <span
        className={`mt-2 text-xs font-medium ${
          product.stock > 0 ? 'text-green-600' : 'text-red-500'
        }`}
      >
        {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
      </span>
    </div>
  )
}

export default memo(ProductCard)