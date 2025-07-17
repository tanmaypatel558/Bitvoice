import { promises as fs } from 'fs'
import path from 'path'
import type { Product } from './types'

const DATA_DIR = path.join(process.cwd(), 'data')
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json')

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

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Initialize database with default data if it doesn't exist
async function initializeDatabase() {
  await ensureDataDir()
  
  try {
    await fs.access(PRODUCTS_FILE)
  } catch {
    // File doesn't exist, create it with default data
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(defaultProducts, null, 2))
  }
}

// Get all products
export async function getProducts(): Promise<Product[]> {
  await initializeDatabase()
  
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading products:', error)
    return defaultProducts
  }
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
  await saveProducts(products)
  
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
  await saveProducts(products)
  
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
  await saveProducts(products)
  
  return deletedProduct
}

// Save products to file
async function saveProducts(products: Product[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2))
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