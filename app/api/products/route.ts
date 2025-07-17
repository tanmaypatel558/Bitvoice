import { NextResponse } from "next/server"

// Static products data
const products = [
  {
    id: 1,
    name: "Margherita Classic",
    description: "Fresh mozzarella, tomato sauce, basil leaves",
    basePrice: 12.99,
    category: "pizza",
    type: "vegetarian",
    image: "https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg",
    available: true,
  },
  {
    id: 2,
    name: "Pepperoni Supreme",
    description: "Pepperoni, mozzarella cheese, tomato sauce",
    basePrice: 15.99,
    category: "pizza",
    type: "non-vegetarian",
    image: "https://images.pexels.com/photos/1653877/pexels-photo-1653877.jpeg",
    available: true,
  },
  {
    id: 3,
    name: "Veggie Delight",
    description: "Bell peppers, mushrooms, onions, olives",
    basePrice: 14.99,
    category: "pizza",
    type: "vegetarian",
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
    available: true,
  },
  {
    id: 4,
    name: "Margarita",
    description: "Fresh mozzarella, tomato sauce, basil leaves",
    basePrice: 12.99,
    category: "pizza",
    type: "vegetarian",
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
    available: true,
  },
  {
    id: 5,
    name: "Coca Cola",
    description: "Classic refreshing cola drink",
    basePrice: 2.99,
    category: "drink",
    type: "beverage",
    image: "https://images.pexels.com/photos/50593/coca-cola-cola-coke-glass-50593.jpeg",
    available: true,
  },
  {
    id: 6,
    name: "Fresh Orange Juice",
    description: "Freshly squeezed orange juice",
    basePrice: 3.99,
    category: "drink",
    type: "beverage",
    image: "https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg",
    available: true,
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const available = searchParams.get("available")

    let filteredProducts = products

    // Filter by category if specified
    if (category) {
      filteredProducts = filteredProducts.filter(product => product.category === category)
    }

    // Filter by availability if specified
    if (available !== null) {
      const isAvailable = available === "true"
      filteredProducts = filteredProducts.filter(product => product.available === isAvailable)
    }

    return NextResponse.json(filteredProducts)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
