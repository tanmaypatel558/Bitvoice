import type { Product } from './types'

// Default products data - only used for initial setup
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

// Storage keys for different data types
const STORAGE_KEYS = {
  PRODUCTS: 'pizzahub_products_v2',
  INITIALIZED: 'pizzahub_initialized_v2'
}

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

// Global products cache
let productsCache: Product[] | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 1000 // 1 second cache for performance

// Initialize database with default products if needed
function initializeDatabase(): void {
  if (!isBrowser) return

  try {
    const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED)
    if (!isInitialized) {
      // First time setup - save default products
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(defaultProducts))
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true')
      console.log('Database initialized with default products')
    }
  } catch (error) {
    console.error('Failed to initialize database:', error)
  }
}

// Get products from localStorage with proper error handling
function loadProductsFromStorage(): Product[] {
  if (!isBrowser) {
    return [...defaultProducts]
  }

  try {
    // Initialize if needed
    initializeDatabase()

    const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        // Validate each product has required fields
        const validProducts = parsed.filter(product => 
          product && 
          typeof product.id === 'number' && 
          typeof product.name === 'string' &&
          typeof product.basePrice === 'number' &&
          typeof product.category === 'string'
        )
        
        if (validProducts.length > 0) {
          return validProducts
        }
      }
    }

    // If no valid data, return defaults and save them
    console.log('No valid products found, using defaults')
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(defaultProducts))
    return [...defaultProducts]
  } catch (error) {
    console.error('Failed to load products from localStorage:', error)
    return [...defaultProducts]
  }
}

// Save products to localStorage with error handling
function saveProductsToStorage(products: Product[]): boolean {
  if (!isBrowser) return false

  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products))
    return true
  } catch (error) {
    console.error('Failed to save products to localStorage:', error)
    return false
  }
}

// Get all products with caching
export async function getProducts(): Promise<Product[]> {
  // Use cache if available and recent
  if (productsCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return [...productsCache]
  }

  // Load from storage
  const products = loadProductsFromStorage()
  
  // Update cache
  productsCache = [...products]
  cacheTimestamp = Date.now()
  
  return products
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
    images: productData.images || []
  }
  
  // Add to array
  const updatedProducts = [...products, newProduct]
  
  // Save to storage
  const saved = saveProductsToStorage(updatedProducts)
  if (saved) {
    // Update cache
    productsCache = [...updatedProducts]
    cacheTimestamp = Date.now()
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
  
  // Update product
  const updatedProduct = { ...products[productIndex], ...updates }
  const updatedProducts = [...products]
  updatedProducts[productIndex] = updatedProduct
  
  // Save to storage
  const saved = saveProductsToStorage(updatedProducts)
  if (saved) {
    // Update cache
    productsCache = [...updatedProducts]
    cacheTimestamp = Date.now()
  }
  
  return updatedProduct
}

// Delete product
export async function deleteProduct(id: number): Promise<Product | null> {
  const products = await getProducts()
  const productIndex = products.findIndex(p => p.id === id)
  
  if (productIndex === -1) {
    return null
  }
  
  const deletedProduct = products[productIndex]
  const updatedProducts = products.filter(p => p.id !== id)
  
  // Save to storage
  const saved = saveProductsToStorage(updatedProducts)
  if (saved) {
    // Update cache
    productsCache = [...updatedProducts]
    cacheTimestamp = Date.now()
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

// Clear all products and reset to defaults
export async function resetToDefaults(): Promise<void> {
  if (!isBrowser) return

  try {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS)
    localStorage.removeItem(STORAGE_KEYS.INITIALIZED)
    productsCache = null
    
    // Reinitialize
    initializeDatabase()
    
    console.log('Database reset to defaults')
  } catch (error) {
    console.error('Failed to reset database:', error)
  }
}

// Get database statistics
export async function getDbStats(): Promise<{
  totalProducts: number
  pizzas: number
  drinks: number
  storageUsed: number
}> {
  const products = await getProducts()
  
  return {
    totalProducts: products.length,
    pizzas: products.filter(p => p.category === 'pizza').length,
    drinks: products.filter(p => p.category === 'drink').length,
    storageUsed: isBrowser ? JSON.stringify(products).length : 0
  }
}

// Force cache refresh
export function refreshCache(): void {
  productsCache = null
  cacheTimestamp = 0
} 