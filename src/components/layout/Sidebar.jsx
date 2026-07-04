import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Sidebar({ mobileOpen, onClose }) {
  const { isAdmin } = useAuth()

  const navItems = [
    { to: '/products', label: 'Products' },
    ...(isAdmin ? [{ to: '/analytics', label: 'Analytics' }] : []),
  ]

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={onClose} />
      )}

      <aside
        className={`
          fixed md:static top-0 left-0 h-full w-64 md:w-56 shrink-0
          bg-white border-r border-gray-200 p-4 z-50
          transform transition-transform duration-200 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between mb-8 px-2">
          <span className="text-xl font-bold">Prism</span>
          <button
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-gray-600 text-xl leading-none"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar