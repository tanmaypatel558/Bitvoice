"use client"

import { useState, useEffect } from "react"
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

// Static product data
const productsData = {
  1: {
    id: 1,
    name: "Margherita Classic",
    description: "Fresh mozzarella, tomato sauce, basil leaves",
    basePrice: 12.99,
    category: "pizza",
    type: "vegetarian",
    image: "https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg",
    available: true,
  },
  2: {
    id: 2,
    name: "Pepperoni Supreme",
    description: "Pepperoni, mozzarella cheese, tomato sauce",
    basePrice: 15.99,
    category: "pizza",
    type: "non-vegetarian",
    image: "https://images.pexels.com/photos/1653877/pexels-photo-1653877.jpeg",
    available: true,
  },
  3: {
    id: 3,
    name: "Veggie Delight",
    description: "Bell peppers, mushrooms, onions, olives",
    basePrice: 14.99,
    category: "pizza",
    type: "vegetarian",
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
    available: true,
  },
  4: {  
    id: 4,
    name: "Margarita",
    description: "Fresh mozzarella, tomato sauce, basil leaves",
    basePrice: 12.99,
    category: "pizza",
    type: "vegetarian",
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
    available: true,
  },
  5: {
    id: 5,
    name: "Coca Cola",
    description: "Classic refreshing cola drink",
    basePrice: 2.99,
    category: "drink",
    type: "beverage",
    image: "https://images.pexels.com/photos/50593/coca-cola-cola-coke-glass-50593.jpeg",
    available: true,
  },
  6: {
    id: 6,
    name: "Fresh Orange Juice",
    description: "Freshly squeezed orange juice",
    basePrice: 3.99,
    category: "drink",
    type: "beverage",
    image: "https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg",
    available: true,
  },
}

// Default sizes and toppings for pizzas
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
]

export default function ProductPage({ params }: { params: { id: string } }) {
  const [selectedSize, setSelectedSize] = useState("medium")
  const [selectedToppings, setSelectedToppings] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)
  
  const { addItem } = useCartStore()
  const notifications = useNotifications()

  // Get product from static data
  const product = productsData[parseInt(params.id) as keyof typeof productsData]

  // If product not found, show error
  if (!product) {
    return (
      <div className="min-h-screen bg-background">
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
          </div>
        </header>
        
        <div className="container px-4 py-8">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Product Not Found</h1>
            <p className="text-muted-foreground">
              The product you're looking for doesn't exist.
            </p>
            <Link href="/">
              <Button>Back to Menu</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const selectedSizeData = sizes.find((size) => size.id === selectedSize)
  const selectedToppingsData = selectedToppings.map(toppingId => 
    toppings.find((topping) => topping.id === toppingId)
  ).filter(Boolean)

  const calculatePrice = () => {
    const basePrice = product.basePrice
    const sizePrice = selectedSizeData?.price || 0
    const toppingsPrice = selectedToppingsData.reduce((total, topping) => total + (topping?.price || 0), 0)
    return (basePrice + sizePrice + toppingsPrice) * quantity
  }

  const handleToppingChange = (toppingId: string, checked: boolean) => {
    if (checked) {
      setSelectedToppings(prev => [...prev, toppingId])
    } else {
      setSelectedToppings(prev => prev.filter(id => id !== toppingId))
    }
  }

  const handleAddToCart = () => {
    const cartItem = {
      id: Date.now(),
      name: product.name,
      category: product.category as "pizza" | "drink",
      type: product.type as "vegetarian" | "non-vegetarian" | "beverage",
      size: selectedSizeData?.name || "Regular",
      toppings: selectedToppingsData.map(t => t?.name || "").filter(Boolean),
      price: calculatePrice() / quantity, // Price per item
      quantity: quantity,
      image: product.image,
      basePrice: product.basePrice,
    }

    addItem(cartItem)
    notifications.success(`${product.name} added to cart!`, "Added to Cart")
  }

  const isPizza = product.category === 'pizza'

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
                src={product.image || "https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg"}
                alt={product.name}
                width={400}
                height={400}
                className="w-full rounded-lg object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg"
                }}
              />
              <Badge className={`absolute top-4 right-4 ${
                product.type === "vegetarian" ? "bg-green-500" : product.type === "beverage" ? "bg-blue-500" : "bg-red-500"
              }`}>
                {product.type === "vegetarian" ? "Veg" : product.type === "beverage" ? "Drink" : "Non-Veg"}
              </Badge>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-muted-foreground text-lg">{product.description}</p>
              <div className="mt-4">
                <span className="text-2xl font-bold text-green-600">
                  ${calculatePrice().toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground ml-2">
                  (Base: ${product.basePrice})
                </span>
              </div>
            </div>

            {/* Size Selection - Only show for pizzas */}
            {isPizza && (
              <Card>
                <CardHeader>
                  <CardTitle>Choose Size</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                    {sizes.map((size) => (
                      <div key={size.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={size.id} id={size.id} />
                        <Label htmlFor={size.id} className="flex-1 cursor-pointer">
                          <div className="flex justify-between">
                            <span>{size.name}</span>
                            <span>{size.price > 0 ? `+$${size.price}` : "Free"}</span>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            )}

            {/* Toppings Selection - Only show for pizzas */}
            {isPizza && (
              <Card>
                <CardHeader>
                  <CardTitle>Extra Toppings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {toppings.map((topping) => (
                      <div key={topping.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={topping.id}
                          checked={selectedToppings.includes(topping.id)}
                          onCheckedChange={(checked) => handleToppingChange(topping.id, checked as boolean)}
                        />
                        <Label htmlFor={topping.id} className="flex-1 cursor-pointer">
                          <div className="flex justify-between">
                            <span>{topping.name}</span>
                            <span>+${topping.price}</span>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quantity Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Quantity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              className="w-full bg-red-600 hover:bg-red-700"
              size="lg"
              disabled={!product.available}
            >
              {product.available ? (
                <>Add to Cart - ${calculatePrice().toFixed(2)}</>
              ) : (
                "Currently Unavailable"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
