"use client"

import { useState, useEffect } from "react"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  Clock,
  Star,
  Target,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

// Mock data for analytics
const analyticsData = {
  overview: {
    totalRevenue: 15420.50,
    revenueChange: 12.5,
    totalOrders: 342,
    ordersChange: 8.2,
    avgOrderValue: 45.12,
    avgOrderChange: 5.8,
    customerCount: 156,
    customerChange: 15.3,
  },
  revenueByDay: [
    { day: "Mon", revenue: 1200, orders: 28 },
    { day: "Tue", revenue: 1800, orders: 42 },
    { day: "Wed", revenue: 1600, orders: 38 },
    { day: "Thu", revenue: 2200, orders: 52 },
    { day: "Fri", revenue: 2800, orders: 65 },
    { day: "Sat", revenue: 3200, orders: 78 },
    { day: "Sun", revenue: 2600, orders: 61 },
  ],
  topProducts: [
    { name: "Margherita Pizza", orders: 89, revenue: 1156.50, percentage: 26 },
    { name: "Pepperoni Pizza", orders: 76, revenue: 1214.50, percentage: 22 },
    { name: "Supreme Pizza", orders: 65, revenue: 1234.50, percentage: 19 },
    { name: "Veggie Pizza", orders: 54, revenue: 809.50, percentage: 16 },
    { name: "BBQ Chicken Pizza", orders: 43, revenue: 774.50, percentage: 12 },
    { name: "Hawaiian Pizza", orders: 32, revenue: 544.50, percentage: 9 },
  ],
  ordersByStatus: [
    { status: "Delivered", count: 245, percentage: 71.6 },
    { status: "Cancelled", count: 28, percentage: 8.2 },
    { status: "Pending", count: 35, percentage: 10.2 },
    { status: "Preparing", count: 34, percentage: 9.9 },
  ],
  peakHours: [
    { hour: "10:00", orders: 12 },
    { hour: "11:00", orders: 18 },
    { hour: "12:00", orders: 32 },
    { hour: "13:00", orders: 28 },
    { hour: "14:00", orders: 22 },
    { hour: "15:00", orders: 15 },
    { hour: "16:00", orders: 19 },
    { hour: "17:00", orders: 25 },
    { hour: "18:00", orders: 38 },
    { hour: "19:00", orders: 45 },
    { hour: "20:00", orders: 52 },
    { hour: "21:00", orders: 38 },
  ],
  customerMetrics: {
    newCustomers: 42,
    returningCustomers: 114,
    customerRetentionRate: 73.1,
    avgOrdersPerCustomer: 2.2,
  }
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")
  const [selectedTab, setSelectedTab] = useState("overview")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-600" : "text-red-600"
  }

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />
  }

  const StatCard = ({ title, value, change, icon: Icon, prefix = "" }) => (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{prefix}{value}</p>
            <div className={`flex items-center mt-1 ${getChangeColor(change)}`}>
              {getChangeIcon(change)}
              <span className="text-sm font-medium ml-1">
                {change >= 0 ? '+' : ''}{change}%
              </span>
            </div>
          </div>
          <div className="p-3 rounded-full bg-gradient-to-br from-red-500 to-orange-500">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track your business performance and insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Custom Range
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Revenue"
              value={formatCurrency(analyticsData.overview.totalRevenue)}
              change={analyticsData.overview.revenueChange}
              icon={DollarSign}
            />
            <StatCard
              title="Total Orders"
              value={analyticsData.overview.totalOrders.toLocaleString()}
              change={analyticsData.overview.ordersChange}
              icon={ShoppingCart}
            />
            <StatCard
              title="Avg Order Value"
              value={formatCurrency(analyticsData.overview.avgOrderValue)}
              change={analyticsData.overview.avgOrderChange}
              icon={Target}
            />
            <StatCard
              title="Customers"
              value={analyticsData.overview.customerCount.toLocaleString()}
              change={analyticsData.overview.customerChange}
              icon={Users}
            />
          </div>

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Revenue Trend</span>
                <Badge variant="secondary">Last 7 Days</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-end justify-between space-x-2">
                {analyticsData.revenueByDay.map((day, index) => (
                  <div key={day.day} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gray-200 rounded-t-lg relative overflow-hidden">
                      <div 
                        className="bg-gradient-to-t from-red-500 to-orange-500 rounded-t-lg transition-all duration-1000 ease-out"
                        style={{ 
                          height: `${(day.revenue / Math.max(...analyticsData.revenueByDay.map(d => d.revenue))) * 200}px`,
                          animationDelay: `${index * 100}ms`
                        }}
                      />
                    </div>
                    <div className="text-center mt-2">
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(day.revenue)}</p>
                      <p className="text-xs text-gray-500">{day.day}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Status Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.ordersByStatus.map((item) => (
                    <div key={item.status} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.status}</span>
                        <span className="text-sm text-gray-500">{item.count} orders</span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Peak Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between space-x-1">
                  {analyticsData.peakHours.map((hour, index) => (
                    <div key={hour.hour} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gray-200 rounded-t">
                        <div 
                          className="bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t transition-all duration-1000 ease-out"
                          style={{ 
                            height: `${(hour.orders / Math.max(...analyticsData.peakHours.map(h => h.orders))) * 150}px`,
                            animationDelay: `${index * 50}ms`
                          }}
                        />
                      </div>
                      <div className="text-center mt-1">
                        <p className="text-xs text-gray-500">{hour.hour}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          {/* Sales Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Daily Average</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(analyticsData.overview.totalRevenue / 7)}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-green-100">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Best Day</p>
                    <p className="text-2xl font-bold text-gray-900">Saturday</p>
                    <p className="text-sm text-green-600">
                      {formatCurrency(Math.max(...analyticsData.revenueByDay.map(d => d.revenue)))}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100">
                    <Star className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                    <p className="text-2xl font-bold text-gray-900">+12.5%</p>
                    <p className="text-sm text-green-600">vs last period</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Sales Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.revenueByDay.map((day, index) => (
                  <div key={day.day} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {day.day.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{day.day}</p>
                        <p className="text-sm text-gray-500">{day.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatCurrency(day.revenue)}</p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(day.revenue / day.orders)} avg
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(product.revenue)}</p>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full"
                            style={{ width: `${product.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500">{product.percentage}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Product Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Best Seller</p>
                    <p className="text-lg font-bold text-gray-900">Margherita Pizza</p>
                    <p className="text-sm text-green-600">89 orders</p>
                  </div>
                  <div className="p-3 rounded-full bg-yellow-100">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Most Profitable</p>
                    <p className="text-lg font-bold text-gray-900">Supreme Pizza</p>
                    <p className="text-sm text-green-600">{formatCurrency(1234.50)}</p>
                  </div>
                  <div className="p-3 rounded-full bg-green-100">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">28</p>
                    <p className="text-sm text-blue-600">6 categories</p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          {/* Customer Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">New Customers</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsData.customerMetrics.newCustomers}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-green-100">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Returning</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsData.customerMetrics.returningCustomers}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Retention Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsData.customerMetrics.customerRetentionRate}%
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Orders</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsData.customerMetrics.avgOrdersPerCustomer}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-orange-100">
                    <ShoppingCart className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Customer Loyalty</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">First Time</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: '27%' }} />
                        </div>
                        <span className="text-sm">27%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Repeat Customer</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '73%' }} />
                        </div>
                        <span className="text-sm">73%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Order Frequency</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Weekly</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }} />
                        </div>
                        <span className="text-sm">45%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Monthly</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '35%' }} />
                        </div>
                        <span className="text-sm">35%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Occasional</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '20%' }} />
                        </div>
                        <span className="text-sm">20%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 