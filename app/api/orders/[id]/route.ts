import { type NextRequest, NextResponse } from "next/server"
import { getOrderById, updateOrder } from "@/lib/orders-storage"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const order = getOrderById(params.id)

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  return NextResponse.json(order)
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()
    const updatedOrder = updateOrder(params.id, updates)

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error("Failed to update order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
