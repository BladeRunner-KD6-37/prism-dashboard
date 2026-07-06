import './Sidebar.css';
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Sidebar({ mobileOpen, onClose, isCollapsed, toggleSidebar, isHidden }) {
  const { isAdmin } = useAuth()
  const location = useLocation()

  const navItems = [
    { 
      to: '/products/home', 
      label: 'Home',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      )
    },
    { 
      to: '/products', 
      label: 'Products',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1,0-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0,1-1.12-1.243l1.264-12A1.125 1.125 0 0,1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1,1-.75 0 .375.375 0 0,1 .75 0Zm7.5 0a.375.375 0 1,1-.75 0 .375.375 0 0,1 .75 0Z" />
        </svg>
      )
    },
    ...(isAdmin ? [{ 
      to: '/analytics', 
      label: 'Analytics',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0,1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0,1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0,1-1.125-1.125V4.125Z" />
        </svg>
      )
    }] : []),
  ];

  const activeIndex = navItems.findIndex(item => location.pathname === item.to);
  const itemHeight = 40; // 36px height + 4px gap

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={onClose} />
      )}

      <aside
        className={`
          fixed md:static top-0 left-0 h-full shrink-0
          bg-white border-r border-gray-200 py-4 z-50
          transition-all duration-500 ease-in-out
          ${isHidden ? '!w-0 !px-0 !opacity-0 !pointer-events-none !border-r-0 !overflow-hidden' : ''}
          ${mobileOpen ? 'translate-x-0 w-64 px-4' : '-translate-x-full w-64 md:translate-x-0'}
          ${isCollapsed ? 'md:w-16 md:px-2' : 'md:w-56 md:px-4'}
        `}
      >
        <div className="flex items-center justify-between mb-8 px-2 relative min-h-[40px]">
          <span className={`text-xl font-bold transition-all duration-300 ${isCollapsed ? 'md:opacity-0 md:pointer-events-none md:w-0' : 'opacity-100 w-auto'}`}>
            Prism
          </span>
          <button
            onClick={toggleSidebar}
            className={`hidden md:flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-1.5 transition-all duration-300 cursor-pointer ${
              isCollapsed ? 'md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2' : ''
            }`}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
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
                `flex items-center gap-3 px-3 py-2 rounded-3xl text-sm font-medium font-montserrat transition-all duration-300 z-10 ${
                  isCollapsed ? 'md:justify-center md:px-0' : ''
                } ${
                  isActive ? 'text-[#4E5664]' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              {item.icon}
              <span className={`inline-block transition-all duration-300 origin-left whitespace-nowrap overflow-hidden ${
                isCollapsed ? 'md:opacity-0 md:max-w-0 md:pointer-events-none' : 'opacity-100 max-w-28'
              }`}>
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar