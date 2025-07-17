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

// Static stats template - values will be calculated from real data
const statsTemplate = [
  {
    title: "Today's Revenue",
    key: "revenue",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100",
    prefix: "$",
  },
  {
    title: "Total Orders",
    key: "orders",
    icon: ShoppingCart,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    prefix: "",
  },
  {
    title: "Active Orders",
    key: "activeOrders",
    icon: Package,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    prefix: "",
  },
  {
    title: "Completed Today",
    key: "completedToday",
    icon: CheckCircle,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    prefix: "",
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

interface Order {
  id: string
  customerName: string
  customerPhone: string
  items: Array<{
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
  }>
  total: number
  status: "pending" | "confirmed" | "preparing" | "baking" | "out-for-delivery" | "delivered" | "cancelled"
  createdAt: string
  estimatedDelivery: string
  paymentMethod: string
  deliveryAddress: string
  notes?: string
}

export default function AdminDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [allOrders, setAllOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch recent orders from API
  const fetchRecentOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/orders")
      if (!response.ok) {
        throw new Error("Failed to fetch orders")
      }
      const data = await response.json()
      setAllOrders(data)
      // Sort by creation date and take the most recent 4
      const sortedOrders = data.sort((a: Order, b: Order) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).slice(0, 4)
      setRecentOrders(sortedOrders)
    } catch (err) {
      console.error("Error fetching recent orders:", err)
    } finally {
      setLoading(false)
    }
  }

  // Calculate real stats from orders
  const calculateStats = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayOrders = allOrders.filter(order => {
      const orderDate = new Date(order.createdAt)
      orderDate.setHours(0, 0, 0, 0)
      return orderDate.getTime() === today.getTime()
    })
    
    const activeOrders = allOrders.filter(order => 
      !["delivered", "cancelled"].includes(order.status)
    )
    
    const completedToday = todayOrders.filter(order => 
      order.status === "delivered"
    )
    
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0)
    
    return {
      revenue: todayRevenue.toFixed(2),
      orders: allOrders.length.toString(),
      activeOrders: activeOrders.length.toString(),
      completedToday: completedToday.length.toString(),
    }
  }

  const stats = calculateStats()
  const statsWithTemplate = statsTemplate.map(template => ({
    ...template,
    value: stats[template.key as keyof typeof stats],
  }))

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const orderTime = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  // Format order items for display
  const formatOrderItems = (items: Order['items']) => {
    if (items.length === 0) return "No items"
    if (items.length === 1) {
      return `${items[0].quantity}x ${items[0].name}`
    }
    if (items.length === 2) {
      return `${items[0].quantity}x ${items[0].name}, ${items[1].quantity}x ${items[1].name}`
    }
    return `${items[0].quantity}x ${items[0].name}, +${items.length - 1} more`
  }

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Fetch orders on component mount
  useEffect(() => {
    fetchRecentOrders()
  }, [])

  // Auto-refresh orders every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchRecentOrders, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "preparing":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "baking":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "out-for-delivery":
        return "bg-indigo-100 text-indigo-800 border-indigo-200"
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-3 h-3" />
      case "confirmed":
        return <CheckCircle className="w-3 h-3" />
      case "preparing":
        return <ChefHat className="w-3 h-3" />
      case "baking":
        return <ChefHat className="w-3 h-3" />
      case "out-for-delivery":
        return <Truck className="w-3 h-3" />
      case "delivered":
        return <CheckCircle className="w-3 h-3" />
      case "cancelled":
        return <AlertCircle className="w-3 h-3" />
      default:
        return <Clock className="w-3 h-3" />
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
        {statsWithTemplate.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.prefix}{stat.value}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm font-medium text-green-600">
                      Live Data
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
              <Button variant="outline" size="sm" asChild>
                <a href="/admin/tracking">View All</a>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-pulse">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-32 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-40"></div>
                    </div>
                    <div className="text-right">
                      <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No recent orders</p>
                <p className="text-sm">Orders will appear here once customers place them</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">#{order.id}</span>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status.replace('-', ' ')}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                      <p className="text-sm text-gray-500">{formatOrderItems(order.items)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{formatTimeAgo(order.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Top Products</span>
              <Button variant="outline" size="sm" asChild>
                <a href="/admin/products">Manage</a>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                      <span className="text-sm font-semibold text-red-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{product.revenue}</p>
                    <div className="flex items-center space-x-1">
                      {product.trend === "up" ? (
                        <TrendingUp className="w-3 h-3 text-green-600" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-600" />
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
              <a href="/admin/tracking">
                <ShoppingCart className="w-6 h-6" />
                <span>Manage Orders</span>
              </a>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
              <a href="/admin/products">
                <Package className="w-6 h-6" />
                <span>Manage Products</span>
              </a>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
              <a href="/admin/analytics">
                <TrendingUp className="w-6 h-6" />
                <span>View Analytics</span>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 