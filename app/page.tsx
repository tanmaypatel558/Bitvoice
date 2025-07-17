"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Plus, ShoppingCart, Star, Clock, MapPin, Phone, Mail, ChefHat } from "lucide-react"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCartStore } from "@/lib/store"
import { toast } from "sonner"
import { useNotifications } from "@/components/providers/notification-provider"

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [pizzas, setPizzas] = useState<any[]>([])
  const [drinks, setDrinks] = useState<any[]>([])
  const [showStoreInfo, setShowStoreInfo] = useState(false)
  const { addItem, items } = useCartStore()
  const cartItems = items.reduce((total, item) => total + item.quantity, 0)
  const notifications = useNotifications()

  useEffect(() => {
    fetchProducts()
    // Trigger store info slide-in animation after a short delay
    const timer = setTimeout(() => {
      setShowStoreInfo(true)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const fetchProducts = async () => {
    try {
      const [pizzaResponse, drinkResponse] = await Promise.all([
        fetch("/api/products?category=pizza&available=true"),
        fetch("/api/products?category=drink&available=true"),
      ])

      const pizzaData = await pizzaResponse.json()
      const drinkData = await drinkResponse.json()

      console.log("Homepage - Loaded pizzas:", pizzaData.length, "drinks:", drinkData.length)
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
      size: "Regular",
      toppings: [] as string[],
      price: drink.basePrice,
      quantity: 1,
      image: drink.image,
      basePrice: drink.basePrice,
    }

    addItem(cartItem)
    notifications.success(`${drink.name} added to cart!`, "Item Added")
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
                  <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 text-xs font-bold bg-gradient-to-br from-red-500 to-orange-500 text-white border-2 border-white shadow-lg hover:scale-110 transition-transform duration-200">{cartItems}</Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Store Info Section */}
      <section className={`bg-gradient-to-r from-orange-50 to-red-50 border-b transition-all duration-1000 ease-out ${
        showStoreInfo ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'
      }`}>
        <div className="container px-4 py-6">
          {/* Photo Gallery */}
          <div className={`mb-6 transition-all duration-700 ${
            showStoreInfo ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
          }`} style={{ transitionDelay: '100ms' }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="relative h-24 md:h-32 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300">
                <ImageWithFallback
                  src="/uploads/1752759191596-pexels-brettjordan-825661.jpg"
                  alt="Pizza Restaurant Interior"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors duration-300"></div>
              </div>
              <div className="relative h-24 md:h-32 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300">
                <ImageWithFallback
                  src="/uploads/1752759155414-top-view-pizzas-cement-background.jpg"
                  alt="Fresh Pizzas"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors duration-300"></div>
              </div>
              <div className="relative h-24 md:h-32 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300">
                <ImageWithFallback
                  src="/uploads/1752759183832-crispy-mixed-pizza-with-olives-sausage.jpg"
                  alt="Delicious Pizza"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors duration-300"></div>
              </div>
              <div className="relative h-24 md:h-32 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300">
                <ImageWithFallback
                  src="/uploads/1752756719978-pexels-donaldtong94-39720.jpg"
                  alt="Restaurant Ambiance"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors duration-300"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Location */}
            <div className={`relative overflow-hidden rounded-lg bg-white/70 backdrop-blur-sm border border-white/50 shadow-sm hover:shadow-md transition-all duration-500 ${
              showStoreInfo ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-8'
            }`} style={{ transitionDelay: '200ms' }}>
              <div className="absolute inset-0 opacity-10">
                <ImageWithFallback
                  src="/uploads/1752759191596-pexels-brettjordan-825661.jpg"
                  alt="Location Background"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative flex items-start space-x-3 p-4">
                <div className="bg-red-100 p-2 rounded-full">
                  <MapPin className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Location</h3>
                  <p className="text-sm text-gray-600">123 Pizza Street</p>
                  <p className="text-sm text-gray-600">New York, NY 10001</p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className={`relative overflow-hidden rounded-lg bg-white/70 backdrop-blur-sm border border-white/50 shadow-sm hover:shadow-md transition-all duration-500 ${
              showStoreInfo ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-8'
            }`} style={{ transitionDelay: '400ms' }}>
              <div className="absolute inset-0 opacity-10">
                <ImageWithFallback
                  src="/uploads/1752759155414-top-view-pizzas-cement-background.jpg"
                  alt="Hours Background"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative flex items-start space-x-3 p-4">
                <div className="bg-orange-100 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Hours</h3>
                  <p className="text-sm text-gray-600">Mon-Thu: 11AM - 10PM</p>
                  <p className="text-sm text-gray-600">Fri-Sat: 11AM - 11PM</p>
                  <p className="text-sm text-gray-600">Sun: 12PM - 9PM</p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className={`relative overflow-hidden rounded-lg bg-white/70 backdrop-blur-sm border border-white/50 shadow-sm hover:shadow-md transition-all duration-500 ${
              showStoreInfo ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-8'
            }`} style={{ transitionDelay: '600ms' }}>
              <div className="absolute inset-0 opacity-10">
                <ImageWithFallback
                  src="/uploads/1752759183832-crispy-mixed-pizza-with-olives-sausage.jpg"
                  alt="Contact Background"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative flex items-start space-x-3 p-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Contact</h3>
                  <p className="text-sm text-gray-600">📞 (555) 123-PIZZA</p>
                  <p className="text-sm text-gray-600">✉️ info@pizzashop.com</p>
                  <p className="text-sm text-gray-600">🚚 Free delivery over $25</p>
                </div>
              </div>
            </div>
          </div>

          {/* Special Features */}
          <div className={`mt-6 pt-4 border-t border-orange-200 transition-all duration-700 ${
            showStoreInfo ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
          }`} style={{ transitionDelay: '800ms' }}>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
                <ChefHat className="h-4 w-4 text-red-600" />
                <span className="text-gray-700">Fresh ingredients daily</span>
              </div>
              <div className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-gray-700">4.8/5 customer rating</span>
              </div>
              <div className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-gray-700">30-minute delivery guarantee</span>
              </div>
              <div className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
                <MapPin className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">5-mile delivery radius</span>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                        <ImageWithFallback
                          src={pizza.image || "/placeholder.svg"}
                          alt={pizza.name}
                          width={200}
                          height={200}
                          className="w-full h-48 object-cover"
                        />
                        <Badge className={`absolute top-2 right-2 ${pizza.type === "vegetarian" ? "bg-green-500" : "bg-red-500"}`}>
                          {pizza.type === "vegetarian" ? "Veg" : "Non-Veg"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="text-lg mb-2">{pizza.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mb-3">{pizza.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>4.5</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>25-30 min</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex items-center justify-between">
                      <span className="text-xl font-bold">${pizza.basePrice}</span>
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
                      <ImageWithFallback
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
                      <Badge variant="outline">Regular</Badge>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex items-center justify-between">
                      <span className="text-xl font-bold">${drink.basePrice}</span>
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
