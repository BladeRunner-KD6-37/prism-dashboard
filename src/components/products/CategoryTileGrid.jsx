function CategoryTileGrid({ tiles, selectedCategories, onTileClick }) {
  return (
    <section className="mb-2 bg-white">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-900">Shop by Category</h2>
        <p className="text-xs text-gray-500">Tap a tile to filter products</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-2.5">
        {tiles.map((tile) => {
          const selected = selectedCategories.includes(tile.category)

          return (
            <button
              key={tile.category}
              type="button"
              onClick={() => onTileClick(tile.category)}
              className={`group rounded-lg border overflow-hidden bg-white text-left transition-shadow hover:shadow-md ${
                selected ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'
              }`}
            >
              <div className="relative h-24 sm:h-28 md:h-32 bg-gray-100">
                <img
                  src={tile.thumbnail}
                  alt={tile.label}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/55 to-transparent" />
                <span className="absolute bottom-1.5 left-2 text-[10px] sm:text-xs text-white font-medium tracking-wide capitalize">
                  {tile.label}
                </span>
              </div>
              <div className="px-2 py-1.5">
                <p className="text-[11px] text-gray-500">{tile.count} items</p>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default CategoryTileGrid
