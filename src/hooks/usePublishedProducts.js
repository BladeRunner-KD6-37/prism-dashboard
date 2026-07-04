import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'hiddenProductIds'

function getStoredHiddenIds() {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? new Set(JSON.parse(stored)) : new Set()
}

export function usePublishedProducts() {
  const [hiddenIds, setHiddenIds] = useState(getStoredHiddenIds)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...hiddenIds]))
  }, [hiddenIds])

  const toggleHidden = useCallback((productId) => {
    setHiddenIds((prev) => {
      const next = new Set(prev)
      if (next.has(productId)) {
        next.delete(productId)
      } else {
        next.add(productId)
      }
      return next
    })
  }, [])

  const isHidden = useCallback((productId) => hiddenIds.has(productId), [hiddenIds])

  return { hiddenIds, toggleHidden, isHidden }
}