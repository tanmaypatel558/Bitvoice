import { type NextRequest, NextResponse } from "next/server"
import type { Product } from "@/lib/types"

// Mock database - in production, use a real database
const products: Product[] = [
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const available = searchParams.get("available")

  let filteredProducts = products

  if (category) {
    filteredProducts = filteredProducts.filter((product) => product.category === category)
  }

  if (available !== null) {
    filteredProducts = filteredProducts.filter((product) => product.available === (available === "true"))
  }

  return NextResponse.json(filteredProducts)
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()

    const newProduct: Product = {
      ...productData,
      id: Math.max(...products.map((p) => p.id)) + 1,
      available: productData.available ?? true,
    }

    products.push(newProduct)
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
