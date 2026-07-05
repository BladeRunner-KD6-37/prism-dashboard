import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'
import { useLocation } from 'react-router-dom'

const Stairs = (props) => {
  const currentPath = useLocation().pathname

  const stairParentRef = useRef(null)
  const pageRef = useRef(null)

  useGSAP(
    function () {
      if (currentPath === '/') return

      const tl = gsap.timeline()
      tl.to(stairParentRef.current, {
        display: 'block',
      })
      tl.from('.stair', {
        height: 0,
        stagger: {
          amount: -0.2,
        },
      })
      tl.to('.stair', {
        y: '100%',
        stagger: {
          amount: -0.25,
        },
      })
      tl.to(stairParentRef.current, {
        display: 'none',
      })
      tl.to('.stair', {
        y: '0%',
      })

      gsap.fromTo(
        pageRef.current,
        { opacity: 0, scale: 1.2 },
        { opacity: 1, scale: 1, delay: 1, duration: 0.4, ease: 'power2.out' }
      )
    },
    [currentPath]
  )

  return (
    <div>
      <div
        ref={stairParentRef}
        className="h-screen w-full fixed z-50 top-0 left-0 pointer-events-none"
        style={{ display: 'none' }}
      >
        <div className="h-full w-full flex">
          <div className="stair h-full w-1/5 bg-[#FFD232]"></div>
          <div className="stair h-full w-1/5 bg-[#FFD232]"></div>
          <div className="stair h-full w-1/5 bg-[#FFD232]"></div>
          <div className="stair h-full w-1/5 bg-[#FFD232]"></div>
          <div className="stair h-full w-1/5 bg-[#FFD232]"></div>
        </div>
      </div>
      <div ref={pageRef}>{props.children}</div>
    </div>
  )
}

export default Stairs
