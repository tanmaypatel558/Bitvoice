"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem, Order } from "./types"

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  updateItem: (id: number, updates: Partial<CartItem>) => void
  clearCart: () => void
  getFilteredItems: (filter: string) => CartItem[]
  getTotalPrice: () => number
}

interface OrderStore {
  orders: Order[]
  currentOrder: Order | null
  addOrder: (order: Order) => void
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
  setCurrentOrder: (order: Order | null) => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          // Check if item with same name, size, and toppings already exists
          const existingItemIndex = state.items.findIndex(
            (existingItem) =>
              existingItem.name === item.name &&
              existingItem.size === item.size &&
              JSON.stringify(existingItem.toppings.sort()) === JSON.stringify(item.toppings.sort())
          )

          if (existingItemIndex >= 0) {
            // Item exists, increment quantity
            const updatedItems = [...state.items]
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + item.quantity,
            }
            return { items: updatedItems }
          } else {
            // Item doesn't exist, add new item
            return { items: [...state.items, { ...item, id: Date.now() }] }
          }
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        })),
      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
        })),
      clearCart: () => set({ items: [] }),
      getFilteredItems: (filter) => {
        const items = get().items
        if (filter === "all") return items
        if (filter === "veg") return items.filter((item) => item.type === "vegetarian")
        if (filter === "non-veg") return items.filter((item) => item.type === "non-vegetarian")
        if (filter === "drinks") return items.filter((item) => item.category === "drink")
        if (filter === "pizza") return items.filter((item) => item.category === "pizza")
        if (filter === "combo") return items.filter((item) => item.category === "combo")
        return items
      },
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)

export const useOrderStore = create<OrderStore>()((set) => ({
  orders: [],
  currentOrder: null,
  addOrder: (order) =>
    set((state) => ({
      orders: [...state.orders, order],
    })),
  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((order) => (order.id === orderId ? { ...order, status } : order)),
    })),
  setCurrentOrder: (order) => set({ currentOrder: order }),
}))
