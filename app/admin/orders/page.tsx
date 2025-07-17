"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import type { Order } from "@/lib/types"
import { Search, Eye, Clock, Package, Truck, CheckCircle, XCircle, Phone, MapPin } from "lucide-react"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/orders")
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    // Filter by search term (customer name, phone, or order ID)
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerPhone.includes(searchTerm) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }

  const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        fetchOrders()
        // Update selected order if it's the one being updated
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status } : null)
        }
      }
    } catch (error) {
      console.error("Failed to update order:", error)
    }
  }

  const getStatusColor = (status: Order["status"]) => {
    const colors = {
      pending: "bg-yellow-500",
      confirmed: "bg-blue-500",
      preparing: "bg-orange-500",
      baking: "bg-purple-500",
      "out-for-delivery": "bg-indigo-500",
      delivered: "bg-green-500",
      cancelled: "bg-red-500",
    }
    return colors[status] || "bg-gray-500"
  }

  const getStatusIcon = (status: Order["status"]) => {
    const icons = {
      pending: Clock,
      confirmed: CheckCircle,
      preparing: Package,
      baking: Package,
      "out-for-delivery": Truck,
      delivered: CheckCircle,
      cancelled: XCircle,
    }
    const Icon = icons[status] || Clock
    return <Icon className="h-4 w-4" />
  }

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === "pending").length,
    preparingOrders: orders.filter(o => ["confirmed", "preparing", "baking"].includes(o.status)).length,
    deliveredOrders: orders.filter(o => o.status === "delivered").length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Order Management</h1>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {orders.length} Total Orders
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Preparing</CardTitle>
              <Package className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.preparingOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.deliveredOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Orders</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by customer name, phone, or order ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <Label htmlFor="status">Filter by Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="baking">Baking</SelectItem>
                    <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No orders found</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold">Order #{order.id}</h3>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {order.customerName} • {order.customerPhone}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {order.deliveryAddress}
                          </p>
                        </div>
                        <Badge className={`${getStatusColor(order.status)} text-white`}>
                          <span className="flex items-center space-x-1">
                            {getStatusIcon(order.status)}
                            <span>{order.status.replace("-", " ").toUpperCase()}</span>
                          </span>
                        </Badge>
                      </div>
                      <div className="mt-2 flex items-center space-x-4 text-sm">
                        <span>{order.items.length} items</span>
                        <span className="font-medium">${order.total.toFixed(2)}</span>
                        <span className="text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatus(order.id, value as Order["status"])}
                        disabled={order.status === "delivered" || order.status === "cancelled"}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="preparing">Preparing</SelectItem>
                          <SelectItem value="baking">Baking</SelectItem>
                          <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Order Details #{order.id}</DialogTitle>
                          </DialogHeader>
                          {selectedOrder && (
                            <div className="space-y-6">
                              {/* Customer Info */}
                              <div>
                                <h4 className="font-semibold mb-2">Customer Information</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <Label>Name</Label>
                                    <p>{selectedOrder.customerName}</p>
                                  </div>
                                  <div>
                                    <Label>Phone</Label>
                                    <p>{selectedOrder.customerPhone}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <Label>Delivery Address</Label>
                                    <p>{selectedOrder.deliveryAddress}</p>
                                  </div>
                                  {selectedOrder.notes && (
                                    <div className="col-span-2">
                                      <Label>Notes</Label>
                                      <p>{selectedOrder.notes}</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <Separator />

                              {/* Order Items */}
                              <div>
                                <h4 className="font-semibold mb-2">Order Items</h4>
                                <div className="space-y-2">
                                  {selectedOrder.items.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                                      <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                          {item.size && `Size: ${item.size}`}
                                          {item.toppings && item.toppings.length > 0 && ` • Toppings: ${item.toppings.join(", ")}`}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-medium">${item.price.toFixed(2)} x {item.quantity}</p>
                                        <p className="text-sm text-muted-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <Separator />

                              {/* Order Summary */}
                              <div>
                                <h4 className="font-semibold mb-2">Order Summary</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${(selectedOrder.total - 3.99 - (selectedOrder.total - 3.99) * 0.08).toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Delivery Fee</span>
                                    <span>$3.99</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Tax</span>
                                    <span>${((selectedOrder.total - 3.99) * 0.08).toFixed(2)}</span>
                                  </div>
                                  <Separator />
                                  <div className="flex justify-between font-semibold">
                                    <span>Total</span>
                                    <span>${selectedOrder.total.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-muted-foreground">
                                    <span>Payment Method</span>
                                    <span className="capitalize">{selectedOrder.paymentMethod}</span>
                                  </div>
                                </div>
                              </div>

                              <Separator />

                              {/* Order Status */}
                              <div>
                                <h4 className="font-semibold mb-2">Order Status</h4>
                                <div className="flex items-center space-x-2 mb-2">
                                  <Badge className={`${getStatusColor(selectedOrder.status)} text-white`}>
                                    <span className="flex items-center space-x-1">
                                      {getStatusIcon(selectedOrder.status)}
                                      <span>{selectedOrder.status.replace("-", " ").toUpperCase()}</span>
                                    </span>
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  <p>Order placed: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                  <p>Estimated delivery: {new Date(selectedOrder.estimatedDelivery).toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 