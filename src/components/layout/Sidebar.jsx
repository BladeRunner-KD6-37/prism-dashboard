import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/products', label: 'Products' },
  { to: '/analytics', label: 'Analytics' },
]

function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col w-56 shrink-0 bg-white border-r border-gray-200 p-4">
      <div className="text-xl font-bold mb-8 px-2">Prism</div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar