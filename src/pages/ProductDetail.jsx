import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../api/products';
import ImageCarousel from '../components/products/ImageCarousel';
import { useAuth } from '../context/AuthContext';
import { usePublishedProducts } from '../hooks/usePublishedProducts';

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null);
  const { isAdmin } = useAuth();
  const { isHidden } = usePublishedProducts();

  useEffect(() => {
    // If the product is hidden and the user is not an admin, redirect immediately
    if (!isAdmin && isHidden(id)) {
      navigate('/products', { replace: true });
      return;
    }
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const data = await fetchProductById(id);
        if (!cancelled) {
          setProduct(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id, isAdmin, isHidden, navigate]);

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading product...</div>
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Could not load this product.</p>
        <button
          onClick={() => navigate('/products')}
          className="text-blue-600 text-sm hover:underline"
        >
          ← Back to products
        </button>
      </div>
    )
  }

  if (!isAdmin && isHidden(product.id)) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">This product is hidden.</p>
        <button
          onClick={() => navigate('/products')}
          className="text-blue-600 text-sm hover:underline"
        >
          ← Back to products
        </button>
      </div>
    );
  }
  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-flex items-center gap-1"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ImageCarousel images={product.images} />

        <div>
          <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full mb-3 capitalize">
            {product.category}
          </span>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-semibold text-gray-900">${product.price}</span>
            <span className="text-sm text-yellow-600 font-medium">★ {product.rating}</span>
            <span
              className={`text-sm font-medium ${
                product.stock > 0 ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </span>
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm border-t border-gray-100 pt-4">
            {product.brand && (
              <div>
                <span className="text-gray-400 block">Brand</span>
                <span className="text-gray-900 font-medium">{product.brand}</span>
              </div>
            )}
            {product.discountPercentage && (
              <div>
                <span className="text-gray-400 block">Discount</span>
                <span className="text-gray-900 font-medium">{product.discountPercentage}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail