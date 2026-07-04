import { memo, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function ProductCard({ product, isAdmin, isHidden, onToggleHidden }) {
  const navigate = useNavigate()
  const [justUpdated, setJustUpdated] = useState(false)

  useEffect(() => {
    if (product._justUpdated) {
      setJustUpdated(true)
      const timer = setTimeout(() => setJustUpdated(false), 1200)
      return () => clearTimeout(timer)
    }
  }, [product._justUpdated, product.stock, product.price])

  return (
    <div
      className={`bg-white border rounded-lg p-3 flex flex-col relative transition-all duration-500 ${
        isHidden ? 'border-red-200 opacity-60' : 'border-gray-200'
      } ${justUpdated ? 'ring-2 ring-blue-400 bg-blue-50' : ''} hover:shadow-md`}
    >
      {isAdmin && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleHidden()
          }}
          className={`absolute top-2 right-2 z-10 text-xs px-2 py-1 rounded-full font-medium ${
            isHidden ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
          }`}
        >
          {isHidden ? 'Hidden' : 'Published'}
        </button>
      )}

      <div onClick={() => navigate(`/products/${product.id}`)} className="cursor-pointer">
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
    </div>
  )
}

export default memo(ProductCard)