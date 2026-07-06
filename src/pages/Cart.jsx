import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatInr } from '../utils/currency'

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartCount, cartTotal } = useCart()
  const [checkoutMessage, setCheckoutMessage] = useState('')

  const hasItems = cartItems.length > 0

  const handleCheckout = () => {
    if (!hasItems) {
      return
    }

    // Mocked checkout only. No real payment processing is performed.
    setCheckoutMessage(`Order placed successfully! Total paid: ${formatInr(cartTotal)}`)
    clearCart()
  }

  const summary = useMemo(
    () => ({
      itemCount: cartCount,
      total: cartTotal,
    }),
    [cartCount, cartTotal],
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
        {hasItems && (
          <button
            onClick={clearCart}
            className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
          >
            Clear Cart
          </button>
        )}
      </div>

      {checkoutMessage && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {checkoutMessage}
        </div>
      )}

      {!hasItems ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="mb-2 text-base font-medium text-gray-800">Your cart is empty</p>
          <p className="mb-4 text-sm text-gray-500">Add a few products to continue.</p>
          <Link
            to="/products"
            className="inline-flex items-center rounded-2xl bg-[#FFD232] px-4 py-2 text-sm font-medium text-[#4E5664]"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-lg border border-gray-200 bg-white">
            <ul className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <li key={item.productId} className="p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-20 w-20 rounded-md bg-gray-50 object-contain p-1"
                      loading="lazy"
                    />

                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-sm font-semibold text-gray-900">{item.title}</h2>
                      <p className="mt-1 text-sm text-gray-600">Unit price: {formatInr(item.price)}</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        Line total: {formatInr(item.price * item.quantity)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="h-8 w-8 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="min-w-7 text-center text-sm font-semibold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="h-8 w-8 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-sm font-medium text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <aside className="h-fit rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between text-gray-600">
                <span>Total items</span>
                <span className="font-medium text-gray-900">{summary.itemCount}</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-gray-700">Total amount</span>
                <span className="text-base font-semibold text-gray-900">{formatInr(summary.total)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="mt-5 w-full rounded-3xl bg-[#FFD232] px-4 py-2.5 text-sm font-medium text-[#4E5664]"
            >
              Checkout
            </button>
          </aside>
        </div>
      )}
    </div>
  )
}

export default Cart
