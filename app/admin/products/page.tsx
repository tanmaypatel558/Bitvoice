"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Upload, Save, X } from "lucide-react"
import type { Product } from "@/lib/types"

const defaultToppings = [
  { id: "pepperoni", name: "Pepperoni", price: 2.5 },
  { id: "mushrooms", name: "Mushrooms", price: 1.5 },
  { id: "olives", name: "Black Olives", price: 1.5 },
  { id: "peppers", name: "Bell Peppers", price: 1.5 },
  { id: "onions", name: "Red Onions", price: 1.0 },
  { id: "cheese", name: "Extra Cheese", price: 2.0 },
  { id: "chicken", name: "Grilled Chicken", price: 3.0 },
  { id: "sausage", name: "Italian Sausage", price: 2.5 },
]

const defaultSizes = [
  { id: "small", name: 'Small (8")', price: 0 },
  { id: "medium", name: 'Medium (12")', price: 3 },
  { id: "large", name: 'Large (16")', price: 6 },
]

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: 0,
    category: "pizza" as "pizza" | "drink",
    type: "vegetarian" as "vegetarian" | "non-vegetarian" | "beverage",
    image: "",
    available: true,
    toppings: defaultToppings,
    sizes: defaultSizes,
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData((prev) => ({ ...prev, image: data.imageUrl }))
      }
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const productData = {
        ...formData,
        toppings: formData.category === "pizza" ? formData.toppings : undefined,
        sizes: formData.category === "pizza" ? formData.sizes : undefined,
      }

      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products"
      const method = editingProduct ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        fetchProducts()
        resetForm()
        setIsDialogOpen(false)
      }
    } catch (error) {
      console.error("Failed to save product:", error)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      basePrice: product.basePrice,
      category: product.category,
      type: product.type,
      image: product.image,
      available: product.available,
      toppings: product.toppings || defaultToppings,
      sizes: product.sizes || defaultSizes,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchProducts()
      }
    } catch (error) {
      console.error("Failed to delete product:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      basePrice: 0,
      category: "pizza",
      type: "vegetarian",
      image: "",
      available: true,
      toppings: defaultToppings,
      sizes: defaultSizes,
    })
    setEditingProduct(null)
  }

  const updateTopping = (index: number, field: string, value: string | number) => {
    const newToppings = [...formData.toppings]
    newToppings[index] = { ...newToppings[index], [field]: value }
    setFormData({ ...formData, toppings: newToppings })
  }

  const addTopping = () => {
    setFormData({
      ...formData,
      toppings: [...formData.toppings, { id: "", name: "", price: 0 }],
    })
  }

  const removeTopping = (index: number) => {
    setFormData({
      ...formData,
      toppings: formData.toppings.filter((_, i) => i !== index),
    })
  }

  const updateSize = (index: number, field: string, value: string | number) => {
    const newSizes = [...formData.sizes]
    newSizes[index] = { ...newSizes[index], [field]: value }
    setFormData({ ...formData, sizes: newSizes })
  }

  const pizzas = products.filter((p) => p.category === "pizza")
  const drinks = products.filter((p) => p.category === "drink")

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Product Management</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="basePrice">Base Price ($)</Label>
                    <Input
                      id="basePrice"
                      type="number"
                      step="0.01"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: Number.parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: "pizza" | "drink") => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pizza">Pizza</SelectItem>
                        <SelectItem value="drink">Cold Drink</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: "vegetarian" | "non-vegetarian" | "beverage") =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                        <SelectItem value="beverage">Beverage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="available"
                      checked={formData.available}
                      onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                    />
                    <Label htmlFor="available">Available</Label>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <Label htmlFor="image">Product Image</Label>
                  <div className="flex items-center space-x-4">
                    <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                    <Button type="button" disabled={uploading}>
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? "Uploading..." : "Upload"}
                    </Button>
                  </div>
                  {formData.image && (
                    <div className="mt-4">
                      <Image
                        src={formData.image || "/placeholder.svg"}
                        alt="Product preview"
                        width={200}
                        height={200}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Pizza-specific fields */}
                {formData.category === "pizza" && (
                  <div className="space-y-6">
                    {/* Toppings */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <Label>Available Toppings</Label>
                        <Button type="button" onClick={addTopping} size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Topping
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {formData.toppings.map((topping, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Input
                              placeholder="Topping ID"
                              value={topping.id}
                              onChange={(e) => updateTopping(index, "id", e.target.value)}
                            />
                            <Input
                              placeholder="Topping Name"
                              value={topping.name}
                              onChange={(e) => updateTopping(index, "name", e.target.value)}
                            />
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Price"
                              value={topping.price}
                              onChange={(e) => updateTopping(index, "price", Number.parseFloat(e.target.value))}
                            />
                            <Button type="button" variant="outline" size="sm" onClick={() => removeTopping(index)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sizes */}
                    <div>
                      <Label className="mb-4 block">Available Sizes</Label>
                      <div className="space-y-2">
                        {formData.sizes.map((size, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Input
                              placeholder="Size ID"
                              value={size.id}
                              onChange={(e) => updateSize(index, "id", e.target.value)}
                            />
                            <Input
                              placeholder="Size Name"
                              value={size.name}
                              onChange={(e) => updateSize(index, "name", e.target.value)}
                            />
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Additional Price"
                              value={size.price}
                              onChange={(e) => updateSize(index, "price", Number.parseFloat(e.target.value))}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    {editingProduct ? "Update Product" : "Create Product"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="pizzas" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pizzas">Pizzas ({pizzas.length})</TabsTrigger>
            <TabsTrigger value="drinks">Cold Drinks ({drinks.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pizzas" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pizzas.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="relative">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <Badge className={product.type === "vegetarian" ? "bg-green-500" : "bg-red-500"}>
                          {product.type === "vegetarian" ? "Veg" : "Non-Veg"}
                        </Badge>
                        <Badge variant={product.available ? "default" : "secondary"}>
                          {product.available ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold">${product.basePrice.toFixed(2)}</span>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <p>Toppings: {product.toppings?.length || 0} available</p>
                        <p>Sizes: {product.sizes?.length || 0} available</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="drinks" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drinks.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="relative">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant={product.available ? "default" : "secondary"}>
                          {product.available ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold">${product.basePrice.toFixed(2)}</span>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
