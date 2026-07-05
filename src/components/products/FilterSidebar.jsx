import { memo, useState } from 'react'

function DeviceIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="4" y="3" width="16" height="12" rx="2" />
      <path d="M2 19h20" />
      <path d="M10 16h4" />
    </svg>
  )
}

function ShirtIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M8 4 6 7 3 8.5 5.5 13 8 12v8h8v-8l2.5 1L21 8.5 18 7l-2-3h-2l-2 2-2-2H8Z" />
    </svg>
  )
}

function WatchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M9 3h6l1 4H8l1-4Zm0 18h6l1-4H8l1 4Z" />
      <path d="M12 10v3l2 1" />
    </svg>
  )
}

function FaceIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M9 10h.01M15 10h.01" />
      <path d="M9 15c.8.8 1.8 1.2 3 1.2s2.2-.4 3-1.2" />
    </svg>
  )
}

function HomeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="m3 10 9-7 9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
    </svg>
  )
}

function LeafIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M5 15c0-6 5-10 14-11-1 9-5 14-11 14-2 0-3-1-3-3Z" />
      <path d="M7 17c1-3 4-6 9-9" />
    </svg>
  )
}

function BottleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M10 4h4" />
      <path d="M11 4v3l-3 4v8a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-8l-3-4V4" />
      <path d="M8 13h8" />
    </svg>
  )
}

function CartIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="10" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
      <path d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 7H7" />
    </svg>
  )
}

function SparkleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z" />
      <path d="m18 14 .9 2.1L21 17l-2.1.9L18 20l-.9-2.1L15 17l2.1-.9L18 14Z" />
    </svg>
  )
}

function CategoryIcon({ category, className }) {
  const normalized = category.toLowerCase()

  if (/smartphone|mobile|tablet|laptop|computer/.test(normalized)) {
    return <DeviceIcon className={className} aria-hidden="true" />
  }
  if (/shirt|top|dress|jacket|fashion|clothing|mens|womens/.test(normalized)) {
    return <ShirtIcon className={className} aria-hidden="true" />
  }
  if (/watch/.test(normalized)) {
    return <WatchIcon className={className} aria-hidden="true" />
  }
  if (/skin|beauty|fragrance|makeup/.test(normalized)) {
    return <FaceIcon className={className} aria-hidden="true" />
  }
  if (/furniture|home|decoration/.test(normalized)) {
    return <HomeIcon className={className} aria-hidden="true" />
  }
  if (/grocer|food/.test(normalized)) {
    return <LeafIcon className={className} aria-hidden="true" />
  }
  if (/sunglasses/.test(normalized)) {
    return <SparkleIcon className={className} aria-hidden="true" />
  }
  if (/motorcycle|vehicle|automotive/.test(normalized)) {
    return <CartIcon className={className} aria-hidden="true" />
  }
  if (/bag/.test(normalized)) {
    return <BottleIcon className={className} aria-hidden="true" />
  }

  return <CartIcon className={className} aria-hidden="true" />
}

function FilterSidebar({ categories, selected, onToggle, onClear, selectedGenders, onToggleGender }) {
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
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Category</h3>
        <h3 className="text-xs font-semibold text-gray-500 uppercase mt-4 mb-2">Gender</h3>
        <div className="flex flex-row flex-wrap gap-2.5 sm:flex-col sm:max-h-96 sm:overflow-y-auto pr-1">
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
                <span className="hidden sm:inline-flex items-center justify-center w-4 h-4 shrink-0 text-gray-400 group-hover:text-gray-600">
                  <CategoryIcon category={cat} className="w-4 h-4" />
                </span>
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
        <div className="flex flex-col gap-2 mt-2">
          {['men', 'women'].map((g) => {
            const isChecked = selectedGenders.includes(g)
            return (
              <label key={g} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleGender(g)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 shrink-0"
                />
                <span className={`capitalize text-sm ${isChecked ? 'text-gray-900 font-medium' : 'text-gray-600'}`} >
                  {g}
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