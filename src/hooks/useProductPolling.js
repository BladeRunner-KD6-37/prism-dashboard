import { useEffect, useRef } from 'react'

/**
 * Simulates live updates by randomly mutating stock/price
 * on a few products at a fixed interval, without hitting the real API
 * (dummyjson doesn't support live websockets/polling, so we mock it client-side).
 */
export function useProductPolling(products, setProducts, intervalMs = 8000) {
  const productsRef = useRef(products)
  productsRef.current = products

  useEffect(() => {
    if (productsRef.current.length === 0) return

    const interval = setInterval(() => {
      setProducts((prev) => {
        if (prev.length === 0) return prev

        // Pick 1-3 random products to "update"
        const updateCount = Math.floor(Math.random() * 3) + 1
        const indicesToUpdate = new Set()
        while (indicesToUpdate.size < updateCount && indicesToUpdate.size < prev.length) {
          indicesToUpdate.add(Math.floor(Math.random() * prev.length))
        }

        return prev.map((product, idx) => {
          if (!indicesToUpdate.has(idx)) return product

          // Random stock fluctuation (-3 to +5), never below 0
          const stockDelta = Math.floor(Math.random() * 9) - 3
          const newStock = Math.max(0, product.stock + stockDelta)

          // Small price fluctuation (±2%)
          const priceDelta = product.price * (Math.random() * 0.04 - 0.02)
          const newPrice = Math.max(1, +(product.price + priceDelta).toFixed(2))

          return {
            ...product,
            stock: newStock,
            price: newPrice,
            _justUpdated: true, // flag for a brief highlight animation
          }
        })
      })
    }, intervalMs)

    return () => clearInterval(interval)
  }, [intervalMs, setProducts])
}