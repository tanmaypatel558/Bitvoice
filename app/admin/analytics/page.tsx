"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import type { Order, Product } from "@/lib/types"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Users, 
  Clock, 
  Star, 
  PieChart,
  BarChart3,
  Calendar,
  ShoppingCart
} from "lucide-react"

interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  topProducts: { name: string; sales: number; revenue: number }[]
  ordersByStatus: { status: string; count: number; percentage: number }[]
  revenueByCategory: { category: string; revenue: number; percentage: number }[]
  orderTrends: { date: string; orders: number; revenue: number }[]
  customerMetrics: {
    totalCustomers: number
    repeatCustomers: number
    averageOrdersPerCustomer: number
  }
}

export default function AdminAnalyticsPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState("7days")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (orders.length > 0 && products.length > 0) {
      calculateAnalytics()
    }
  }, [orders, products, timeRange])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [ordersResponse, productsResponse] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/products")
      ])
      
      const ordersData = await ordersResponse.json()
      const productsData = await productsResponse.json()
      
      setOrders(ordersData)
      setProducts(productsData)
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateAnalytics = () => {
    // Filter orders by time range
    const now = new Date()
    const daysAgo = timeRange === "7days" ? 7 : timeRange === "30days" ? 30 : 90
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    
    const filteredOrders = orders.filter(order => 
      new Date(order.createdAt) >= cutoffDate
    )

    // Calculate basic metrics
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0)
    const totalOrders = filteredOrders.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Calculate top products
    const productSales: { [key: string]: { sales: number; revenue: number } } = {}
    
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.name]) {
          productSales[item.name] = { sales: 0, revenue: 0 }
        }
        productSales[item.name].sales += item.quantity
        productSales[item.name].revenue += item.price * item.quantity
      })
    })

    const topProducts = Object.entries(productSales)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Calculate orders by status
    const statusCounts: { [key: string]: number } = {}
    filteredOrders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1
    })

    const ordersByStatus = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: (count / totalOrders) * 100
    }))

    // Calculate revenue by category
    const categoryRevenue: { [key: string]: number } = {}
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        const category = item.category || 'other'
        categoryRevenue[category] = (categoryRevenue[category] || 0) + (item.price * item.quantity)
      })
    })

    const revenueByCategory = Object.entries(categoryRevenue).map(([category, revenue]) => ({
      category,
      revenue,
      percentage: (revenue / totalRevenue) * 100
    }))

    // Calculate order trends (last 7 days)
    const orderTrends = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)
      
      const dayOrders = filteredOrders.filter(order => {
        const orderDate = new Date(order.createdAt)
        return orderDate >= dayStart && orderDate < dayEnd
      })
      
      orderTrends.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, order) => sum + order.total, 0)
      })
    }

    // Calculate customer metrics
    const customerIds = new Set(filteredOrders.map(order => order.customerId))
    const customerOrders: { [key: string]: number } = {}
    
    filteredOrders.forEach(order => {
      customerOrders[order.customerId] = (customerOrders[order.customerId] || 0) + 1
    })

    const repeatCustomers = Object.values(customerOrders).filter(count => count > 1).length
    const averageOrdersPerCustomer = totalOrders / customerIds.size

    setAnalytics({
      totalRevenue,
      totalOrders,
      averageOrderValue,
      topProducts,
      ordersByStatus,
      revenueByCategory,
      orderTrends,
      customerMetrics: {
        totalCustomers: customerIds.size,
        repeatCustomers,
        averageOrdersPerCustomer
      }
    })
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No analytics data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Calendar className="h-4 w-4 mr-2" />
              {timeRange === "7days" ? "7 Days" : timeRange === "30days" ? "30 Days" : "90 Days"}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${analytics.totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                    +12.5% from last period
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                    +8.2% from last period
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${analytics.averageOrderValue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                    +3.8% from last period
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.customerMetrics.totalCustomers}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                    +15.3% from last period
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.ordersByStatus.map((item) => (
                      <div key={item.status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`} />
                          <span className="capitalize text-sm">{item.status.replace("-", " ")}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={item.percentage} className="w-20" />
                          <span className="text-sm font-medium">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Revenue by Category */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.revenueByCategory.map((item) => (
                      <div key={item.category} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${item.category === 'pizza' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                          <span className="capitalize text-sm">{item.category}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={item.percentage} className="w-20" />
                          <span className="text-sm font-medium">${item.revenue.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Order Trends (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {analytics.orderTrends.map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xs text-muted-foreground mb-2">{day.date}</div>
                      <div className="bg-primary/10 rounded-lg p-2">
                        <div className="text-sm font-medium">{day.orders}</div>
                        <div className="text-xs text-muted-foreground">orders</div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        ${day.revenue.toFixed(0)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Sales</span>
                      <span className="font-bold">${analytics.totalRevenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Order Value</span>
                      <span className="font-bold">${analytics.averageOrderValue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Orders</span>
                      <span className="font-bold">{analytics.totalOrders}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sales Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Revenue Growth</span>
                      <Badge className="bg-green-500">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +12.5%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Order Growth</span>
                      <Badge className="bg-green-500">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +8.2%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Customer Growth</span>
                      <Badge className="bg-green-500">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +15.3%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topProducts.map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${product.revenue.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.customerMetrics.totalCustomers}</div>
                  <p className="text-xs text-muted-foreground">Unique customers</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Repeat Customers</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.customerMetrics.repeatCustomers}</div>
                  <p className="text-xs text-muted-foreground">
                    {((analytics.customerMetrics.repeatCustomers / analytics.customerMetrics.totalCustomers) * 100).toFixed(1)}% of total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Orders/Customer</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.customerMetrics.averageOrdersPerCustomer.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground">Orders per customer</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 