import './Sidebar.css';
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Sidebar({ mobileOpen, onClose }) {
  const { isAdmin } = useAuth()
  const location = useLocation()

  const navItems = [
    { to: '/products/home', label: 'Home' },
    { to: '/products', label: 'Products' },
    ...(isAdmin ? [{ to: '/analytics', label: 'Analytics' }] : []),
  ];
  const activeIndex = navItems.findIndex(item => location.pathname === item.to);
  const itemHeight = 48; // approximate height of each nav item (px)

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

        <nav className="relative flex flex-col gap-1">
          <div
            className="absolute left-0 w-full h-9 bg-[#FFD232] rounded-3xl transition-all duration-300 pointer-events-none"
            style={{ top: `${activeIndex * itemHeight}px`, opacity: activeIndex !== -1 ? 1 : 0 }}
          />
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-3xl text-sm font-medium font-montserrat transition-colors z-10 ${
                    isActive ? 'text-[#4E5664]' : 'text-gray-600 hover:bg-gray-100'
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