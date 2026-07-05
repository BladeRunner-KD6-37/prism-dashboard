import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useNavigate } from 'react-router-dom'

function Topbar({ onMenuClick }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { currentUser, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()

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

      {/* Cart Icon */}
      <button
        onClick={() => navigate('/cart')}
        className="relative mr-4 rounded-md p-1 text-gray-600 hover:bg-gray-100"
        aria-label="Open cart"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 13l-1.35 2.7a1 1 0 001.06 1.48h9.58a1 1 0 001.06-1.48L17 13M7 13V6" />
        </svg>
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-xs text-white">
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </button>

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