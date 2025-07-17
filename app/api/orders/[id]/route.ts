import { NextResponse } from "next/server"

// This should match the orders array from the main orders route
// In a real app, you'd use a shared database
const orders: any[] = []

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const order = orders.find(o => o.id === params.id)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}
