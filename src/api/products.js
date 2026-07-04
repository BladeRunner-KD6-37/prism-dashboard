const BASE_URL = 'https://dummyjson.com/products'

export async function fetchAllProducts() {
  // limit=0 returns all products in one call
  const res = await fetch(`${BASE_URL}?limit=0`)
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`)
  }
  const data = await res.json()
  return data.products
}

export async function fetchProductById(id) {
  const res = await fetch(`${BASE_URL}/${id}`)
  if (!res.ok) {
    throw new Error(`Failed to fetch product ${id}: ${res.status}`)
  }
  return res.json()
}