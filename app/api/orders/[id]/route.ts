import { type NextRequest, NextResponse } from "next/server"
import type { Order } from "@/lib/types"

// Mock database - same as above
const orders: Order[] = [
  {
    id: "12345",
    customerId: "user1",
    customerName: "John Doe",
    customerPhone: "+1 (555) 123-4567",
    items: [
      {
        id: 1,
        name: "Margherita Classic",
        category: "pizza",
        type: "vegetarian",
        size: 'Medium (12")',
        toppings: ["Extra Cheese"],
        price: 15.99,
        quantity: 2,
        image: "/placeholder.svg?height=100&width=100",
        basePrice: 12.99,
      },
    ],
    status: "preparing",
    total: 31.98,
    deliveryAddress: "123 Main Street, New York, NY 10001",
    paymentMethod: "card",
    createdAt: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 30 * 60000).toISOString(),
    notes: "Ring the doorbell",
  },
  {
    id: "12346",
    customerId: "user2",
    customerName: "Jane Smith",
    customerPhone: "+1 (555) 987-6543",
    items: [
      {
        id: 2,
        name: "Pepperoni Supreme",
        category: "pizza",
        type: "non-vegetarian",
        size: 'Large (16")',
        toppings: ["Pepperoni", "Mushrooms"],
        price: 21.99,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
        basePrice: 15.99,
      },
    ],
    status: "pending",
    total: 21.99,
    deliveryAddress: "456 Oak Avenue, New York, NY 10002",
    paymentMethod: "card",
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
    estimatedDelivery: new Date(Date.now() + 35 * 60000).toISOString(),
    notes: "Leave at door",
  },
  {
    id: "12347",
    customerId: "user3",
    customerName: "Mike Johnson",
    customerPhone: "+1 (555) 456-7890",
    items: [
      {
        id: 3,
        name: "Veggie Delight",
        category: "pizza",
        type: "vegetarian",
        size: 'Small (8")',
        toppings: ["Bell Peppers", "Onions", "Olives"],
        price: 13.99,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
        basePrice: 10.99,
      },
      {
        id: 4,
        name: "Coca Cola",
        category: "drink",
        type: "beverage",
        size: "Regular",
        toppings: [],
        price: 2.99,
        quantity: 2,
        image: "/placeholder.svg?height=100&width=100",
        basePrice: 2.99,
      },
    ],
    status: "delivered",
    total: 19.97,
    deliveryAddress: "789 Pine Street, New York, NY 10003",
    paymentMethod: "cash",
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    estimatedDelivery: new Date(Date.now() - 30 * 60000).toISOString(),
    notes: "Apartment 3B",
  },
  {
    id: "12348",
    customerId: "user4",
    customerName: "Sarah Wilson",
    customerPhone: "+1 (555) 321-0987",
    items: [
      {
        id: 5,
        name: "Meat Lovers",
        category: "pizza",
        type: "non-vegetarian",
        size: 'Large (16")',
        toppings: ["Pepperoni", "Sausage", "Chicken"],
        price: 25.99,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
        basePrice: 18.99,
      },
    ],
    status: "out-for-delivery",
    total: 25.99,
    deliveryAddress: "321 Elm Street, New York, NY 10004",
    paymentMethod: "card",
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    estimatedDelivery: new Date(Date.now() + 10 * 60000).toISOString(),
    notes: "Call when arrived",
  },
  {
    id: "12349",
    customerId: "user5",
    customerName: "David Brown",
    customerPhone: "+1 (555) 654-3210",
    items: [
      {
        id: 6,
        name: "Hawaiian Pizza",
        category: "pizza",
        type: "non-vegetarian",
        size: 'Medium (12")',
        toppings: ["Ham", "Pineapple"],
        price: 17.99,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
        basePrice: 14.99,
      },
    ],
    status: "confirmed",
    total: 17.99,
    deliveryAddress: "654 Maple Drive, New York, NY 10005",
    paymentMethod: "card",
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    estimatedDelivery: new Date(Date.now() + 40 * 60000).toISOString(),
    notes: "Ring twice",
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const order = orders.find((o) => o.id === params.id)

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  return NextResponse.json(order)
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()
    const orderIndex = orders.findIndex((o) => o.id === params.id)

    if (orderIndex === -1) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    orders[orderIndex] = { ...orders[orderIndex], ...updates }
    return NextResponse.json(orders[orderIndex])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
