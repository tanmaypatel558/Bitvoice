import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import { NotificationProvider } from '@/components/providers/notification-provider'

export const metadata: Metadata = {
  title: 'PizzaHub - Delicious Pizza Delivered',
  description: 'Order fresh, delicious pizzas online with fast delivery',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <NotificationProvider>
          {children}
          <Toaster />
        </NotificationProvider>
      </body>
    </html>
  )
}
