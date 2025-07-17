"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Clock, Truck, ChefHat, Package, Phone, MessageCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import type { Order } from "@/lib/types"

const orderStatuses = [
  { id: "pending", name: "Order Placed", icon: CheckCircle, description: "Your order has been received" },
  { id: "confirmed", name: "Confirmed", icon: CheckCircle, description: "Order confirmed by restaurant" },
  { id: "preparing", name: "Preparing", icon: ChefHat, description: "Chef is preparing your order" },
  { id: "baking", name: "Baking", icon: Package, description: "Your pizza is in the oven" },
  { id: "out-for-delivery", name: "Out for Delivery", icon: Truck, description: "Driver is on the way" },
  { id: "delivered", name: "Delivered", icon: CheckCircle, description: "Order delivered successfully" },
]

export default function LiveOrderTrackingPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrder()

    // Set up real-time updates (polling every 10 seconds)
    const interval = setInterval(fetchOrder, 10000)

    return () => clearInterval(interval)
  }, [params.id])

  useEffect(() => {
    if (order) {
      const statusIndex = orderStatuses.findIndex((s) => s.id === order.status)
      const newProgress = ((statusIndex + 1) / orderStatuses.length) * 100
      setProgress(newProgress)
    }
  }, [order])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`)
      if (response.ok) {
        const orderData = await response.json()
        setOrder(orderData)
      }
    } catch (error) {
      console.error("Failed to fetch order:", error)
    } finally {
      setLoading(false)
    }
  }

  const getEstimatedTime = () => {
    if (!order) return "N/A"

    const statusTimes = {
      pending: 5,
      confirmed: 10,
      preparing: 15,
      baking: 10,
      "out-for-delivery": 15,
      delivered: 0,
    }

    const currentStatusIndex = orderStatuses.findIndex((s) => s.id === order.status)
    const remainingTime = orderStatuses
      .slice(currentStatusIndex + 1)
      .reduce((total, status) => total + (statusTimes[status.id as keyof typeof statusTimes] || 0), 0)

    return remainingTime > 0 ? `${remainingTime} min` : "Delivered"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
            <p className="text-muted-foreground mb-4">The order you're looking for doesn't exist.</p>
            <Link href="/">
              <Button>Back to Menu</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
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
                Back to Menu
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-red-600">PizzaHub</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              {getEstimatedTime()} remaining
            </Badge>
          </div>
        </div>
      </header>

      <div className="container px-4 py-8 max-w-6xl mx-auto">
        {/* Order Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Order #{order.id}</h1>
              <p className="text-muted-foreground">
                Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
                {new Date(order.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Estimated Delivery</p>
              <p className="text-lg font-semibold">{new Date(order.estimatedDelivery).toLocaleTimeString()}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Live Order Tracking */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Live Order Status</span>
                  <Badge
                    className={
                      order.status === "delivered"
                        ? "bg-green-500"
                        : order.status === "cancelled"
                          ? "bg-red-500"
                          : "bg-blue-500"
                    }
                  >
                    {order.status.replace("-", " ").toUpperCase()}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>

                <div className="space-y-6">
                  {orderStatuses.map((status, index) => {
                    const Icon = status.icon
                    const isActive = status.id === order.status
                    const isCompleted = orderStatuses.findIndex((s) => s.id === order.status) > index
                    const isPending = orderStatuses.findIndex((s) => s.id === order.status) < index

                    return (
                      <div key={status.id} className="flex items-start space-x-4">
                        <div
                          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                            isCompleted
                              ? "bg-green-500 border-green-500 text-white"
                              : isActive
                                ? "bg-blue-500 border-blue-500 text-white animate-pulse"
                                : isPending
                                  ? "bg-muted border-muted-foreground/20 text-muted-foreground"
                                  : "bg-muted border-muted-foreground/20 text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3
                              className={`font-semibold ${
                                isCompleted ? "text-green-600" : isActive ? "text-blue-600" : "text-muted-foreground"
                              }`}
                            >
                              {status.name}
                            </h3>
                            {isActive && (
                              <Badge variant="secondary" className="animate-pulse">
                                In Progress
                              </Badge>
                            )}
                            {isCompleted && <Badge className="bg-green-500">Completed</Badge>}
                          </div>
                          <p className={`text-sm mt-1 ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                            {status.description}
                          </p>
                          {isActive && (
                            <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <p className="text-sm text-blue-800 font-medium">
                                🔥 Your order is currently being processed at this stage
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Delivery Address</h4>
                    <p className="text-muted-foreground">{order.deliveryAddress}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <p className="text-muted-foreground">{order.customerName}</p>
                    <p className="text-muted-foreground">{order.customerPhone}</p>
                  </div>
                </div>
                {order.notes && (
                  <div>
                    <h4 className="font-medium mb-2">Special Instructions</h4>
                    <p className="text-muted-foreground">{order.notes}</p>
                  </div>
                )}

                <div className="flex space-x-2 pt-4">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Restaurant
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        {item.size && <p className="text-sm text-muted-foreground">{item.size}</p>}
                        {item.toppings.length > 0 && (
                          <p className="text-sm text-muted-foreground">Toppings: {item.toppings.join(", ")}</p>
                        )}
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
                          <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-md text-sm font-semibold text-blue-800">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    {index < order.items.length - 1 && <Separator />}
                  </div>
                ))}

                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${(order.total - 3.99 - (order.total - 3.99) * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>$3.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${((order.total - 3.99) * 0.08).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Paid</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Payment Method</span>
                    <span className="capitalize">{order.paymentMethod}</span>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <Button variant="outline" className="w-full bg-transparent" disabled={order.status === "delivered"}>
                    Modify Order
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-red-600 hover:text-red-700 bg-transparent"
                    disabled={["out-for-delivery", "delivered"].includes(order.status)}
                  >
                    Cancel Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
