"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Plus, Minus, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/lib/store"
import { toast } from "sonner"
import { useNotifications } from "@/components/providers/notification-provider"

const pizzaData = {
  1: {
    id: 1,
    name: "Margherita Classic",
    description: "Fresh mozzarella, tomato sauce, basil leaves",
    basePrice: 12.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "vegetarian",
  },
}

const sizes = [
  { id: "small", name: 'Small (8")', price: 0 },
  { id: "medium", name: 'Medium (12")', price: 3 },
  { id: "large", name: 'Large (16")', price: 6 },
]

const toppings = [
  { id: "pepperoni", name: "Pepperoni", price: 2.5 },
  { id: "mushrooms", name: "Mushrooms", price: 1.5 },
  { id: "olives", name: "Black Olives", price: 1.5 },
  { id: "peppers", name: "Bell Peppers", price: 1.5 },
  { id: "onions", name: "Red Onions", price: 1.0 },
  { id: "cheese", name: "Extra Cheese", price: 2.0 },
  { id: "chicken", name: "Grilled Chicken", price: 3.0 },
  { id: "sausage", name: "Italian Sausage", price: 2.5 },
]

export default function ProductPage({ params }: { params: { id: string } }) {
  const [selectedSize, setSelectedSize] = useState("medium")
  const [selectedToppings, setSelectedToppings] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCartStore()
  const notifications = useNotifications()

  const pizza = pizzaData[1] // In a real app, you'd fetch based on params.id

  const calculatePrice = () => {
    const sizePrice = sizes.find((s) => s.id === selectedSize)?.price || 0
    const toppingsPrice = selectedToppings.reduce((total, toppingId) => {
      const topping = toppings.find((t) => t.id === toppingId)
      return total + (topping?.price || 0)
    }, 0)
    return (pizza.basePrice + sizePrice + toppingsPrice) * quantity
  }

  const handleToppingChange = (toppingId: string, checked: boolean) => {
    if (checked) {
      setSelectedToppings([...selectedToppings, toppingId])
    } else {
      setSelectedToppings(selectedToppings.filter((id) => id !== toppingId))
    }
  }

  const handleAddToCart = () => {
    const selectedSizeData = sizes.find((s) => s.id === selectedSize)
    const selectedToppingsData = selectedToppings.map((toppingId) => 
      toppings.find((t) => t.id === toppingId)?.name
    ).filter(Boolean) as string[]

    const cartItem = {
      id: Date.now(),
      name: pizza.name,
      category: "pizza" as const,
      type: pizza.category as "vegetarian" | "non-vegetarian",
      size: selectedSizeData?.name || "Medium",
      toppings: selectedToppingsData,
      price: calculatePrice() / quantity, // Price per item
      quantity: quantity,
      image: pizza.image,
      basePrice: pizza.basePrice,
    }

    addItem(cartItem)
    notifications.success(`${pizza.name} added to cart!`, "Pizza Added")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-red-600">PizzaHub</h1>
          </div>
          <Link href="/cart">
            <Button variant="outline" size="sm">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
            </Button>
          </Link>
        </div>
      </header>

      <div className="container px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative">
              <Image
                src={pizza.image || "/placeholder.svg"}
                alt={pizza.name}
                width={400}
                height={400}
                className="w-full rounded-lg object-cover"
              />
              <Badge className="absolute top-4 right-4 bg-green-500">
                {pizza.category === "vegetarian" ? "Veg" : "Non-Veg"}
              </Badge>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{pizza.name}</h1>
              <p className="text-muted-foreground text-lg">{pizza.description}</p>
            </div>

            {/* Size Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Choose Size</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                  {sizes.map((size) => (
                    <div key={size.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={size.id} id={size.id} />
                        <Label htmlFor={size.id}>{size.name}</Label>
                      </div>
                      <span className="font-medium">
                        {size.price > 0 ? `+$${size.price.toFixed(2)}` : "Base Price"}
                      </span>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Toppings Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Extra Toppings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {toppings.map((topping) => (
                    <div key={topping.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={topping.id}
                          checked={selectedToppings.includes(topping.id)}
                          onCheckedChange={(checked) => handleToppingChange(topping.id, checked as boolean)}
                        />
                        <Label htmlFor={topping.id}>{topping.name}</Label>
                      </div>
                      <span className="font-medium">+${topping.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Label>Quantity:</Label>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-10 w-10 p-0 border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4 text-orange-600" />
                  </Button>
                  <span className="w-12 h-10 flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-lg text-lg font-bold text-orange-800 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 select-none">{quantity}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-10 w-10 p-0 border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4 text-orange-600" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between text-2xl font-bold">
                <span>Total: ${calculatePrice().toFixed(2)}</span>
              </div>

              <Button size="lg" className="w-full" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
