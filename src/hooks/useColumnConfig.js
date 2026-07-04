import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'productTableColumns'

const DEFAULT_COLUMNS = [
  { id: 'image', label: 'Image', visible: true },
  { id: 'name', label: 'Name', visible: true },
  { id: 'category', label: 'Category', visible: true },
  { id: 'price', label: 'Price', visible: true },
  { id: 'stock', label: 'Stock Status', visible: true },
  { id: 'rating', label: 'Rating', visible: true },
]

function loadColumns() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return DEFAULT_COLUMNS
    const parsed = JSON.parse(stored)
    // Guard against corrupted/outdated storage
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_COLUMNS
    return parsed
  } catch {
    return DEFAULT_COLUMNS
  }
}

export function useColumnConfig() {
  const [columns, setColumns] = useState(loadColumns)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(columns))
  }, [columns])

  const toggleVisibility = useCallback((id) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === id ? { ...col, visible: !col.visible } : col))
    )
  }, [])

  const reorderColumn = useCallback((dragId, dropId) => {
    setColumns((prev) => {
      const dragIndex = prev.findIndex((c) => c.id === dragId)
      const dropIndex = prev.findIndex((c) => c.id === dropId)
      if (dragIndex === -1 || dropIndex === -1) return prev

      const next = [...prev]
      const [dragged] = next.splice(dragIndex, 1)
      next.splice(dropIndex, 0, dragged)
      return next
    })
  }, [])

  const resetColumns = useCallback(() => {
    setColumns(DEFAULT_COLUMNS)
  }, [])

  return { columns, toggleVisibility, reorderColumn, resetColumns }
}