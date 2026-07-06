import { useMemo, useState, useEffect, useRef } from 'react'
import SearchBar from '../components/products/SearchBar'
import { useProducts } from '../hooks/useProducts'
import DealCarousel from '../components/products/DealCarousel'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { formatInr } from '../utils/currency'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import shoeYellow from '../assets/shoe-yellow.jpg'

const IMAGES = [
  shoeYellow,
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
]

const featuredProducts = [
  {
    id: 101,
    title: 'AeroSound Pro Headphones',
    category: 'audio',
    price: 12999,
    description: 'Wireless over-ear headphones with active noise cancellation and 40-hour battery life.',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 102,
    title: 'Pulse X Smartwatch',
    category: 'wearables',
    price: 8499,
    description: 'Fitness-first smartwatch with AMOLED display, heart-rate tracking, and GPS support.',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 103,
    title: 'Lumina Desk Lamp',
    category: 'home',
    price: 3499,
    description: 'Minimal LED desk lamp with adjustable color temperature and touch controls.',
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
  },
]

function ProductsHome() {
  const [search, setSearch] = useState('')
  const { products } = useProducts()
  const navigate = useNavigate()

  // Retrieve transition context from Layout.jsx
  const context = useOutletContext()
  const introCompleted = context?.introCompleted ?? true
  const setIntroCompleted = context?.setIntroCompleted ?? (() => { })

  const containerRef = useRef(null)
  const contentRef = useRef(null)

  // Redirect instantly if prefers-reduced-motion is true
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setIntroCompleted(true)
    }
  }, [setIntroCompleted])

  // GSAP intro animation scroll trigger (only when intro is not completed)
  useGSAP(() => {
    if (introCompleted) return

    gsap.registerPlugin(ScrollTrigger)

    const scrollerElement = document.querySelector('main')
    if (!scrollerElement) return

    // Build timeline pinned to standard layout scroller (main element)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        scroller: scrollerElement,
        start: 'top top',
        end: '+=250%',
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress
          const activeIndex = Math.min(IMAGES.length - 1, Math.floor(progress * IMAGES.length))

          // Perform direct DOM manipulation for performance (avoiding re-renders on scroll ticks)
          if (containerRef.current) {
            const imgElements = containerRef.current.querySelectorAll('.postcard-img')
            imgElements.forEach((img, idx) => {
              if (idx === activeIndex) {
                img.classList.add('opacity-100')
                img.classList.remove('opacity-0')
              } else {
                img.classList.add('opacity-0')
                img.classList.remove('opacity-100')
              }
            })
          }

          if (progress >= 0.99) {
            self.kill(true)
            setIntroCompleted(true)
          }
        },
      },
    })

    // Converge texts to the center (ease none for linear 1:1 scroll tracking)
    tl.fromTo(
      '#we-close',
      { x: '-40vw', y: '-30vh', opacity: 0 },
      { x: '0', y: '0', opacity: 1, ease: 'none' },
      0
    )

    tl.fromTo(
      '#the-gap',
      { x: '40vw', y: '30vh', opacity: 0 },
      { x: '0', y: '0', opacity: 1, ease: 'none' },
      0
    )

    // Scale postcard up from 1 to 1.6
    tl.fromTo(
      '#postcard',
      { scale: 1 },
      { scale: 1.6, ease: 'none' },
      0
    )

    return () => {
      // Revert & kill triggers
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, { scope: containerRef, dependencies: [introCompleted] })

  // Animate product dashboard content once intro finishes
  useGSAP(() => {
    if (!introCompleted || !contentRef.current) return

    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }
    )
  }, [introCompleted])

  const bestValueDeals = useMemo(() => {
    return [...products]
      .filter((p) => typeof p.discountPercentage === 'number')
      .sort((a, b) => b.discountPercentage - a.discountPercentage)
      .slice(0, 12)
  }, [products])

  const handleSeeAllBestValue = () => {
    navigate('/products?sort=price-asc')
  }

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return featuredProducts
    return featuredProducts.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    )
  }, [search])

  // Phase 1: Scroll-scrubbed Intro
  if (!introCompleted) {
    return (
      <div
        ref={containerRef}
        className="relative w-full h-screen bg-white overflow-hidden flex items-center justify-center"
      >
        {/* Subtle light ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-50/20 via-white to-yellow-50/20 pointer-events-none" />

        {/* Cycling Postcard Image Container */}
        <div
          id="postcard"
          className="relative w-72 h-80 md:w-80 md:h-[400px] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-black/5 bg-zinc-50 z-10 flex items-center justify-center"
        >
          {IMAGES.map((imgUrl, idx) => (
            <img
              key={idx}
              src={imgUrl}
              alt={`Intro gallery ${idx + 1}`}
              className={`postcard-img absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out ${idx === 0 ? 'opacity-100' : 'opacity-0'
                }`}
            />
          ))}
        </div>

        {/* Overlapping Text Headlines */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
          <div className="text-center">
            <h1
              id="we-close"
              className="text-6xl sm:text-7xl md:text-9xl font-black text-zinc-950 uppercase tracking-tighter select-none leading-none"
            >
              WE SELL
            </h1>
            <h1
              id="the-gap"
              className="text-6xl sm:text-7xl md:text-9xl font-black text-[#FFD232] uppercase tracking-tighter select-none leading-none mt-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
            >
              EVERYTHING
            </h1>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-500 text-xs tracking-widest font-semibold z-30 pointer-events-none select-none">
          <span>SCROLL TO ENTER</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-4 h-4 animate-bounce text-zinc-500"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div ref={contentRef} className="w-full pb-10">
      <div className="px-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight">Featured Products</h1>
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {filteredProducts.length === 0 ? (
          <p className="text-[#4E5664] py-8 text-center">No products match your search.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                className="bg-white mb-5 border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer duration-300"
              >
                <img src={product.image} alt={product.title} className="w-full h-56 object-cover" loading="lazy" />

                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-yellow-500">{product.category}</p>
                  <h3 className="mt-1 text-lg font-bold text-gray-900">{product.title}</h3>
                  <p className="mt-2 text-sm font-montserrat-desc leading-6 text-gray-600">{product.description}</p>
                  <p className="mt-4 text-xl font-extrabold text-gray-900">{formatInr(product.price)}</p>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-10 border-t border-gray-200 pt-8">
          <DealCarousel
            title="Best Value Deals"
            products={bestValueDeals}
            onSeeAll={handleSeeAllBestValue}
            onProductClick={(id) => navigate(`/products/${id}`)}
            orientation="vertical"
          />
        </div>
      </div>
    </div>
  )
}

export default ProductsHome
