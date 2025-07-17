import { type NextRequest, NextResponse } from "next/server"
import { getAllOrders, createOrder, filterOrders } from "@/lib/orders-storage"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const customerId = searchParams.get("customerId")

  const filteredOrders = filterOrders({ status: status || undefined, customerId: customerId || undefined })

  return NextResponse.json(filteredOrders)
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()
    
    // Add customerId if not provided
    if (!orderData.customerId) {
      orderData.customerId = `user_${Date.now()}`
    }
    
    const newOrder = createOrder(orderData)
    return NextResponse.json(newOrder, { status: 201 })
  } catch (error) {
    console.error("Failed to create order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
