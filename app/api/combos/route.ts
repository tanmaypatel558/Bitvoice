import { NextResponse } from "next/server"
import type { ComboOffer } from "@/lib/types"

const combos: ComboOffer[] = [
  {
    id: 1,
    name: "Family Feast",
    description: "2 Large Pizzas + 4 Cold Drinks",
    items: [
      { productId: 1, quantity: 2 },
      { productId: 5, quantity: 4 },
    ],
    originalPrice: 45.96,
    discountedPrice: 35.99,
    image: "/placeholder.svg?height=200&width=200",
    active: true,
  },
  {
    id: 2,
    name: "Couple Special",
    description: "1 Medium Pizza + 2 Cold Drinks + Garlic Bread",
    items: [
      { productId: 1, quantity: 1 },
      { productId: 5, quantity: 2 },
    ],
    originalPrice: 22.97,
    discountedPrice: 18.99,
    image: "/placeholder.svg?height=200&width=200",
    active: true,
  },
]

export async function GET() {
  return NextResponse.json(combos.filter((combo) => combo.active))
}

export async function POST(request: Request) {
  try {
    const comboData = await request.json()
    const newCombo: ComboOffer = {
      ...comboData,
      id: Math.max(...combos.map((c) => c.id)) + 1,
    }

    combos.push(newCombo)
    return NextResponse.json(newCombo, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create combo" }, { status: 500 })
  }
}
