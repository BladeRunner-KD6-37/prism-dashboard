import { useState, useRef } from 'react'

function ColumnSettings({ columns, onToggle, onReorder, onReset }) {
  const [open, setOpen] = useState(false)
  const dragItem = useRef(null)

  const handleDragStart = (id) => {
    dragItem.current = id
  }

  const handleDrop = (dropId) => {
    if (dragItem.current && dragItem.current !== dropId) {
      onReorder(dragItem.current, dropId)
    }
    dragItem.current = null
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="px-3 py-2 text-sm  border-[#FFD232]  bg-[#FFFFFF] hover:bg-[#FFD232] flex items-center gap-1.5 rounded-2xl border-1 border-gray-200"
      >
        <span>⚙</span> Columns
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase">Columns</p>
              <button onClick={onReset} className="text-xs text-black hover:underline">
                Reset
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-2">Drag to reorder, click to show/hide</p>

            <div className="flex flex-col gap-1">
              {columns.map((col) => (
                <div
                  key={col.id}
                  draggable
                  onDragStart={() => handleDragStart(col.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(col.id)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 cursor-move"
                >
                  <span className="text-gray-300 text-sm">⠿</span>
                  <input
                    type="checkbox"
                    checked={col.visible}
                    onChange={() => onToggle(col.id)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700 flex-1">{col.label}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ColumnSettings