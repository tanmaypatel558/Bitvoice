"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, CheckCircle, ChefHat, Truck, Package, Phone, MapPin, CreditCard, Calendar, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useNotifications } from "@/components/providers/notification-provider"

interface OrderItem {
  id: number
  name: string
  category: string
  type: string
  size: string
  toppings: string[]
  price: number
  quantity: number
  image: string
  basePrice: number
}

interface Order {
  id: string
  customerName: string
  customerPhone: string
  customerAddress: string
  items: OrderItem[]
  total: number
  status: "pending" | "confirmed" | "preparing" | "ready" | "out_for_delivery" | "delivered" | "cancelled"
  createdAt: string
  estimatedDelivery: string
  paymentMethod: string
  notes?: string
  deliveryAddress: string
}

const orderStatuses = [
  { 
    key: "pending", 
    label: "Order Received", 
    icon: Clock, 
    color: "bg-yellow-100 text-yellow-800",
    progress: 15,
    description: "Your order has been received and is being processed"
  },
  { 
    key: "confirmed", 
    label: "Order Confirmed", 
    icon: CheckCircle, 
    color: "bg-blue-100 text-blue-800",
    progress: 30,
    description: "Your order has been confirmed and is being prepared"
  },
  { 
    key: "preparing", 
    label: "In Kitchen", 
    icon: ChefHat, 
    color: "bg-orange-100 text-orange-800",
    progress: 60,
    description: "Your delicious food is being prepared with care"
  },
  { 
    key: "ready", 
    label: "Ready for Pickup", 
    icon: Package, 
    color: "bg-green-100 text-green-800",
    progress: 80,
    description: "Your order is ready and waiting for delivery"
  },
  { 
    key: "out_for_delivery", 
    label: "Out for Delivery", 
    icon: Truck, 
    color: "bg-purple-100 text-purple-800",
    progress: 95,
    description: "Your order is on its way to you"
  },
  { 
    key: "delivered", 
    label: "Delivered", 
    icon: CheckCircle, 
    color: "bg-green-100 text-green-800",
    progress: 100,
    description: "Your order has been delivered. Enjoy your meal!"
  },
  { 
    key: "cancelled", 
    label: "Cancelled", 
    icon: AlertCircle, 
    color: "bg-red-100 text-red-800",
    progress: 0,
    description: "Your order has been cancelled"
  },
]

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const { error } = useNotifications()

  const orderId = params.id as string

  // Fetch order details
  const fetchOrder = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders/${orderId}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Order not found")
        }
        throw new Error("Failed to fetch order")
      }
      const data = await response.json()
      setOrder(data)
    } catch (err) {
      console.error("Error fetching order:", err)
      error("Failed to load order details")
    } finally {
      setLoading(false)
    }
  }

  // Get current status info
  const getCurrentStatusInfo = () => {
    if (!order) return orderStatuses[0]
    return orderStatuses.find(s => s.key === order.status) || orderStatuses[0]
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  // Calculate estimated time remaining
  const getTimeRemaining = () => {
    if (!order) return null
    const now = new Date()
    const estimated = new Date(order.estimatedDelivery)
    const diff = estimated.getTime() - now.getTime()
    
    if (diff <= 0) return "Should arrive soon"
    
    const minutes = Math.floor(diff / (1000 * 60))
    if (minutes < 60) {
      return `${minutes} minutes`
    } else {
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      return `${hours}h ${remainingMinutes}m`
    }
  }

  // Load order on component mount
  useEffect(() => {
    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchOrder, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
          <div className="container flex h-16 items-center justify-between px-4">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-red-600">PizzaHub</h1>
            </div>
          </div>
        </header>
        
        <div className="container px-4 py-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading order details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
          <div className="container flex h-16 items-center justify-between px-4">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-red-600">PizzaHub</h1>
            </div>
          </div>
        </header>
        
        <div className="container px-4 py-8 max-w-4xl mx-auto">
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The order you're looking for doesn't exist or may have been removed.
            </p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const currentStatus = getCurrentStatusInfo()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-red-600">PizzaHub</h1>
          </div>
          <Link href="/track-order">
            <Button variant="outline" size="sm">
              Track Another Order
            </Button>
          </Link>
        </div>
      </header>

      <div className="container px-4 py-8 max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Order Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Order #{order.id}</h1>
            <p className="text-muted-foreground">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <currentStatus.icon className="h-5 w-5 mr-2" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={`${currentStatus.color} text-lg px-4 py-2`}>
                  {currentStatus.label}
                </Badge>
                {order.status !== "delivered" && order.status !== "cancelled" && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Estimated time remaining</p>
                    <p className="font-semibold">{getTimeRemaining()}</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Progress value={currentStatus.progress} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  {currentStatus.description}
                </p>
              </div>

              {/* Status Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {orderStatuses
                  .filter(status => status.key !== "cancelled")
                  .map((status) => {
                    const isCompleted = status.progress <= currentStatus.progress
                    const isCurrent = status.key === order.status
                    
                    return (
                      <div
                        key={status.key}
                        className={`flex items-center space-x-3 p-3 rounded-lg ${
                          isCurrent 
                            ? "bg-blue-50 border-2 border-blue-200" 
                            : isCompleted 
                              ? "bg-green-50 border border-green-200" 
                              : "bg-gray-50 border border-gray-200"
                        }`}
                      >
                        <div className={`p-2 rounded-full ${
                          isCurrent 
                            ? "bg-blue-500 text-white" 
                            : isCompleted 
                              ? "bg-green-500 text-white" 
                              : "bg-gray-300 text-gray-500"
                        }`}>
                          <status.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${
                            isCurrent ? "text-blue-700" : isCompleted ? "text-green-700" : "text-gray-500"
                          }`}>
                            {status.label}
                          </p>
                        </div>
                        {isCompleted && !isCurrent && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.size}
                        {item.toppings.length > 0 && ` • ${item.toppings.join(", ")}`}
                      </p>
                      <Badge variant="outline" className="mt-1">
                        {item.type === "vegetarian" ? "Veg" : item.type === "non-vegetarian" ? "Non-Veg" : "Beverage"}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{item.quantity}x ${item.price.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Order Information */}
            <Card>
              <CardHeader>
                <CardTitle>Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Customer</p>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm">{order.customerPhone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Delivery Address</p>
                      <p className="font-medium">{order.deliveryAddress}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Method</p>
                      <p className="font-medium">{order.paymentMethod}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                      <p className="font-medium">{formatDate(order.estimatedDelivery)}</p>
                    </div>
                  </div>
                </div>

                {order.notes && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Special Instructions</p>
                      <p className="text-sm bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                        {order.notes}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h3 className="font-semibold">Need Help?</h3>
                <p className="text-muted-foreground">
                  If you have any questions about your order, please contact us:
                </p>
                <div className="flex justify-center space-x-6">
                  <a href="tel:+1234567890" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                    <Phone className="h-4 w-4" />
                    <span>Call Us</span>
                  </a>
                  <Link href="/track-order" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                    <Package className="h-4 w-4" />
                    <span>Track Another Order</span>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
