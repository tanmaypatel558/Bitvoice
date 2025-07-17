import { type NextRequest, NextResponse } from "next/server"
import type { Product } from "@/lib/types"

// Mock database - same as above
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
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === Number.parseInt(params.id))

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  return NextResponse.json(product)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()
    const productIndex = products.findIndex((p) => p.id === Number.parseInt(params.id))

    if (productIndex === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    products[productIndex] = { ...products[productIndex], ...updates }
    return NextResponse.json(products[productIndex])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const productIndex = products.findIndex((p) => p.id === Number.parseInt(params.id))

  if (productIndex === -1) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  const deletedProduct = products.splice(productIndex, 1)[0]
  return NextResponse.json(deletedProduct)
}
