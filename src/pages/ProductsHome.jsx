import { useMemo, useState } from 'react'
import SearchBar from '../components/products/SearchBar'
import { useProducts } from '../hooks/useProducts'
import DealCarousel from '../components/products/DealCarousel'
import { useNavigate } from 'react-router-dom'
import { formatInr } from '../utils/currency'

const featuredProducts = [
  {
    id: 101,
    title: 'AeroSound Pro Headphones',
    category: 'audio',
    price: 12999,
    description: 'Wireless over-ear headphones with active noise cancellation and 40-hour battery life.',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 102,
    title: 'Pulse X Smartwatch',
    category: 'wearables',
    price: 8499,
    description: 'Fitness-first smartwatch with AMOLED display, heart-rate tracking, and GPS support.',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 103,
    title: 'Lumina Desk Lamp',
    category: 'home',
    price: 3499,
    description: 'Minimal LED desk lamp with adjustable color temperature and touch controls.',
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
  },
]

function ProductsHome() {
  const [search, setSearch] = useState('')
  const { products } = useProducts()



  const bestValueDeals = useMemo(() => {
    return [...products]
      .filter((p) => typeof p.discountPercentage === 'number')
      .sort((a, b) => b.discountPercentage - a.discountPercentage)
      .slice(0, 12);
  }, [products]);

  const navigate = useNavigate();
  const handleSeeAllBestValue = () => {
    navigate('/products?sort=price-asc');
  };
  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return featuredProducts;
    return featuredProducts.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
  }, [search]);

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Home Page</h1>
      <p className="mt-2 text-gray-600">This is the home page. You can customize this layout and content later.</p>

      <section className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Featured Products</h2>
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {filteredProducts.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">No products match your search.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                className="bg-white mb-5 border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <img src={product.image} alt={product.title} className="w-full h-56 object-cover" loading="lazy" />

                <div className="p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-blue-600">{product.category}</p>
                  <h3 className="mt-1 text-lg font-semibold text-gray-900">{product.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-6">{product.description}</p>
                  <p className="mt-4 text-xl font-bold text-gray-900">{formatInr(product.price)}</p>
                </div>
              </article>
            ))}
          </div>
        )}

        <DealCarousel
          title="Best Value Deals"
          products={bestValueDeals}
          onSeeAll={handleSeeAllBestValue}
          onProductClick={(id) => navigate(`/products/${id}`)}
          orientation="vertical" />
      </section>
    </div>
  )
}

export default ProductsHome
