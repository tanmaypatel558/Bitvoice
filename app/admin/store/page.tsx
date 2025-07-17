"use client"

import { useState, useEffect } from "react"
import { 
  Store, 
  Clock, 
  Globe, 
  Phone, 
  MapPin, 
  Settings, 
  Bell,
  Users,
  Package,
  CreditCard,
  Truck,
  AlertCircle,
  CheckCircle,
  Info,
  Save,
  RotateCcw
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useNotifications } from "@/components/providers/notification-provider"

interface StoreSettings {
  isOpen: boolean
  onlineOrdersEnabled: boolean
  deliveryEnabled: boolean
  pickupEnabled: boolean
  estimatedDeliveryTime: number
  minimumOrderValue: number
  deliveryRadius: number
  deliveryFee: number
  freeDeliveryThreshold: number
  maxOrdersPerHour: number
  specialMessage: string
  temporaryClosureReason: string
  openingHours: {
    [key: string]: {
      open: string
      close: string
      closed: boolean
    }
  }
}

const defaultSettings: StoreSettings = {
  isOpen: true,
  onlineOrdersEnabled: true,
  deliveryEnabled: true,
  pickupEnabled: true,
  estimatedDeliveryTime: 30,
  minimumOrderValue: 15,
  deliveryRadius: 5,
  deliveryFee: 3.99,
  freeDeliveryThreshold: 25,
  maxOrdersPerHour: 20,
  specialMessage: "",
  temporaryClosureReason: "",
  openingHours: {
    monday: { open: "11:00", close: "22:00", closed: false },
    tuesday: { open: "11:00", close: "22:00", closed: false },
    wednesday: { open: "11:00", close: "22:00", closed: false },
    thursday: { open: "11:00", close: "22:00", closed: false },
    friday: { open: "11:00", close: "23:00", closed: false },
    saturday: { open: "11:00", close: "23:00", closed: false },
    sunday: { open: "12:00", close: "21:00", closed: false },
  }
}

