import { useMemo } from 'react'
import { useProducts } from '../hooks/useProducts'
import StatCard from '../components/charts/StatCard'
import CategoryChart from '../components/charts/CategoryChart'

function Analytics() {
  const { products, loading, error } = useProducts()

  const stats = useMemo(() => {
    if (products.length === 0) {
      return { total: 0, avgRating: 0, inventoryValue: 0, categoryData: [] }
    }

    const total = products.length

    const avgRating =
      products.reduce((sum, p) => sum + p.rating, 0) / total

    const inventoryValue = products.reduce(
      (sum, p) => sum + p.price * p.stock,
      0
    )

    const categoryCounts = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1
      return acc
    }, {})

    const categoryData = Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)

    return { total, avgRating, inventoryValue, categoryData }
  }, [products])

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading analytics...</div>
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error: {error}</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Products" value={stats.total} />
        <StatCard
          label="Average Rating"
          value={stats.avgRating.toFixed(2)}
          sublabel="out of 5"
        />
        <StatCard
          label="Total Inventory Value"
          value={`$${stats.inventoryValue.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}`}
          sublabel="price × stock, all products"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          Category Distribution
        </h2>
        <CategoryChart data={stats.categoryData} />
      </div>
    </div>
  )
}

export default Analytics