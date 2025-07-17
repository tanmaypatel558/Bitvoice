import { NextResponse } from "next/server"
import { getProducts, getDbStats } from "@/lib/vercel-db"

export async function GET() {
  try {
    const products = await getProducts()
    const stats = await getDbStats()
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      stats,
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        image: p.image,
        images: p.images || [],
        available: p.available
      })),
      localStorage: typeof window !== 'undefined' ? {
        products: localStorage.getItem('pizzahub_products_v2') ? 'exists' : 'missing',
        initialized: localStorage.getItem('pizzahub_initialized_v2') ? 'exists' : 'missing'
      } : 'server-side'
    }
    
    return NextResponse.json(debugInfo)
  } catch (error) {
    return NextResponse.json({ 
      error: "Failed to get debug info", 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
} 