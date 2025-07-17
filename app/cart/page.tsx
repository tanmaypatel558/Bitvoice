"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart, Filter, Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useCartStore } from "@/lib/store"

const toppings = [
  { id: "pepperoni", name: "Pepperoni", price: 2.5 },
  { id: "mushrooms", name: "Mushrooms", price: 1.5 },
  { id: "olives", name: "Black Olives", price: 1.5 },
  { id: "peppers", name: "Bell Peppers", price: 1.5 },
  { id: "onions", name: "Red Onions", price: 1.0 },
  { id: "cheese", name: "Extra Cheese", price: 2.0 },
]

const sizes = [
  { id: "small", name: 'Small (8")', price: 0 },
  { id: "medium", name: 'Medium (12")', price: 3 },
  { id: "large", name: 'Large (16")', price: 6 },
]

export default function CartPage() {
  const { items, updateQuantity, removeItem, updateItem, clearCart, getFilteredItems, getTotalPrice } = useCartStore()
  const [filter, setFilter] = useState("all")
  const [editingItem, setEditingItem] = useState<any>(null)
  const [selectedToppings, setSelectedToppings] = useState<string[]>([])
  const [selectedSize, setSelectedSize] = useState("")

  const filteredItems = getFilteredItems(filter)
  const subtotal = getTotalPrice()
  const deliveryFee = 3.99
  const tax = subtotal * 0.08
  const total = subtotal + deliveryFee + tax

  const handleEditItem = (item: any) => {
    setEditingItem(item)
    setSelectedToppings(item.toppings || [])
    setSelectedSize(item.size || "medium")
  }

  const handleSaveEdit = () => {
    if (!editingItem) return

    const sizePrice = sizes.find((s) => s.name === selectedSize)?.price || 0
    const toppingsPrice = selectedToppings.reduce((total, toppingId) => {
      const topping = toppings.find((t) => t.id === toppingId)
      return total + (topping?.price || 0)
    }, 0)

    const newPrice = editingItem.basePrice + sizePrice + toppingsPrice

    updateItem(editingItem.id, {
      size: selectedSize,
      toppings: selectedToppings,
      price: newPrice,
    })

    setEditingItem(null)
  }

  const getFilterBadgeColor = (filterType: string) => {
    switch (filterType) {
      case "veg":
        return "bg-green-500"
      case "non-veg":
        return "bg-red-500"
      case "drinks":
        return "bg-blue-500"
      case "pizza":
        return "bg-orange-500"
      case "combo":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
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
        </div>
      </header>

      <div className="container px-4 py-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Your Cart</h1>
            <span className="text-muted-foreground">({items.length} items)</span>
          </div>

          {/* Filter Section */}
          <div className="flex items-center space-x-4">
            <Filter className="h-4 w-4" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter items" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="veg">Veg Pizza</SelectItem>
                <SelectItem value="non-veg">Non-Veg Pizza</SelectItem>
                <SelectItem value="drinks">Cold Drinks</SelectItem>
                <SelectItem value="pizza">All Pizzas</SelectItem>
                <SelectItem value="combo">Combo Offers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["all", "veg", "non-veg", "drinks", "pizza", "combo"].map((filterType) => (
            <Badge
              key={filterType}
              variant={filter === filterType ? "default" : "outline"}
              className={`cursor-pointer ${filter === filterType ? getFilterBadgeColor(filterType) : ""}`}
              onClick={() => setFilter(filterType)}
            >
              {filterType === "all"
                ? "All Items"
                : filterType === "veg"
                  ? "Veg Pizza"
                  : filterType === "non-veg"
                    ? "Non-Veg Pizza"
                    : filterType === "drinks"
                      ? "Cold Drinks"
                      : filterType === "pizza"
                        ? "All Pizzas"
                        : "Combo Offers"}
              <span className="ml-1">({getFilteredItems(filterType).length})</span>
            </Badge>
          ))}
        </div>

        {filteredItems.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">
                {filter === "all" ? "Your cart is empty" : `No ${filter} items in cart`}
              </h2>
              <p className="text-muted-foreground mb-4">
                {filter === "all"
                  ? "Add some delicious pizzas to get started!"
                  : `Add some ${filter} items to your cart!`}
              </p>
              <Link href="/">
                <Button>Browse Menu</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {filteredItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{item.name}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge
                                className={
                                  item.type === "vegetarian"
                                    ? "bg-green-500"
                                    : item.type === "non-vegetarian"
                                      ? "bg-red-500"
                                      : "bg-blue-500"
                                }
                              >
                                {item.type === "vegetarian"
                                  ? "Veg"
                                  : item.type === "non-vegetarian"
                                    ? "Non-Veg"
                                    : "Beverage"}
                              </Badge>
                              <Badge variant="outline">{item.category}</Badge>
                            </div>
                            {item.size && <p className="text-sm text-muted-foreground mt-1">{item.size}</p>}
                            {item.toppings.length > 0 && (
                              <p className="text-sm text-muted-foreground">Toppings: {item.toppings.join(", ")}</p>
                            )}
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => handleEditItem(item)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit {item.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                {item.category === "pizza" && (
                                  <>
                                    <div>
                                      <Label>Size</Label>
                                      <Select value={selectedSize} onValueChange={setSelectedSize}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {sizes.map((size) => (
                                            <SelectItem key={size.id} value={size.name}>
                                              {size.name} {size.price > 0 && `(+$${size.price})`}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label>Toppings</Label>
                                      <div className="grid grid-cols-2 gap-2 mt-2">
                                        {toppings.map((topping) => (
                                          <div key={topping.id} className="flex items-center space-x-2">
                                            <Checkbox
                                              id={topping.id}
                                              checked={selectedToppings.includes(topping.id)}
                                              onCheckedChange={(checked) => {
                                                if (checked) {
                                                  setSelectedToppings([...selectedToppings, topping.id])
                                                } else {
                                                  setSelectedToppings(
                                                    selectedToppings.filter((id) => id !== topping.id),
                                                  )
                                                }
                                              }}
                                            />
                                            <Label htmlFor={topping.id} className="text-sm">
                                              {topping.name} (+${topping.price})
                                            </Label>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </>
                                )}
                                <Button onClick={handleSaveEdit} className="w-full">
                                  Save Changes
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({items.length} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <div className="space-y-2 pt-4">
                    <Link href="/checkout" className="block">
                      <Button className="w-full" size="lg" disabled={items.length === 0}>
                        Proceed to Checkout
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={clearCart}
                      disabled={items.length === 0}
                    >
                      Clear Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
