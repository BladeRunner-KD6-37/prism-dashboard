import { useState, useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import LocomotiveScroll from 'locomotive-scroll'
import 'locomotive-scroll/dist/locomotive-scroll.css'

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true'
  })
  
  const containerRef = useRef(null)
  const contentRef = useRef(null)
  const scrollInstanceRef = useRef(null)
  const location = useLocation()

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      localStorage.setItem('sidebar-collapsed', String(next))
      return next
    })
  }

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return

    // Initialize LocomotiveScroll on the custom main content container
    const scroll = new LocomotiveScroll({
      lenisOptions: {
        wrapper: containerRef.current,
        content: contentRef.current,
        smoothWheel: true,
        duration: 1.2,
        lerp: 0.1,
      }
    })

    scrollInstanceRef.current = scroll

    return () => {
      scroll.destroy()
      scrollInstanceRef.current = null
    }
  }, [])

  // Scroll to top immediately on route/page transition
  useEffect(() => {
    if (scrollInstanceRef.current) {
      scrollInstanceRef.current.scrollTo(0, { immediate: true })
    }
  }, [location.pathname])

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        mobileOpen={mobileOpen} 
        onClose={() => setMobileOpen(false)} 
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
      />
      <div className="flex flex-1 flex-col min-w-0">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main ref={containerRef} className="flex-1 overflow-y-auto p-4 md:p-6">
          <div ref={contentRef}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout