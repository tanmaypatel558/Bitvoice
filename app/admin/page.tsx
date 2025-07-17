"use client"

import { useState, useEffect } from "react"
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  Package, 
  Users, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  ChefHat,
  Star
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const stats = [
  {
    title: "Today's Revenue",
    value: "$1,234",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Total Orders",
    value: "45",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Active Products",
    value: "28",
    change: "+2",
    trend: "up",
    icon: Package,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Total Customers",
    value: "1,234",
    change: "+5.1%",
    trend: "up",
    icon: Users,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
]

const recentOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    items: "2x Margherita, 1x Pepperoni",
    total: "$34.99",
    status: "preparing",
    time: "5 min ago",
  },
  {
    id: "ORD-002",
    customer: "Sarah Smith",
    items: "1x Supreme, 2x Coke",
    total: "$28.50",
    status: "ready",
    time: "12 min ago",
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    items: "3x Pepperoni, 1x Salad",
    total: "$45.75",
    status: "delivered",
    time: "25 min ago",
  },
  {
    id: "ORD-004",
    customer: "Emily Davis",
    items: "1x Veggie, 2x Sprite",
    total: "$22.30",
    status: "pending",
    time: "30 min ago",
  },
]

const topProducts = [
  {
    name: "Margherita Pizza",
    orders: 24,
    revenue: "$312.50",
    trend: "up",
  },
  {
    name: "Pepperoni Pizza",
    orders: 18,
    revenue: "$287.50",
    trend: "up",
  },
  {
    name: "Supreme Pizza",
    orders: 15,
    revenue: "$267.75",
    trend: "down",
  },
  {
    name: "Veggie Pizza",
    orders: 12,
    revenue: "$168.00",
    trend: "up",
  },
]

export default function AdminDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "preparing":
        return "bg-blue-100 text-blue-800"
      case "ready":
        return "bg-green-100 text-green-800"
      case "delivered":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-3 h-3" />
      case "preparing":
        return <ChefHat className="w-3 h-3" />
      case "ready":
        return <CheckCircle className="w-3 h-3" />
      case "delivered":
        return <Truck className="w-3 h-3" />
      default:
        return <AlertCircle className="w-3 h-3" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening at your store today.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Current Time</p>
          <p className="text-lg font-semibold text-gray-900">
            {currentTime.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-1">
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Orders</span>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900">{order.id}</span>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                    <p className="text-sm text-gray-500">{order.items}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{order.total}</p>
                    <p className="text-sm text-gray-500">{order.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Top Products Today</span>
              <Button variant="outline" size="sm">
                View Analytics
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{product.revenue}</p>
                    <div className="flex items-center">
                      {product.trend === "up" ? (
                        <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-600 mr-1" />
                      )}
                      <span className={`text-xs ${
                        product.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}>
                        {product.trend === "up" ? "↑" : "↓"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-20 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
              <div className="text-center">
                <Package className="w-6 h-6 mx-auto mb-2" />
                <span>Add Product</span>
              </div>
            </Button>
            <Button className="h-20 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
              <div className="text-center">
                <ShoppingCart className="w-6 h-6 mx-auto mb-2" />
                <span>View Orders</span>
              </div>
            </Button>
            <Button className="h-20 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <div className="text-center">
                <Users className="w-6 h-6 mx-auto mb-2" />
                <span>Customers</span>
              </div>
            </Button>
            <Button className="h-20 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
              <div className="text-center">
                <Star className="w-6 h-6 mx-auto mb-2" />
                <span>Analytics</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 