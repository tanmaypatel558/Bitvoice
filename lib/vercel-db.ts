import type { Product } from './types'

// Default products data
const defaultProducts: Product[] = [
  {
    id: 1,
    name: "Margherita Classic",
    description: "Fresh mozzarella, tomato sauce, basil leaves",
    basePrice: 12.99,
    category: "pizza",
    type: "vegetarian",
    image: "/placeholder.svg?height=200&width=200",
    available: true,
    toppings: [
      { id: "pepperoni", name: "Pepperoni", price: 2.5 },
      { id: "mushrooms", name: "Mushrooms", price: 1.5 },
      { id: "olives", name: "Black Olives", price: 1.5 },
      { id: "peppers", name: "Bell Peppers", price: 1.5 },
      { id: "onions", name: "Red Onions", price: 1.0 },
      { id: "cheese", name: "Extra Cheese", price: 2.0 },
    ],
    sizes: [
      { id: "small", name: 'Small (8")', price: 0 },
      { id: "medium", name: 'Medium (12")', price: 3 },
      { id: "large", name: 'Large (16")', price: 6 },
    ],
  },
  {
    id: 2,
    name: "Pepperoni Supreme",
    description: "Pepperoni, mozzarella cheese, tomato sauce",
    basePrice: 15.99,
    category: "pizza",
    type: "non-vegetarian",
    image: "/placeholder.svg?height=200&width=200",
    available: true,
    toppings: [
      { id: "pepperoni", name: "Pepperoni", price: 2.5 },
      { id: "mushrooms", name: "Mushrooms", price: 1.5 },
      { id: "olives", name: "Black Olives", price: 1.5 },
      { id: "peppers", name: "Bell Peppers", price: 1.5 },
      { id: "onions", name: "Red Onions", price: 1.0 },
      { id: "cheese", name: "Extra Cheese", price: 2.0 },
    ],
    sizes: [
      { id: "small", name: 'Small (8")', price: 0 },
      { id: "medium", name: 'Medium (12")', price: 3 },
      { id: "large", name: 'Large (16")', price: 6 },
    ],
  },
  {
    id: 5,
    name: "Coca Cola",
    description: "Classic refreshing cola drink",
    basePrice: 2.99,
    category: "drink",
    type: "beverage",
    image: "/placeholder.svg?height=200&width=200",
    available: true,
  },
  {
    id: 6,
    name: "Pepsi",
    description: "Bold and refreshing cola",
    basePrice: 2.99,
    category: "drink",
    type: "beverage",
    image: "/placeholder.svg?height=200&width=200",
    available: true,
  },
]

// Storage key for localStorage
const STORAGE_KEY = 'pizzahub_products'

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

// Get products from localStorage or fallback to memory
function getStoredProducts(): Product[] {
  if (!isBrowser) {
    return [...defaultProducts]
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Validate that it's an array and has at least some products
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (error) {
    console.warn('Failed to load products from localStorage:', error)
  }

  // If no stored data or error, initialize with defaults
  const products = [...defaultProducts]
  if (isBrowser) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    } catch (error) {
      console.warn('Failed to save products to localStorage:', error)
    }
  }
  return products
}

// Save products to localStorage
function saveProducts(products: Product[]): void {
  if (!isBrowser) return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  } catch (error) {
    console.warn('Failed to save products to localStorage:', error)
  }
}

// In-memory cache for server-side rendering
let productsCache: Product[] | null = null
let lastUpdate = 0

// Get all products
export async function getProducts(): Promise<Product[]> {
  // For client-side, always use localStorage
  if (isBrowser) {
    return getStoredProducts()
  }

  // For server-side, use cache with fallback
  if (productsCache && Date.now() - lastUpdate < 5 * 60 * 1000) {
    return productsCache
  }

  productsCache = [...defaultProducts]
  lastUpdate = Date.now()
  
  return productsCache
}

// Get product by ID
export async function getProductById(id: number): Promise<Product | null> {
  const products = await getProducts()
  return products.find(p => p.id === id) || null
}

// Add new product
export async function addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
  const products = await getProducts()
  
  // Generate new ID
  const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1
  
  const newProduct: Product = {
    ...productData,
    id: newId,
    available: productData.available ?? true,
  }
  
  products.push(newProduct)
  
  // Update both cache and localStorage
  if (isBrowser) {
    saveProducts(products)
  } else {
    productsCache = products
    lastUpdate = Date.now()
  }
  
  return newProduct
}

// Update existing product
export async function updateProduct(id: number, updates: Partial<Product>): Promise<Product | null> {
  const products = await getProducts()
  const productIndex = products.findIndex(p => p.id === id)
  
  if (productIndex === -1) {
    return null
  }
  
  products[productIndex] = { ...products[productIndex], ...updates }
  
  // Update both cache and localStorage
  if (isBrowser) {
    saveProducts(products)
  } else {
    productsCache = products
    lastUpdate = Date.now()
  }
  
  return products[productIndex]
}

// Delete product
export async function deleteProduct(id: number): Promise<Product | null> {
  const products = await getProducts()
  const productIndex = products.findIndex(p => p.id === id)
  
  if (productIndex === -1) {
    return null
  }
  
  const deletedProduct = products.splice(productIndex, 1)[0]
  
  // Update both cache and localStorage
  if (isBrowser) {
    saveProducts(products)
  } else {
    productsCache = products
    lastUpdate = Date.now()
  }
  
  return deletedProduct
}

// Filter products by criteria
export async function filterProducts(filters: {
  category?: string
  available?: boolean
}): Promise<Product[]> {
  const products = await getProducts()
  
  return products.filter(product => {
    if (filters.category && product.category !== filters.category) {
      return false
    }
    if (filters.available !== undefined && product.available !== filters.available) {
      return false
    }
    return true
  })
}

// Clear all products (for testing)
export async function clearProducts(): Promise<void> {
  if (isBrowser) {
    localStorage.removeItem(STORAGE_KEY)
  }
  productsCache = null
} 