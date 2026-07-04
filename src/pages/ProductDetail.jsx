import { useParams } from 'react-router-dom'

function ProductDetail() {
  const { id } = useParams()
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Product Detail</h1>
      <p className="text-gray-500">Showing details for product ID: {id}</p>
    </div>
  )
}

export default ProductDetail