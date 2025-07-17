export interface CartItem {
  id: number
  name: string
  category: "pizza" | "drink" | "combo"
  type: "vegetarian" | "non-vegetarian" | "beverage"
  size?: string
  toppings: string[]
  price: number
  quantity: number
  image: string
  basePrice: number
}

export interface Order {
  id: string
  customerId: string
  customerName: string
  customerPhone: string
  items: CartItem[]
  status: "pending" | "confirmed" | "preparing" | "baking" | "out-for-delivery" | "delivered" | "cancelled"
  total: number
  deliveryAddress: string
  paymentMethod: string
  createdAt: string
  estimatedDelivery: string
  notes?: string
}

export interface ComboOffer {
  id: number
  name: string
  description: string
  items: { productId: number; quantity: number }[]
  originalPrice: number
  discountedPrice: number
  image: string
  active: boolean
}

export interface Product {
  id: number
  name: string
  description: string
  basePrice: number
  category: "pizza" | "drink"
  type: "vegetarian" | "non-vegetarian" | "beverage"
  image: string
  images?: string[] // Additional images for products
  available: boolean
  toppings?: { id: string; name: string; price: number }[]
  sizes?: { id: string; name: string; price: number }[]
}
