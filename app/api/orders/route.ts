import { NextResponse } from "next/server"

// Simple in-memory orders storage
let orders: any[] = []

export async function GET() {
  return NextResponse.json(orders)
}

export async function POST(request: Request) {
  try {
    const orderData = await request.json()
    
    // Create new order with ID
    const newOrder = {
      id: `ORD-${Date.now()}`,
      ...orderData,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    }
    
    // Add to orders array
    orders.push(newOrder)
    
    return NextResponse.json(newOrder, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
