import { memo, useState } from 'react'

function FilterSidebar({ categories, selected, onToggle, onClear }) {
  const [showAll, setShowAll] = useState(false)
  const visibleCategories = showAll ? categories : categories.slice(0, 10)

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-white border border-gray-200 rounded-lg p-4 h-fit lg:sticky lg:top-4">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Filters
        </h2>
        {selected.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-blue-600 hover:underline font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
          Category
        </h3>
        <div className="flex flex-col gap-2.5 max-h-96 overflow-y-auto pr-1">
          {visibleCategories.map((cat) => {
            const isChecked = selected.includes(cat)
            return (
              <label
                key={cat}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggle(cat)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 shrink-0"
                />
                <span
                  className={`text-sm capitalize group-hover:text-gray-900 ${
                    isChecked ? 'text-gray-900 font-medium' : 'text-gray-600'
                  }`}
                >
                  {cat.replace(/-/g, ' ')}
                </span>
              </label>
            )
          })}
        </div>

        {categories.length > 10 && (
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="text-xs text-blue-600 hover:underline font-medium mt-3"
          >
            {showAll ? 'Show less' : `+ ${categories.length - 10} more`}
          </button>
        )}
      </div>
    </aside>
  )
}

export default memo(FilterSidebar)