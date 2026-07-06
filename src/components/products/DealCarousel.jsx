import { useRef, useState } from 'react';
import { formatInr } from '../../utils/currency';

function ChevronLeft(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

/**
 * DealCarousel component
 * @param {Object} props
 * @param {string} props.title
 * @param {Array} props.products
 * @param {function} props.onSeeAll
 * @param {function} props.onProductClick
 * @param {'horizontal'|'vertical'} [props.orientation='horizontal']
 */
function DealCarousel({ title, products, onSeeAll, onProductClick, orientation = 'horizontal' }) {
  const trackRef = useRef(null);
  const pointerState = useRef({
    isDown: false,
    startX: 0,
    startY: 0,
    startScrollLeft: 0,
    startScrollTop: 0,
    pointerId: null,
    hasDragged: false
  });
  const [dragging, setDragging] = useState(false);

  const scrollByAmount = (amount) => {
    if (!trackRef.current) return;
    if (orientation === 'vertical') {
      trackRef.current.scrollBy({ top: amount, behavior: 'smooth' });
    } else {
      trackRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const handlePointerDown = (e) => {
    if (!trackRef.current) return;
    pointerState.current = {
      isDown: true,
      startX: e.clientX,
      startY: e.clientY,
      startScrollLeft: trackRef.current.scrollLeft,
      startScrollTop: trackRef.current.scrollTop,
      pointerId: e.pointerId,
      hasDragged: false
    };
  };

  const handlePointerMove = (e) => {
    const state = pointerState.current;
    if (!state.isDown || !trackRef.current) return;

    const deltaX = e.clientX - state.startX;
    const deltaY = e.clientY - state.startY;

    if (!state.hasDragged) {
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (distance > 5) {
        state.hasDragged = true;
        setDragging(true);
        try {
          trackRef.current.setPointerCapture(state.pointerId);
        } catch {}
      }
    }

    if (state.hasDragged) {
      if (orientation === 'vertical') {
        trackRef.current.scrollTop = state.startScrollTop - deltaY;
      } else {
        trackRef.current.scrollLeft = state.startScrollLeft - deltaX;
      }
    }
  };

  const endDrag = (e) => {
    const state = pointerState.current;
    if (!state.isDown) return;

    if (state.hasDragged && trackRef.current && state.pointerId !== null) {
      try {
        trackRef.current.releasePointerCapture(state.pointerId);
      } catch {}
    }

    state.isDown = false;
    state.pointerId = null;

    if (state.hasDragged) {
      setDragging(false);
      if (e) e.preventDefault();
    }
  };

  const trackClass = orientation === 'vertical'
    ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5'
    : 'flex gap-2.5 overflow-x-auto pb-1.5 pr-2';
  const touchStyle = orientation === 'vertical' ? { touchAction: 'pan-y' } : { touchAction: 'pan-x' };

  const horizontalButtons = (
    <>
      <button
        type="button"
        onClick={() => scrollByAmount(-320)}
        className="hidden md:flex absolute left-1 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white/95 text-gray-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label={`Scroll ${title} left`}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => scrollByAmount(320)}
        className="hidden md:flex absolute right-1 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white/95 text-gray-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label={`Scroll ${title} right`}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </>
  );

  const verticalButtons = (
    <>
      <button
        type="button"
        onClick={() => scrollByAmount(-320)}
        className="hidden md:flex absolute top-1 left-1/2 -translate-x-1/2 z-10 h-9 w-9 flex-col items-center justify-center rounded-full border border-gray-300 bg-white/95 text-gray-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label={`Scroll ${title} up`}
      >
        <ChevronLeft className="h-4 w-4 transform rotate-90" />
      </button>
      <button
        type="button"
        onClick={() => scrollByAmount(320)}
        className="hidden md:flex absolute bottom-1 left-1/2 -translate-x-1/2 z-10 h-9 w-9 flex-col items-center justify-center rounded-full border border-gray-300 bg-white/95 text-gray-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label={`Scroll ${title} down`}
      >
        <ChevronRight className="h-4 w-4 transform rotate-90" />
      </button>
    </>
  );

  return (
    <section className="mb-2 bg-white border border-gray-200 shadow-sm p-2 md:p-3 group rounded-2xl">
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-sm md:text-base font-semibold text-gray-900">{title}</h3>
        <button
          type="button"
          onClick={onSeeAll}
          className="text-sm font-medium text-black hover:text-[#f2882c] hover:underline"
        >
          See All
        </button>
      </div>
      <div className="relative">
        {orientation === 'horizontal' ? horizontalButtons : null}
        <div
          ref={trackRef}
          className={`${trackClass} ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={touchStyle}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={(e) => { if (dragging && e.pointerType === 'mouse') endDrag(e); }}
        >
          {products.map((product) => (
            <article
              key={product.id}
              onClick={() => onProductClick(product.id)}
              className="bg-white/10 backdrop-blur-xl border border-white/20  shadow-xl p-6"
            >
              <div className="aspect-square w-full rounded bg-white overflow-hidden mb-2">
                <img src={product.thumbnail} alt={product.title} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <h4 className="text-xs font-medium text-gray-900 line-clamp-2 min-h-8">{product.title}</h4>
              <p className="text-[10px] font-montserrat-desc line-clamp-2 mt-1">{product.description}</p>
              <p className="mt-1 text-xs font-semibold text-gray-900">{formatInr(product.price)}</p>
              <p className="text-[10px] text-yellow-600 font-medium">★ {product.rating}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DealCarousel;
