function SortDropdown({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Sort by...</option>
      <option value="name-asc">Name (A–Z)</option>
      <option value="name-desc">Name (Z–A)</option>
      <option value="price-asc">Price (Low–High)</option>
      <option value="price-desc">Price (High–Low)</option>
      <option value="rating-desc">Rating (High–Low)</option>
      <option value="rating-asc">Rating (Low–High)</option>
    </select>
  )
}

export default SortDropdown