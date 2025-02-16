'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useCar } from "@/hooks/useCar"

interface FilterSection {
  id: string
  title: string
  content: React.ReactNode
}

interface FilterState {
  priceRange: string
  transmission: string[]
  category: string[]
  features: string[]
  fuelType: string[]
  vendor: string[]
}

interface PriceRange {
  min: string
  max: string
}

const CATEGORIES = {
  'ECONOMY': 'Economy',
  'COMPACT': 'Compact',
  'INTERMEDIATE': 'Intermediate',
  'STANDARD': 'Standard',
  'FULLSIZE': 'Full Size',
  'PREMIUM': 'Premium',
  'LUXURY': 'Luxury',
  'SUV': 'SUV',
  'VAN': 'Van',
  'PICKUP': 'Pickup'
} as const

const TRANSMISSIONS = {
  'AUTOMATIC': 'Automatic',
  'MANUAL': 'Manual'
} as const

const FEATURES = {
  'AIR_CONDITIONING': 'Air Conditioning',
  'THIRD_ROW_SEATS': 'Third Row Seats'
} as const

const FUEL_TYPES = {
  'PETROL': 'Petrol',
  'DIESEL': 'Diesel',
  'HYBRID': 'Hybrid',
  'ELECTRIC': 'Electric'
} as const

const parsePriceRange = (range: string | null): PriceRange => {
  if (!range) return { min: '', max: '' }
  const [min, max] = range.split('-')
  return { min: min || '', max: max || '' }
}

const formatPriceRange = (min: string, max: string): string | null => {
  if (!min && !max) return null
  return `${min}-${max}`
}

export function CarFilter({ loading = false }: { loading?: boolean }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { applyFilters } = useCar()
  const initialPriceRange = parsePriceRange(searchParams.get('priceRange'))

  const [expandedSections, setExpandedSections] = useState<string[]>([''])
  const [priceRange, setPriceRange] = useState<PriceRange>(initialPriceRange)
  const [filters, setFilters] = useState<FilterState>({
    priceRange: searchParams.get('priceRange') || '',
    transmission: searchParams.get('transmission')?.split(',').filter(Boolean) || [],
    category: searchParams.get('category')?.split(',').filter(Boolean) || [],
    features: searchParams.get('features')?.split(',').filter(Boolean) || [],
    fuelType: searchParams.get('fuelType')?.split(',').filter(Boolean) || [],
    vendor: searchParams.get('vendor')?.split(',').filter(Boolean) || []
  })

  const updateURLParams = (newFilters: FilterState) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          params.set(key, value.join(','))
        } else {
          params.delete(key)
        }
      } else if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    params.set('page', '1')
    router.push(`/car/search?${params.toString()}`)
  }

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '')
    setPriceRange(prev => ({
      ...prev,
      [type]: numericValue
    }))
  }

  const handleCheckboxFilter = (type: keyof FilterState, value: string) => {
    setFilters(prev => {
      const currentValues = prev[type] as string[]
      const newFilters = {
        ...prev,
        [type]: currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value]
      }
      return newFilters
    })
  }

  const handleApplyFilters = () => {
    const formattedRange = formatPriceRange(priceRange.min, priceRange.max)
    const newFilters = {
      ...filters,
      priceRange: formattedRange || ''
    }
    
    // Update URL params
    updateURLParams(newFilters)

    // Apply filters to car offers
    const [min, max] = formattedRange ? formattedRange.split('-').map(Number) : [undefined, undefined]
    applyFilters({
      priceRange: formattedRange ? { min, max } : undefined,
      transmission: newFilters.transmission,
      category: newFilters.category,
      features: newFilters.features,
      fuelType: newFilters.fuelType,
      vendor: newFilters.vendor
    })
  }

  const clearAllFilters = () => {
    setPriceRange({ min: '', max: '' })
    const emptyFilters = {
      priceRange: '',
      transmission: [],
      category: [],
      features: [],
      fuelType: [],
      vendor: []
    }
    setFilters(emptyFilters)
    updateURLParams(emptyFilters)
    applyFilters({})
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const filterSections: FilterSection[] = [
    {
      id: 'price',
      title: 'Price Range',
      content: (
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="min-price">Min Price</Label>
              <div className="relative">
                <span className="absolute left-3 top-[50%] transform translate-y-[-50%] text-muted-foreground">$</span>
                <Input
                  id="min-price"
                  type="text"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="pl-6"
                  placeholder="0"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="max-price">Max Price</Label>
              <div className="relative">
                <span className="absolute left-3 top-[50%] transform translate-y-[-50%] text-muted-foreground">$</span>
                <Input
                  id="max-price"
                  type="text"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="pl-6"
                  placeholder="Any"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'category',
      title: 'Vehicle Category',
      content: (
        <div className="space-y-2">
          {Object.entries(CATEGORIES).map(([key, name]) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox 
                id={key}
                checked={filters.category.includes(key)}
                onCheckedChange={() => handleCheckboxFilter('category', key)}
                disabled={loading}
              />
              <Label htmlFor={key}>{name}</Label>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'transmission',
      title: 'Transmission',
      content: (
        <div className="space-y-2">
          {Object.entries(TRANSMISSIONS).map(([key, name]) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox 
                id={key}
                checked={filters.transmission.includes(key)}
                onCheckedChange={() => handleCheckboxFilter('transmission', key)}
                disabled={loading}
              />
              <Label htmlFor={key}>{name}</Label>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'features',
      title: 'Features',
      content: (
        <div className="space-y-2">
          {Object.entries(FEATURES).map(([key, name]) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox 
                id={key}
                checked={filters.features.includes(key)}
                onCheckedChange={() => handleCheckboxFilter('features', key)}
                disabled={loading}
              />
              <Label htmlFor={key}>{name}</Label>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'fuelType',
      title: 'Fuel Type',
      content: (
        <div className="space-y-2">
          {Object.entries(FUEL_TYPES).map(([key, name]) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox 
                id={key}
                checked={filters.fuelType.includes(key)}
                onCheckedChange={() => handleCheckboxFilter('fuelType', key)}
                disabled={loading}
              />
              <Label htmlFor={key}>{name}</Label>
            </div>
          ))}
        </div>
      ),
    },
  ]

  const hasActiveFilters = () => {
    return (
      priceRange.min !== '' ||
      priceRange.max !== '' ||
      filters.transmission.length > 0 ||
      filters.category.length > 0 ||
      filters.features.length > 0 ||
      filters.fuelType.length > 0 ||
      filters.vendor.length > 0
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Filter Search</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {filterSections.map(section => (
          <div key={section.id} className="border-b pb-4 last:border-b-0 last:pb-0">
            <Button
              variant="ghost"
              className="w-full justify-between font-medium"
              onClick={() => toggleSection(section.id)}
              disabled={loading}
            >
              {section.title}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  expandedSections.includes(section.id) ? 'rotate-180' : ''
                }`}
              />
            </Button>
            {expandedSections.includes(section.id) && (
              <div className="mt-4">{section.content}</div>
            )}
          </div>
        ))}
        
        <div className="flex gap-2 pt-4">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={clearAllFilters}
            disabled={loading || !hasActiveFilters()}
          >
            Clear All
          </Button>
          <Button 
            className="flex-1" 
            onClick={handleApplyFilters}
            disabled={loading || !hasActiveFilters()}
          >
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}