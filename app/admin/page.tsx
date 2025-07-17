"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Order, ComboOffer } from "@/lib/types"
import { Clock, DollarSign, Package, Users, Plus, Edit, Trash2 } from "lucide-react"

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [combos, setCombos] = useState<ComboOffer[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [newCombo, setNewCombo] = useState({
    name: "",
    description: "",
    originalPrice: 0,
    discountedPrice: 0,
    active: true,
  })

  useEffect(() => {
    fetchOrders()
    fetchCombos()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    }
  }

  const fetchCombos = async () => {
    try {
      const response = await fetch("/api/combos")
      const data = await response.json()
      setCombos(data)
    } catch (error) {
      console.error("Failed to fetch combos:", error)
    }
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
      }
    } catch (error) {
      console.error("Failed to update order:", error)
    }
  }

  const createCombo = async () => {
    try {
      const response = await fetch("/api/combos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCombo),
      })

      if (response.ok) {
        fetchCombos()
        setNewCombo({ name: "", description: "", originalPrice: 0, discountedPrice: 0, active: true })
      }
    } catch (error) {
      console.error("Failed to create combo:", error)
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

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === "pending").length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    avgOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length : 0,
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Badge variant="outline" className="text-lg px-4 py-2">
            PizzaHub Management
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.avgOrderValue.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Order Management</TabsTrigger>
            <TabsTrigger value="combos">Combo Offers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-semibold">Order #{order.id}</h3>
                            <p className="text-sm text-muted-foreground">{order.customerName}</p>
                            <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.replace("-", " ").toUpperCase()}
                          </Badge>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm">
                            {order.items.length} items • ${order.total.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Select
                          value={order.status}
                          onValueChange={(value) => updateOrderStatus(order.id, value as Order["status"])}
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
                        <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="combos" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Combo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="comboName">Combo Name</Label>
                    <Input
                      id="comboName"
                      value={newCombo.name}
                      onChange={(e) => setNewCombo({ ...newCombo, name: e.target.value })}
                      placeholder="Family Feast"
                    />
                  </div>
                  <div>
                    <Label htmlFor="comboDescription">Description</Label>
                    <Textarea
                      id="comboDescription"
                      value={newCombo.description}
                      onChange={(e) => setNewCombo({ ...newCombo, description: e.target.value })}
                      placeholder="2 Large Pizzas + 4 Cold Drinks"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="originalPrice">Original Price</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        value={newCombo.originalPrice}
                        onChange={(e) => setNewCombo({ ...newCombo, originalPrice: Number.parseFloat(e.target.value) })}
                        placeholder="45.99"
                      />
                    </div>
                    <div>
                      <Label htmlFor="discountedPrice">Discounted Price</Label>
                      <Input
                        id="discountedPrice"
                        type="number"
                        value={newCombo.discountedPrice}
                        onChange={(e) =>
                          setNewCombo({ ...newCombo, discountedPrice: Number.parseFloat(e.target.value) })
                        }
                        placeholder="35.99"
                      />
                    </div>
                  </div>
                  <Button onClick={createCombo} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Combo
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Combos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {combos.map((combo) => (
                      <div key={combo.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{combo.name}</h3>
                            <p className="text-sm text-muted-foreground">{combo.description}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-sm line-through text-muted-foreground">
                                ${combo.originalPrice.toFixed(2)}
                              </span>
                              <span className="text-lg font-bold text-green-600">
                                ${combo.discountedPrice.toFixed(2)}
                              </span>
                              <Badge variant="secondary">
                                {Math.round(
                                  ((combo.originalPrice - combo.discountedPrice) / combo.originalPrice) * 100,
                                )}
                                % OFF
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["pending", "confirmed", "preparing", "baking", "out-for-delivery", "delivered"].map((status) => {
                      const count = orders.filter((o) => o.status === status).length
                      const percentage = orders.length > 0 ? (count / orders.length) * 100 : 0
                      return (
                        <div key={status} className="flex items-center justify-between">
                          <span className="capitalize">{status.replace("-", " ")}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-muted rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getStatusColor(status as Order["status"])}`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{count}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center space-x-4">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(order.status)}`} />
                        <div className="flex-1">
                          <p className="text-sm">
                            Order #{order.id} - {order.customerName}
                          </p>
                          <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                        <Badge variant="outline">${order.total.toFixed(2)}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
