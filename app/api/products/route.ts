import { type NextRequest, NextResponse } from "next/server"
import { filterProducts, addProduct } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const available = searchParams.get("available")

    const filters: { category?: string; available?: boolean } = {}
    
    if (category) {
      filters.category = category
    }
    
    if (available !== null) {
      filters.available = available === "true"
    }

    const products = await filterProducts(filters)
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()
    const newProduct = await addProduct(productData)
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
