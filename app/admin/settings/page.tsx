"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { 
  Store, 
  Users, 
  Bell, 
  Shield, 
  Database, 
  Globe, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  Save,
  AlertCircle,
  CheckCircle,
  Settings as SettingsIcon,
  Trash2,
  Upload
} from "lucide-react"

interface RestaurantSettings {
  name: string
  description: string
  address: string
  phone: string
  email: string
  website: string
  logo: string
  openingHours: {
    monday: { open: string; close: string; closed: boolean }
    tuesday: { open: string; close: string; closed: boolean }
    wednesday: { open: string; close: string; closed: boolean }
    thursday: { open: string; close: string; closed: boolean }
    friday: { open: string; close: string; closed: boolean }
    saturday: { open: string; close: string; closed: boolean }
    sunday: { open: string; close: string; closed: boolean }
  }
  deliverySettings: {
    enabled: boolean
    fee: number
    freeDeliveryThreshold: number
    maxDeliveryDistance: number
    estimatedTime: number
  }
  paymentSettings: {
    cashOnDelivery: boolean
    cardPayment: boolean
    onlinePayment: boolean
    taxRate: number
  }
  notificationSettings: {
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    orderAlerts: boolean
  }
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<RestaurantSettings>({
    name: "PizzaHub",
    description: "Authentic Italian pizzas made with love and fresh ingredients",
    address: "123 Main Street, New York, NY 10001",
    phone: "+1 (555) 123-4567",
    email: "info@pizzahub.com",
    website: "https://pizzahub.com",
    logo: "/placeholder-logo.png",
    openingHours: {
      monday: { open: "09:00", close: "22:00", closed: false },
      tuesday: { open: "09:00", close: "22:00", closed: false },
      wednesday: { open: "09:00", close: "22:00", closed: false },
      thursday: { open: "09:00", close: "22:00", closed: false },
      friday: { open: "09:00", close: "23:00", closed: false },
      saturday: { open: "10:00", close: "23:00", closed: false },
      sunday: { open: "10:00", close: "21:00", closed: false },
    },
    deliverySettings: {
      enabled: true,
      fee: 3.99,
      freeDeliveryThreshold: 25.00,
      maxDeliveryDistance: 10,
      estimatedTime: 30
    },
    paymentSettings: {
      cashOnDelivery: true,
      cardPayment: true,
      onlinePayment: true,
      taxRate: 8.5
    },
    notificationSettings: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      orderAlerts: true
    }
  })

  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const handleSave = async () => {
    setSaving(true)
    try {
      // In a real app, you would save to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setLastSaved(new Date())
      toast.success("Settings saved successfully!")
    } catch (error) {
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setSettings(prev => ({ ...prev, logo: data.imageUrl }))
        toast.success("Logo updated successfully!")
      }
    } catch (error) {
      toast.error("Failed to upload logo")
    }
  }

  const updateOpeningHours = (day: keyof RestaurantSettings['openingHours'], field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          [field]: value
        }
      }
    }))
  }

  const clearAllData = async () => {
    if (!confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      return
    }

    try {
      // Clear products
      if (typeof window !== 'undefined') {
        localStorage.removeItem('pizzahub_products')
      }
      
      toast.success("All data cleared successfully!")
      
      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      toast.error("Failed to clear data")
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <SettingsIcon className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Restaurant Settings</h1>
          </div>
          <div className="flex items-center space-x-4">
            {lastSaved && (
              <Badge variant="outline" className="text-sm">
                <CheckCircle className="h-3 w-3 mr-1" />
                Last saved: {lastSaved.toLocaleTimeString()}
              </Badge>
            )}
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="hours">Hours</TabsTrigger>
            <TabsTrigger value="delivery">Delivery</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Store className="h-5 w-5 mr-2" />
                  Restaurant Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Restaurant Name</Label>
                    <Input
                      id="name"
                      value={settings.name}
                      onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={settings.phone}
                      onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={settings.website}
                      onChange={(e) => setSettings(prev => ({ ...prev, website: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={settings.description}
                    onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={settings.address}
                    onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="logo">Restaurant Logo</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="w-20 h-20 border rounded-lg flex items-center justify-center overflow-hidden">
                      {settings.logo ? (
                        <img src={settings.logo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <Store className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('logo')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hours" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Opening Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(settings.openingHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center space-x-4">
                      <div className="w-24">
                        <Label className="capitalize">{day}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={!hours.closed}
                          onCheckedChange={(checked) => updateOpeningHours(day as keyof RestaurantSettings['openingHours'], 'closed', !checked)}
                        />
                        <span className="text-sm text-muted-foreground">
                          {hours.closed ? 'Closed' : 'Open'}
                        </span>
                      </div>
                      {!hours.closed && (
                        <>
                          <Input
                            type="time"
                            value={hours.open}
                            onChange={(e) => updateOpeningHours(day as keyof RestaurantSettings['openingHours'], 'open', e.target.value)}
                            className="w-32"
                          />
                          <span className="text-muted-foreground">to</span>
                          <Input
                            type="time"
                            value={hours.close}
                            onChange={(e) => updateOpeningHours(day as keyof RestaurantSettings['openingHours'], 'close', e.target.value)}
                            className="w-32"
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="delivery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Delivery Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.deliverySettings.enabled}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      deliverySettings: { ...prev.deliverySettings, enabled: checked }
                    }))}
                  />
                  <Label>Enable Delivery Service</Label>
                </div>

                {settings.deliverySettings.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="deliveryFee">Delivery Fee ($)</Label>
                      <Input
                        id="deliveryFee"
                        type="number"
                        step="0.01"
                        value={settings.deliverySettings.fee}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          deliverySettings: { ...prev.deliverySettings, fee: parseFloat(e.target.value) }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="freeDeliveryThreshold">Free Delivery Threshold ($)</Label>
                      <Input
                        id="freeDeliveryThreshold"
                        type="number"
                        step="0.01"
                        value={settings.deliverySettings.freeDeliveryThreshold}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          deliverySettings: { ...prev.deliverySettings, freeDeliveryThreshold: parseFloat(e.target.value) }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxDeliveryDistance">Max Delivery Distance (miles)</Label>
                      <Input
                        id="maxDeliveryDistance"
                        type="number"
                        value={settings.deliverySettings.maxDeliveryDistance}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          deliverySettings: { ...prev.deliverySettings, maxDeliveryDistance: parseInt(e.target.value) }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="estimatedTime">Estimated Delivery Time (minutes)</Label>
                      <Input
                        id="estimatedTime"
                        type="number"
                        value={settings.deliverySettings.estimatedTime}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          deliverySettings: { ...prev.deliverySettings, estimatedTime: parseInt(e.target.value) }
                        }))}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Payment Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.paymentSettings.cashOnDelivery}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        paymentSettings: { ...prev.paymentSettings, cashOnDelivery: checked }
                      }))}
                    />
                    <Label>Cash on Delivery</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.paymentSettings.cardPayment}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        paymentSettings: { ...prev.paymentSettings, cardPayment: checked }
                      }))}
                    />
                    <Label>Card Payment</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.paymentSettings.onlinePayment}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        paymentSettings: { ...prev.paymentSettings, onlinePayment: checked }
                      }))}
                    />
                    <Label>Online Payment</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.1"
                    value={settings.paymentSettings.taxRate}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      paymentSettings: { ...prev.paymentSettings, taxRate: parseFloat(e.target.value) }
                    }))}
                    className="w-32"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      notificationSettings: { ...prev.notificationSettings, emailNotifications: checked }
                    }))}
                  />
                  <Label>Email Notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      notificationSettings: { ...prev.notificationSettings, smsNotifications: checked }
                    }))}
                  />
                  <Label>SMS Notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      notificationSettings: { ...prev.notificationSettings, pushNotifications: checked }
                    }))}
                  />
                  <Label>Push Notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.notificationSettings.orderAlerts}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      notificationSettings: { ...prev.notificationSettings, orderAlerts: checked }
                    }))}
                  />
                  <Label>Order Alerts</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  System Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    These actions are irreversible. Please proceed with caution.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Clear All Data</h4>
                      <p className="text-sm text-muted-foreground">
                        Remove all products, orders, and customer data from the system.
                      </p>
                    </div>
                    <Button variant="destructive" onClick={clearAllData}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Data
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Database Status</h4>
                      <p className="text-sm text-muted-foreground">
                        Current database: localStorage (development mode)
                      </p>
                    </div>
                    <Badge variant="outline">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">System Version</h4>
                      <p className="text-sm text-muted-foreground">
                        PizzaHub Admin v1.0.0
                      </p>
                    </div>
                    <Badge variant="outline">Latest</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 