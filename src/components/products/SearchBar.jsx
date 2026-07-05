function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search products..."
      className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-2xl text-sm
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  )
}

export default SearchBar