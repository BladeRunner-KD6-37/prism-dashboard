import { useState, useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import LocomotiveScroll from 'locomotive-scroll'
import 'locomotive-scroll/dist/locomotive-scroll.css'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true'
  })
  const [introCompleted, setIntroCompleted] = useState(false)

  const containerRef = useRef(null)
  const contentRef = useRef(null)
  const scrollInstanceRef = useRef(null)
  const location = useLocation()

  const isHomePage = location.pathname === '/products/home'
  const sidebarHidden = isHomePage && !introCompleted

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
    if (containerRef.current) {
      containerRef.current.scrollTop = 0
    }
    if (scrollInstanceRef.current) {
      scrollInstanceRef.current.scrollTo(0, { immediate: true })
    }
  }, [location.pathname])

  // Refresh GSAP ScrollTrigger when layout size changes
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)
    return () => clearTimeout(timer)
  }, [introCompleted])

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        isHidden={sidebarHidden}
      />
      <div className="flex flex-1 flex-col min-w-0">
        <div
          className={`transition-all duration-500 ease-in-out ${sidebarHidden ? 'h-0 opacity-0 pointer-events-none overflow-hidden' : 'h-14 opacity-100'
            }`}
        >
          <Topbar onMenuClick={() => setMobileOpen(true)} />
        </div>
        <main
          ref={containerRef}
          className={`flex-1 overflow-y-auto transition-all duration-500 ease-in-out ${sidebarHidden ? 'p-0' : 'p-4 md:p-6'
            }`}
        >
          <div ref={contentRef}>
            <Outlet context={{ introCompleted, setIntroCompleted }} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
