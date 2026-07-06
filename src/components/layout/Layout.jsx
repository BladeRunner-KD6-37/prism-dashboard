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
  const hideSidebarAndTopbar = isHomePage && !introCompleted

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
  }, [hideSidebarAndTopbar])

  // Scroll to top immediately on route/page transition or intro completion
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0
    }
    if (scrollInstanceRef.current) {
      scrollInstanceRef.current.scrollTo(0, { immediate: true })
    }
  }, [location.pathname, introCompleted])

  // Refresh GSAP ScrollTrigger when layout size changes
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)
    return () => clearTimeout(timer)
  }, [introCompleted])

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {!hideSidebarAndTopbar && (
        <Sidebar
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
        />
      )}
      <div className="flex flex-1 flex-col min-w-0">
        {!hideSidebarAndTopbar && <Topbar onMenuClick={() => setMobileOpen(true)} />}
        <main
          ref={containerRef}
          className={`flex-1 overflow-y-auto transition-all duration-500 ease-in-out ${hideSidebarAndTopbar ? 'p-0' : 'p-4 md:p-6'
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
