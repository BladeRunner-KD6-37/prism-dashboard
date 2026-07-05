import { memo } from 'react'
import { useNavigate } from 'react-router-dom'

function ProductTable({ products, columns, isAdmin, isHidden, onToggleHidden }) {
  const navigate = useNavigate()
  const visibleColumns = columns.filter((c) => c.visible)

  const renderCell = (colId, product) => {
    switch (colId) {
      case 'image':
        return (
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-12 h-12 object-contain bg-gray-50 rounded-md p-1"
            loading="lazy"
          />
        )
      case 'name':
        return <span className="font-medium text-gray-900">{product.title}</span>
      case 'category':
        return <span className="capitalize text-gray-600">{product.category}</span>
      case 'price':
        return <span className="font-medium">${product.price}</span>
      case 'stock':
        return (
          <span className={product.stock > 0 ? 'text-green-600' : 'text-red-500'}>
            {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
          </span>
        )
      case 'rating':
        return <span className="text-yellow-600">★ {product.rating}</span>
      default:
        return null
    }
  }

  return (
    <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            {visibleColumns.map((col) => (
              <th
                key={col.id}
                className="text-left px-4 py-3 font-medium text-gray-500 whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
            {isAdmin && (
              <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
            )}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className={`border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer ${
                isHidden(product.id) ? 'opacity-50' : ''
              }`}
              onClick={() => navigate(`/products/${product.id}`)}
            >
              {visibleColumns.map((col) => (
                <td key={col.id} className="px-4 py-3">
                  {renderCell(col.id, product)}
                </td>
              ))}
              {isAdmin && (
                <td className="px-4 py-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleHidden(product.id)
                    }}
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      isHidden(product.id)
                        ? 'bg-red-100 text-red-600'
                        : 'bg-green-100 text-green-600'
                    }`}
                  >
                    {isHidden(product.id) ? 'Hidden' : 'Published'}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default memo(ProductTable)