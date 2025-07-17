"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Plus, ShoppingCart, Star, Clock, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCartStore } from "@/lib/store"
import { toast } from "sonner"

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [pizzas, setPizzas] = useState<any[]>([])
  const [drinks, setDrinks] = useState<any[]>([])
  const { addItem, items } = useCartStore()
  const cartItems = items.length

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const [pizzaResponse, drinkResponse] = await Promise.all([
        fetch("/api/products?category=pizza&available=true"),
        fetch("/api/products?category=drink&available=true"),
      ])

      const pizzaData = await pizzaResponse.json()
      const drinkData = await drinkResponse.json()

      setPizzas(pizzaData)
      setDrinks(drinkData)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    }
  }

  const filteredPizzas = pizzas.filter((pizza) => pizza.name?.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleAddDrink = (drink: any) => {
    const cartItem = {
      id: Date.now(),
      name: drink.name,
      category: "drink" as const,
      type: "beverage" as const,
      size: drink.size || "Regular",
      toppings: [] as string[],
      price: drink.basePrice || drink.price,
      quantity: 1,
      image: drink.image,
      basePrice: drink.basePrice || drink.price,
    }

    addItem(cartItem)
    toast.success(`${drink.name} added to cart!`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-red-600">PizzaHub</h1>
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Downtown, New York</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/cart">
              <Button variant="outline" size="sm" className="relative bg-transparent">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
                {cartItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">{cartItems}</Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-12">
        <div className="container px-4">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold mb-4">Delicious Pizza Delivered Fast</h2>
            <p className="text-xl mb-6">Fresh ingredients, authentic flavors, delivered hot to your door</p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>30 min delivery</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 fill-current" />
                <span>4.5 rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="py-6 border-b">
        <div className="container px-4">
          <Input
            type="search"
            placeholder="Search for pizzas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
      </section>

      {/* Menu */}
      <section className="py-8">
        <div className="container px-4">
          <Tabs defaultValue="pizzas" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="pizzas">Pizzas</TabsTrigger>
              <TabsTrigger value="drinks">Cold Drinks</TabsTrigger>
            </TabsList>

            <TabsContent value="pizzas" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPizzas?.map((pizza) => (
                  <Card key={pizza.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="p-0">
                      <div className="relative">
                        <Image
                          src={pizza.image || "/placeholder.svg"}
                          alt={pizza.name}
                          width={200}
                          height={200}
                          className="w-full h-48 object-cover"
                        />
                        <Badge className="absolute top-2 right-2 bg-green-500">
                          {pizza.category === "vegetarian" ? "Veg" : "Non-Veg"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="text-lg mb-2">{pizza.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mb-3">{pizza.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>{pizza.rating}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{pizza.time}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex items-center justify-between">
                      <span className="text-xl font-bold">${pizza.price}</span>
                      <Link href={`/product/${pizza.id}`}>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="drinks" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {drinks?.map((drink) => (
                  <Card key={drink.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="p-0">
                      <Image
                        src={drink.image || "/placeholder.svg"}
                        alt={drink.name}
                        width={200}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="text-lg mb-2">{drink.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mb-2">{drink.description}</p>
                      <Badge variant="outline">{drink.size}</Badge>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex items-center justify-between">
                      <span className="text-xl font-bold">${drink.price}</span>
                      <Button size="sm" onClick={() => handleAddDrink(drink)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
