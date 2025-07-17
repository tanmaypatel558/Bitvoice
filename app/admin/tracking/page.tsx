"use client"

import { useState, useEffect } from "react"
import { 
  Clock, 
  ChefHat, 
  Truck, 
  CheckCircle, 
  AlertCircle,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Eye,
  Phone,
  MapPin,
  Package,
  Timer,
  User
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { useNotifications } from "@/components/providers/notification-provider"

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
  status: "pending" | "confirmed" | "preparing" | "ready" | "out_for_delivery" | "delivered" | "cancelled"
  createdAt: string
  estimatedDelivery: string
  paymentMethod: string
  notes?: string
}

const orderStatuses = [
  { 
    key: "pending", 
    label: "Pending", 
    icon: Clock, 
    color: "bg-yellow-100 text-yellow-800",
    progress: 10
  },
  { 
    key: "confirmed", 
    label: "Confirmed", 
    icon: CheckCircle, 
    color: "bg-blue-100 text-blue-800",
    progress: 25
  },
  { 
    key: "preparing", 
    label: "In Oven/Preparing", 
    icon: ChefHat, 
    color: "bg-orange-100 text-orange-800",
    progress: 50
  },
  { 
    key: "ready", 
    label: "Ready", 
    icon: Package, 
    color: "bg-green-100 text-green-800",
    progress: 75
  },
  { 
    key: "out_for_delivery", 
    label: "Out for Delivery", 
    icon: Truck, 
    color: "bg-purple-100 text-purple-800",
    progress: 90
  },
  { 
    key: "delivered", 
    label: "Delivered", 
    icon: CheckCircle, 
    color: "bg-green-100 text-green-800",
    progress: 100
  },
  { 
    key: "cancelled", 
    label: "Cancelled", 
    icon: AlertCircle, 
    color: "bg-red-100 text-red-800",
    progress: 0
  },
]

// Mock data - replace with actual API calls
const mockOrders: Order[] = [
  {
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
    paymentMethod: "Credit Card",
    notes: "Extra cheese on margherita"
  },
  {
    id: "ORD-002",
    customerName: "Sarah Smith",
    customerPhone: "+1 (555) 987-6543",
    customerAddress: "456 Oak Ave, New York, NY 10002",
    items: [
      { name: "Supreme Pizza", quantity: 1, price: 18.99 },
      { name: "Sprite", quantity: 2, price: 2.99 }
    ],
    total: 24.97,
    status: "ready",
    createdAt: "2024-01-15T10:45:00Z",
    estimatedDelivery: "2024-01-15T11:30:00Z",
    paymentMethod: "Cash",
  },
  {
    id: "ORD-003",
    customerName: "Mike Johnson",
    customerPhone: "+1 (555) 456-7890",
    customerAddress: "789 Pine St, New York, NY 10003",
    items: [
      { name: "Veggie Pizza", quantity: 1, price: 14.99 },
      { name: "Pepsi", quantity: 1, price: 2.99 }
    ],
    total: 17.98,
    status: "out_for_delivery",
    createdAt: "2024-01-15T09:15:00Z",
    estimatedDelivery: "2024-01-15T10:00:00Z",
    paymentMethod: "Online Payment",
  },
]

export default function OrderTrackingPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)
  const notifications = useNotifications()

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter])

  const filterOrders = () => {
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerPhone.includes(searchTerm)
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus }
        : order
    ))
    
    const statusLabel = orderStatuses.find(s => s.key === newStatus)?.label
    notifications.success(`Order ${orderId} updated to ${statusLabel}`, "Status Updated")
  }

  const getStatusInfo = (status: Order["status"]) => {
    return orderStatuses.find(s => s.key === status) || orderStatuses[0]
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hr ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`
    }
  }

  const openOrderDialog = (order: Order) => {
    setSelectedOrder(order)
    setIsOrderDialogOpen(true)
  }

  const getStatusCounts = () => {
    const counts: Record<string, number> = {}
    orders.forEach(order => {
      counts[order.status] = (counts[order.status] || 0) + 1
    })
    return counts
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Tracking</h1>
          <p className="text-gray-600">Monitor and manage order statuses in real-time</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Timer className="w-4 h-4 mr-2" />
            Auto Refresh: ON
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {orderStatuses.map((status) => (
          <Card key={status.key} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{status.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statusCounts[status.key] || 0}
                  </p>
                </div>
                <div className={`p-2 rounded-full ${status.color.replace('text-', 'bg-').replace('-800', '-200')}`}>
                  <status.icon className={`w-4 h-4 ${status.color.split(' ')[1]}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search orders, customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                {orderStatuses.map((status) => (
                  <SelectItem key={status.key} value={status.key}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {filteredOrders.length} orders
              </Badge>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status)
                return (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium">{order.id}</div>
                      <div className="text-sm text-gray-500">{order.paymentMethod}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerPhone}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {order.items.map((item, index) => (
                          <div key={index}>
                            {item.quantity}x {item.name}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${order.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Badge className={statusInfo.color}>
                          <statusInfo.icon className="w-3 h-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                        <Progress value={statusInfo.progress} className="h-1" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{getTimeAgo(order.createdAt)}</div>
                        <div className="text-gray-500">
                          ETA: {new Date(order.estimatedDelivery).toLocaleTimeString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Select
                          value={order.status}
                          onValueChange={(value) => updateOrderStatus(order.id, value as Order["status"])}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {orderStatuses.map((status) => (
                              <SelectItem key={status.key} value={status.key}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openOrderDialog(order)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Status Timeline */}
              <div className="space-y-4">
                <h3 className="font-semibold">Order Progress</h3>
                <div className="space-y-3">
                  {orderStatuses.filter(s => s.key !== 'cancelled').map((status, index) => {
                    const isCompleted = status.progress <= getStatusInfo(selectedOrder.status).progress
                    const isActive = status.key === selectedOrder.status
                    
                    return (
                      <div key={status.key} className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-green-500 text-white' : 
                          isActive ? 'bg-blue-500 text-white' : 
                          'bg-gray-200 text-gray-500'
                        }`}>
                          <status.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${isActive ? 'text-blue-600' : 'text-gray-900'}`}>
                            {status.label}
                          </p>
                          {isActive && (
                            <p className="text-sm text-blue-600">Current Status</p>
                          )}
                        </div>
                        {isCompleted && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="font-semibold">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{selectedOrder.customerPhone}</span>
                  </div>
                  <div className="flex items-start space-x-2 md:col-span-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                    <span>{selectedOrder.customerAddress}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <h3 className="font-semibold">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500 ml-2">x{item.quantity}</span>
                      </div>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg font-semibold">
                    <span>Total</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              {selectedOrder.notes && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Special Instructions</h3>
                  <p className="text-gray-700 bg-yellow-50 p-3 rounded-lg">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex justify-end space-x-2">
                <Button variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Customer
                </Button>
                <Button className="bg-gradient-to-r from-red-500 to-orange-500">
                  Update Status
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 