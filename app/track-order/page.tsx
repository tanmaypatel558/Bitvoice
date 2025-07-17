"use client"

import { useState } from "react"
import { 
  Search, 
  Clock, 
  ChefHat, 
  Package, 
  Truck, 
  CheckCircle,
  MapPin,
  Phone,
  User,
  Receipt,
  AlertCircle
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Order {
  id: string
  customerName: string
  customerPhone: string
  customerAddress: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  total: number
  status: "pending" | "confirmed" | "preparing" | "ready" | "out_for_delivery" | "delivered"
  createdAt: string
  estimatedDelivery: string
  actualDelivery?: string
}

const orderStatuses = [
  { 
    key: "pending", 
    label: "Order Received", 
    description: "We've received your order and are processing it",
    icon: Clock, 
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    progress: 10
  },
  { 
    key: "confirmed", 
    label: "Order Confirmed", 
    description: "Your order has been confirmed and is being prepared",
    icon: CheckCircle, 
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    progress: 25
  },
  { 
    key: "preparing", 
    label: "In the Oven", 
    description: "Your delicious pizza is being prepared by our chefs",
    icon: ChefHat, 
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    progress: 50
  },
  { 
    key: "ready", 
    label: "Ready for Pickup/Delivery", 
    description: "Your order is ready and will be delivered soon",
    icon: Package, 
    color: "text-green-600",
    bgColor: "bg-green-100",
    progress: 75
  },
  { 
    key: "out_for_delivery", 
    label: "Out for Delivery", 
    description: "Your order is on the way to your location",
    icon: Truck, 
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    progress: 90
  },
  { 
    key: "delivered", 
    label: "Delivered", 
    description: "Your order has been delivered. Enjoy your meal!",
    icon: CheckCircle, 
    color: "text-green-600",
    bgColor: "bg-green-100",
    progress: 100
  }
]

// Mock order data
const mockOrders: { [key: string]: Order } = {
  "ORD-001": {
    id: "ORD-001",
    customerName: "John Doe",
    customerPhone: "+1 (555) 123-4567",
    customerAddress: "123 Main St, New York, NY 10001",
    items: [
      { name: "Margherita Pizza", quantity: 2, price: 12.99 },
      { name: "Pepperoni Pizza", quantity: 1, price: 15.99 },
      { name: "Coke", quantity: 2, price: 2.99 }
    ],
    total: 47.95,
    status: "preparing",
    createdAt: "2024-01-15T10:30:00Z",
    estimatedDelivery: "2024-01-15T11:15:00Z",
  },
  "ORD-002": {
    id: "ORD-002",
    customerName: "Sarah Smith",
    customerPhone: "+1 (555) 987-6543",
    customerAddress: "456 Oak Ave, New York, NY 10002",
    items: [
      { name: "Supreme Pizza", quantity: 1, price: 18.99 },
      { name: "Sprite", quantity: 2, price: 2.99 }
    ],
    total: 24.97,
    status: "out_for_delivery",
    createdAt: "2024-01-15T10:45:00Z",
    estimatedDelivery: "2024-01-15T11:30:00Z",
  }
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("")
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleTrackOrder = async () => {
    if (!orderId.trim()) {
      setError("Please enter an order ID")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const foundOrder = mockOrders[orderId.toUpperCase()]
      
      if (foundOrder) {
        setOrder(foundOrder)
      } else {
        setError("Order not found. Please check your order ID and try again.")
        setOrder(null)
      }
    } catch (err) {
      setError("Failed to track order. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusInfo = (status: Order["status"]) => {
    return orderStatuses.find(s => s.key === status) || orderStatuses[0]
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`
    }
  }

  const getEstimatedTime = (estimatedDelivery: string) => {
    const eta = new Date(estimatedDelivery)
    const now = new Date()
    const diffInMinutes = Math.floor((eta.getTime() - now.getTime()) / (1000 * 60))
    
    if (diffInMinutes > 0) {
      return `${diffInMinutes} minutes`
    } else {
      return "Any moment now"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Order</h1>
          <p className="text-lg text-gray-600">Enter your order ID to see real-time updates</p>
        </div>

        {/* Order ID Input */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="order-id" className="text-base font-medium mb-2 block">
                  Order ID
                </Label>
                <Input
                  id="order-id"
                  placeholder="Enter your order ID (e.g., ORD-001)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleTrackOrder}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-red-500 to-orange-500 px-8 py-2 text-lg"
                >
                  <Search className="w-5 h-5 mr-2" />
                  {isLoading ? "Tracking..." : "Track Order"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Alert className="mb-8 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Order Details */}
        {order && (
          <div className="space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order Status</span>
                  <Badge className={`${getStatusInfo(order.status).bgColor} ${getStatusInfo(order.status).color}`}>
                    {getStatusInfo(order.status).label}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{getStatusInfo(order.status).progress}%</span>
                    </div>
                    <Progress value={getStatusInfo(order.status).progress} className="h-2" />
                  </div>

                  {/* Status Timeline */}
                  <div className="space-y-4">
                    {orderStatuses.map((status, index) => {
                      const isCompleted = status.progress <= getStatusInfo(order.status).progress
                      const isActive = status.key === order.status
                      
                      return (
                        <div key={status.key} className="flex items-start space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                            isCompleted 
                              ? 'bg-green-500 border-green-500 text-white' 
                              : isActive 
                                ? 'bg-blue-500 border-blue-500 text-white'
                                : 'bg-gray-100 border-gray-300 text-gray-400'
                          }`}>
                            <status.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h3 className={`font-medium ${
                                isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                              }`}>
                                {status.label}
                              </h3>
                              {isActive && (
                                <Badge variant="secondary" className="animate-pulse">
                                  Current
                                </Badge>
                              )}
                            </div>
                            <p className={`text-sm mt-1 ${
                              isActive ? 'text-gray-700' : 'text-gray-500'
                            }`}>
                              {status.description}
                            </p>
                          </div>
                          {isCompleted && (
                            <CheckCircle className="w-5 h-5 text-green-500 mt-2" />
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Estimated Delivery */}
                  {order.status !== "delivered" && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-blue-900">Estimated Delivery</p>
                          <p className="text-sm text-blue-700">
                            {getEstimatedTime(order.estimatedDelivery)} remaining
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Customer Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-gray-500">Customer</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium">{order.customerPhone}</p>
                      <p className="text-sm text-gray-500">Phone Number</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                    <div>
                      <p className="font-medium">{order.customerAddress}</p>
                      <p className="text-sm text-gray-500">Delivery Address</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Receipt className="w-5 h-5" />
                    <span>Order Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium">Order ID: {order.id}</p>
                    <p className="text-sm text-gray-500">
                      Placed {getTimeAgo(order.createdAt)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-sm font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-medium">Call Us</p>
                      <p className="text-sm text-gray-600">(555) 123-PIZZA</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-medium">Visit Us</p>
                      <p className="text-sm text-gray-600">123 Pizza Street, NY</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sample Order IDs */}
        {!order && !error && (
          <Card>
            <CardHeader>
              <CardTitle>Try These Sample Order IDs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-900">ORD-001</p>
                  <p className="text-sm text-blue-700">Order in preparation</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="font-medium text-purple-900">ORD-002</p>
                  <p className="text-sm text-purple-700">Out for delivery</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 