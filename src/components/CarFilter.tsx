'use client'

import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface FilterSection {
  id: string
  title: string
  content: React.ReactNode
}

interface FilterState {
  priceRange: string
  carTypes: string[]
  specifications: string[]
  transmission: string
  fuelType: string
}

interface PriceRange {
  min: string
  max: string
}

const CAR_TYPES = {
  'ECONOMY': "Economy",
  'COMPACT': "Compact",
  'MIDSIZE': "Midsize",
  'FULLSIZE': "Fullsize",
  'SUV': "SUV",
  'LUXURY': "Luxury",
  'VAN': "Van/Minivan",
  'CONVERTIBLE': "Convertible"
} as const

const SPECIFICATIONS = {
  'AIR_CONDITIONING': "Air Conditioning",
  'AUTOMATIC': "Automatic Transmission",
  'MANUAL': "Manual Transmission",
  'BLUETOOTH': "Bluetooth",
  'GPS': "GPS Navigation",
  'BACKUP_CAMERA': "Backup Camera",
  'CRUISE_CONTROL': "Cruise Control",
  'CHILD_SEAT': "Child Seat Compatible",
  'UNLIMITED_MILEAGE': "Unlimited Mileage",
  'USB_PORT': "USB Port",
} as const

const FUEL_TYPES = {
  'PETROL': "Petrol",
  'DIESEL': "Diesel",
  'HYBRID': "Hybrid",
  'ELECTRIC': "Electric"
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
  const initialPriceRange = parsePriceRange(searchParams.get('priceRange'))

  const [expandedSections, setExpandedSections] = useState<string[]>([''])
  const [priceRange, setPriceRange] = useState<PriceRange>(initialPriceRange)
  const [filters, setFilters] = useState<FilterState>({
    priceRange: searchParams.get('priceRange') || '',
    carTypes: searchParams.get('carTypes')?.split(',').filter(Boolean) || [],
    specifications: searchParams.get('specifications')?.split(',').filter(Boolean) || [],
    transmission: searchParams.get('transmission') || '',
    fuelType: searchParams.get('fuelType') || '',
  })

  const updateURLParams = (newFilters: FilterState) => {
    const params = new URLSearchParams(searchParams.toString())

    if (newFilters.priceRange) {
      params.set('priceRange', newFilters.priceRange)
    } else {
      params.delete('priceRange')
    }

    if (newFilters.carTypes.length > 0) {
      params.set('carTypes', newFilters.carTypes.join(','))
    } else {
      params.delete('carTypes')
    }

    if (newFilters.specifications.length > 0) {
      params.set('specifications', newFilters.specifications.join(','))
    } else {
      params.delete('specifications')
    }

    if (newFilters.transmission) {
      params.set('transmission', newFilters.transmission)
    } else {
      params.delete('transmission')
    }

    if (newFilters.fuelType) {
      params.set('fuelType', newFilters.fuelType)
    } else {
      params.delete('fuelType')
    }

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

  const handleCheckboxFilter = (type: 'carTypes' | 'specifications', value: string) => {
    setFilters(prev => {
      const currentValues = prev[type]
      const newFilters = {
        ...prev,
        [type]: currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value]
      }
      return newFilters
    })
  }

  const handleRadioFilter = (type: 'transmission' | 'fuelType', value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type] === value ? '' : value
    }))
  }

  const handleApplyFilters = () => {
    const formattedRange = formatPriceRange(priceRange.min, priceRange.max)
    const newFilters = {
      ...filters,
      priceRange: formattedRange || ''
    }
    updateURLParams(newFilters)
  }

  const clearAllFilters = () => {
    setPriceRange({ min: '', max: '' })
    setFilters({
      priceRange: '',
      carTypes: [],
      specifications: [],
      transmission: '',
      fuelType: ''
    })
    updateURLParams({
      priceRange: '',
      carTypes: [],
      specifications: [],
      transmission: '',
      fuelType: ''
    })
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
      id: 'carTypes',
      title: 'Car Types',
      content: (
        <div className="space-y-2">
          {Object.entries(CAR_TYPES).map(([key, name]) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox 
                id={key}
                checked={filters.carTypes.includes(key)}
                onCheckedChange={() => handleCheckboxFilter('carTypes', key)}
                disabled={loading}
              />
              <Label htmlFor={key}>{name}</Label>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'specifications',
      title: 'Specifications',
      content: (
        <div className="space-y-2">
          {Object.entries(SPECIFICATIONS).map(([key, name]) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox 
                id={key}
                checked={filters.specifications.includes(key)}
                onCheckedChange={() => handleCheckboxFilter('specifications', key)}
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
        <RadioGroup value={filters.fuelType} className="space-y-2">
          {Object.entries(FUEL_TYPES).map(([key, name]) => (
            <div key={key} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={key}
                id={`fuel-${key}`}
                onClick={() => handleRadioFilter('fuelType', key)}
                disabled={loading}
              />
              <Label htmlFor={`fuel-${key}`}>{name}</Label>
            </div>
          ))}
        </RadioGroup>
      ),
    }
  ]

  const hasActiveFilters = () => {
    return (
      priceRange.min !== '' ||
      priceRange.max !== '' ||
      filters.carTypes.length > 0 ||
      filters.specifications.length > 0 ||
      filters.transmission !== '' ||
      filters.fuelType !== ''
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Filter Cars</CardTitle>
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