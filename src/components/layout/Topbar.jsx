import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

function Topbar({ onMenuClick }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { currentUser, logout } = useAuth()

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="flex items-center justify-between h-14 px-4 md:px-6 bg-white border-b border-gray-200 shrink-0">
      <button onClick={onMenuClick} className="md:hidden text-gray-500 hover:text-gray-700 text-xl">
        ☰
      </button>

      <div className="flex-1" />

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium"
        >
          {currentUser?.username?.[0]?.toUpperCase() || 'U'}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
            <div className="px-4 py-2 text-sm border-b border-gray-100">
              <p className="text-gray-900 font-medium">{currentUser?.username}</p>
              <p className="text-gray-400 text-xs capitalize">{currentUser?.role}</p>
            </div>
            <button
              onClick={logout}
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