import { useRef, useState } from 'react'
import { formatInr } from '../../utils/currency'

function ChevronLeft(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function ChevronRight(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

function DealCarousel({ title, products, onSeeAll, onProductClick }) {
  const trackRef = useRef(null)
  const dragState = useRef({ pointerId: null, startX: 0, startScrollLeft: 0 })
  const [dragging, setDragging] = useState(false)

  const scrollByAmount = (amount) => {
    if (!trackRef.current) return
    trackRef.current.scrollBy({ left: amount, behavior: 'smooth' })
  }

  const handlePointerDown = (e) => {
    if (!trackRef.current) return
    dragState.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startScrollLeft: trackRef.current.scrollLeft,
    }
    setDragging(true)
    trackRef.current.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e) => {
    if (!dragging || !trackRef.current) return
    const delta = e.clientX - dragState.current.startX
    trackRef.current.scrollLeft = dragState.current.startScrollLeft - delta
  }

  const endDrag = (e) => {
    if (!trackRef.current) return
    if (dragState.current.pointerId !== null) {
      try {
        trackRef.current.releasePointerCapture(dragState.current.pointerId)
      } catch {
        // Ignore if capture was already released.
      }
    }
    dragState.current.pointerId = null
    setDragging(false)
    if (e) {
      e.preventDefault()
    }
  }

  return (
    <section className="mb-2 bg-white border border-gray-200 shadow-sm p-2 md:p-3 group">
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-sm md:text-base font-semibold text-gray-900">{title}</h3>
        <button
          type="button"
          onClick={onSeeAll}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          See All
        </button>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => scrollByAmount(-320)}
          className="hidden md:flex absolute left-1 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white/95 text-gray-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={`Scroll ${title} left`}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div
          ref={trackRef}
          className={`flex gap-2.5 overflow-x-auto pb-1.5 pr-2 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] ${
            dragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ touchAction: 'pan-x' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={(e) => {
            if (dragging && e.pointerType === 'mouse') endDrag(e)
          }}
        >
          {products.map((product) => (
            <article
              key={product.id}
              onClick={() => onProductClick(product.id)}
              className="min-w-[150px] max-w-[150px] sm:min-w-[165px] sm:max-w-[165px] border border-gray-200 rounded-md bg-white p-2 cursor-pointer hover:border-blue-300 hover:shadow-sm"
            >
              <div className="h-24 sm:h-28 w-full rounded bg-white border border-gray-200 overflow-hidden mb-2">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <h4 className="text-xs font-medium text-gray-900 line-clamp-2 min-h-8">{product.title}</h4>
              <p className="mt-1 text-xs font-semibold text-gray-900">{formatInr(product.price)}</p>
              <p className="text-[10px] text-yellow-600 font-medium">★ {product.rating}</p>
            </article>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollByAmount(320)}
          className="hidden md:flex absolute right-1 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white/95 text-gray-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={`Scroll ${title} right`}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  )
}

export default DealCarousel
