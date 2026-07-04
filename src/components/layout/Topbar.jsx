import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Topbar({ onMenuClick }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    setDropdownOpen(false)
    navigate('/login')
  }

  return (
    <header className="flex items-center justify-between h-14 px-4 md:px-6 bg-white border-b border-gray-200 shrink-0">
      <button
        onClick={onMenuClick}
        className="md:hidden text-gray-500 hover:text-gray-700 text-xl"
        aria-label="Open menu"
      >
        ☰
      </button>

      <div className="flex-1" />

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium"
        >
          U
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
            <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
              Signed in as User
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Topbar