export default function StorePage() {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const notifications = useNotifications()

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('storeSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleHoursChange = (day: string, field: string, value: string | boolean) => {
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
    setHasChanges(true)
  }

  const handleSaveSettings = async () => {
    try {
      setIsLoading(true)
      // Save to localStorage (in production, save to API)
      localStorage.setItem('storeSettings', JSON.stringify(settings))
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      notifications.success("Store settings saved successfully!", "Settings Updated")
      setHasChanges(false)
    } catch (error) {
      notifications.error("Failed to save settings")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetSettings = () => {
    setSettings(defaultSettings)
    setHasChanges(true)
    notifications.info("Settings reset to default values")
  }

  const toggleStoreStatus = (isOpen: boolean) => {
    handleSettingChange('isOpen', isOpen)
    if (isOpen) {
      notifications.success("Store is now OPEN for business!", "Store Opened")
    } else {
      notifications.warning("Store is now CLOSED", "Store Closed")
    }
  }

  const toggleOnlineOrders = (enabled: boolean) => {
    handleSettingChange('onlineOrdersEnabled', enabled)
    if (enabled) {
      notifications.success("Online orders are now ENABLED", "Online Orders On")
    } else {
      notifications.warning("Online orders are now DISABLED", "Online Orders Off")
    }
  }

  const getCurrentStatus = () => {
    if (!settings.isOpen) return { status: "Closed", color: "bg-red-500", message: "Store is currently closed" }
    if (!settings.onlineOrdersEnabled) return { status: "Limited", color: "bg-yellow-500", message: "Only in-store orders accepted" }
    return { status: "Open", color: "bg-green-500", message: "Accepting all orders" }
  }

  const status = getCurrentStatus()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store Management</h1>
          <p className="text-gray-600">Control your store operations and settings</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${status.color}`} />
          <span className="text-sm font-medium">{status.status}</span>
        </div>
      </div>

      {/* Current Status Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          {status.message}
          {!settings.isOpen && settings.temporaryClosureReason && (
            <span className="ml-2 font-medium">Reason: {settings.temporaryClosureReason}</span>
          )}
        </AlertDescription>
      </Alert>

      {/* Quick Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Store className="w-5 h-5" />
              <span>Store Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Store Open/Closed</Label>
                <p className="text-sm text-gray-500">Control overall store availability</p>
              </div>
              <Switch
                checked={settings.isOpen}
                onCheckedChange={toggleStoreStatus}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
            
            {!settings.isOpen && (
              <div className="space-y-2">
                <Label htmlFor="closure-reason">Closure Reason (Optional)</Label>
                <Input
                  id="closure-reason"
                  placeholder="e.g., Maintenance, Holiday, etc."
                  value={settings.temporaryClosureReason}
                  onChange={(e) => handleSettingChange('temporaryClosureReason', e.target.value)}
                />
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Online Orders</Label>
                <p className="text-sm text-gray-500">Enable/disable online ordering</p>
              </div>
              <Switch
                checked={settings.onlineOrdersEnabled}
                onCheckedChange={toggleOnlineOrders}
                disabled={!settings.isOpen}
                className="data-[state=checked]:bg-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Delivery Service</Label>
                <p className="text-sm text-gray-500">Enable/disable delivery orders</p>
              </div>
              <Switch
                checked={settings.deliveryEnabled}
                onCheckedChange={(checked) => handleSettingChange('deliveryEnabled', checked)}
                disabled={!settings.isOpen}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Pickup Service</Label>
                <p className="text-sm text-gray-500">Enable/disable pickup orders</p>
              </div>
              <Switch
                checked={settings.pickupEnabled}
                onCheckedChange={(checked) => handleSettingChange('pickupEnabled', checked)}
                disabled={!settings.isOpen}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Quick Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="delivery-time">Delivery Time (min)</Label>
                <Input
                  id="delivery-time"
                  type="number"
                  value={settings.estimatedDeliveryTime}
                  onChange={(e) => handleSettingChange('estimatedDeliveryTime', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="min-order">Min Order Value ($)</Label>
                <Input
                  id="min-order"
                  type="number"
                  step="0.01"
                  value={settings.minimumOrderValue}
                  onChange={(e) => handleSettingChange('minimumOrderValue', parseFloat(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="delivery-fee">Delivery Fee ($)</Label>
                <Input
                  id="delivery-fee"
                  type="number"
                  step="0.01"
                  value={settings.deliveryFee}
                  onChange={(e) => handleSettingChange('deliveryFee', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="free-delivery">Free Delivery Over ($)</Label>
                <Input
                  id="free-delivery"
                  type="number"
                  step="0.01"
                  value={settings.freeDeliveryThreshold}
                  onChange={(e) => handleSettingChange('freeDeliveryThreshold', parseFloat(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="delivery-radius">Delivery Radius (miles)</Label>
                <Input
                  id="delivery-radius"
                  type="number"
                  value={settings.deliveryRadius}
                  onChange={(e) => handleSettingChange('deliveryRadius', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="max-orders">Max Orders/Hour</Label>
                <Input
                  id="max-orders"
                  type="number"
                  value={settings.maxOrdersPerHour}
                  onChange={(e) => handleSettingChange('maxOrdersPerHour', parseInt(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Opening Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Opening Hours</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(settings.openingHours).map(([day, hours]) => (
              <div key={day} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-20">
                    <Label className="capitalize font-medium">{day}</Label>
                  </div>
                  <Switch
                    checked={!hours.closed}
                    onCheckedChange={(checked) => handleHoursChange(day, 'closed', !checked)}
                  />
                </div>
                
                {!hours.closed && (
                  <div className="flex items-center space-x-2">
                    <Input
                      type="time"
                      value={hours.open}
                      onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                      className="w-24"
                    />
                    <span className="text-gray-500">to</span>
                    <Input
                      type="time"
                      value={hours.close}
                      onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                      className="w-24"
                    />
                  </div>
                )}
                
                {hours.closed && (
                  <Badge variant="secondary">Closed</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Special Message */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Special Announcement</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="special-message">Customer Message</Label>
              <Textarea
                id="special-message"
                placeholder="Enter a special message for customers (e.g., holiday hours, promotions, etc.)"
                value={settings.specialMessage}
                onChange={(e) => handleSettingChange('specialMessage', e.target.value)}
                rows={3}
              />
            </div>
            {settings.specialMessage && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Preview:</strong> {settings.specialMessage}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Store Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Store Performance Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-900">24</p>
              <p className="text-sm text-blue-600">Orders Today</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CreditCard className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-900">$892</p>
              <p className="text-sm text-green-600">Revenue Today</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Truck className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-900">18</p>
              <p className="text-sm text-purple-600">Deliveries</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-900">6</p>
              <p className="text-sm text-orange-600">Pickups</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save/Reset Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Settings Changes</p>
              <p className="text-sm text-gray-500">
                {hasChanges ? "You have unsaved changes" : "All changes saved"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={handleResetSettings}
                disabled={isLoading}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Default
              </Button>
              <Button
                onClick={handleSaveSettings}
                disabled={!hasChanges || isLoading}
                className="bg-gradient-to-r from-red-500 to-orange-500"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 