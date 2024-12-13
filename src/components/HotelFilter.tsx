'use client'

import { ChevronDown, Star } from 'lucide-react'
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
  amenities: string[]
  ratings: string[]
  boardType: string
  paymentPolicy: string
}

interface PriceRange {
  min: string
  max: string
}

const AMENITIES = {
  'SWIMMING_POOL': "Swimming Pool",
  'SPA': "Spa",
  'FITNESS_CENTER': "Fitness Center",
  'AIR_CONDITIONING': "Air Conditioning",
  'RESTAURANT': "Restaurant",
  'PARKING': "Parking",
  'PETS_ALLOWED': "Pets Allowed",
  'AIRPORT_SHUTTLE': "Airport Shuttle",
  'BUSINESS_CENTER': "Business Center",
  'DISABLED_FACILITIES': "Disabled Facilities",
  'WIFI': "WIFI",
  'MEETING_ROOMS': "Meeting Rooms",
  'NO_KID_ALLOWED': "No Kid Allowed",
  'TENNIS': "Tennis",
  'GOLF': "Golf",
  'KITCHEN': "Kitchen",
  'ANIMAL_WATCHING': "Animal Watching",
  'BABY-SITTING': "Baby Sitting",
  'BEACH': "Beach",
  'CASINO': "Casino",
  'JACUZZI': "Jacuzzi",
  'SAUNA': "Sauna",
  'SOLARIUM': "Solarium",
  'MASSAGE': "Massage",
  'VALET_PARKING': "Valet Parking",
  'BAR': "Bar",
  'LOUNGE': "Lounge",
  'KIDS_WELCOME': "Kids Welcome",
  'NO_PORN_FILMS': "No Porn Films",
  'MINIBAR': "Minibar",
  'TELEVISION': "Television",
  'WI-FI_IN_ROOM': "WIFI in Room",
  'ROOM_SERVICE': "Room Service",
  'GUARDED_PARKG': "Guarded Parking",
  'SERV_SPEC_MENU': "Special Menu",
} as const

const BOARD_TYPES = {
  ROOM_ONLY: "Room Only",
  BREAKFAST: "Breakfast",
  HALF_BOARD: "Half Board",
  FULL_BOARD: "Full Board",
  ALL_INCLUSIVE: "All Inclusive"
} as const

const PAYMENT_POLICIES = {
  GUARANTEE: "Guarantee",
  DEPOSIT: "Deposit",
  NONE: "Pay at Property"
} as const

const RATINGS = ['1', '2', '3', '4', '5']

const parsePriceRange = (range: string | null): PriceRange => {
  if (!range) return { min: '', max: '' }
  const [min, max] = range.split('-')
  return { min: min || '', max: max || '' }
}

const formatPriceRange = (min: string, max: string): string | null => {
  if (!min && !max) return null
  return `${min}-${max}`
}

export function HotelFilter({ loading = false }: { loading?: boolean }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialPriceRange = parsePriceRange(searchParams.get('priceRange'))

  const [expandedSections, setExpandedSections] = useState<string[]>([''])
  const [priceRange, setPriceRange] = useState<PriceRange>(initialPriceRange)
  const [filters, setFilters] = useState<FilterState>({
    priceRange: searchParams.get('priceRange') || '',
    amenities: searchParams.get('amenities')?.split(',').filter(Boolean) || [],
    ratings: searchParams.get('ratings')?.split(',').filter(Boolean) || [],
    boardType: searchParams.get('boardType') || '',
    paymentPolicy: searchParams.get('paymentPolicy') || '',
  })



  const updateURLParams = (newFilters: FilterState) => {
    const params = new URLSearchParams(searchParams.toString())

    // Handle price range
    if (newFilters.priceRange) {
      params.set('priceRange', newFilters.priceRange)
    } else {
      params.delete('priceRange')
    }

    // Handle amenities
    if (newFilters.amenities.length > 0) {
      params.set('amenities', newFilters.amenities.join(','))
    } else {
      params.delete('amenities')
    }

    // Handle ratings
    if (newFilters.ratings.length > 0) {
      params.set('ratings', newFilters.ratings.join(','))
    } else {
      params.delete('ratings')
    }

    // Handle board type
    if (newFilters.boardType) {
      params.set('boardType', newFilters.boardType)
    } else {
      params.delete('boardType')
    }

    // Handle payment policy
    if (newFilters.paymentPolicy) {
      params.set('paymentPolicy', newFilters.paymentPolicy)
    } else {
      params.delete('paymentPolicy')
    }

    // Reset to page 1
    params.set('page', '1')

    router.push(`/hotel/search?${params.toString()}`)
  }

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '')
    setPriceRange(prev => ({
      ...prev,
      [type]: numericValue
    }))
  }

  const handleCheckboxFilter = (type: 'amenities' | 'ratings', value: string) => {
    setFilters(prev => {
      const currentValues = prev[type]
      
      // Handle maximum 4 ratings selection
      if (type === 'ratings' && !currentValues.includes(value) && currentValues.length >= 4) {
        return prev
      }

      const newFilters = {
        ...prev,
        [type]: currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value]
      }
      return newFilters
    })
  }

  const handleRadioFilter = (type: 'boardType' | 'paymentPolicy', value: string) => {
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
      amenities: [],
      ratings: [],
      boardType: '',
      paymentPolicy: ''
    })
    updateURLParams({
      priceRange: '',
      amenities: [],
      ratings: [],
      boardType: '',
      paymentPolicy: ''
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
      id: 'amenities',
      title: 'Amenities',
      content: (
        <div className="space-y-2">
          {Object.entries(AMENITIES).map(([key, name]) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox 
                id={key}
                checked={filters.amenities.includes(key)}
                onCheckedChange={() => handleCheckboxFilter('amenities', key)}
                disabled={loading}
              />
              <Label htmlFor={key}>{name}</Label>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'ratings',
      title: 'Star Rating',
      content: (
        <div className="space-y-2">
          {RATINGS.map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox 
                id={`rating-${rating}`}
                checked={filters.ratings.includes(rating)}
                onCheckedChange={() => handleCheckboxFilter('ratings', rating)}
                disabled={loading || (!filters.ratings.includes(rating) && filters.ratings.length >= 4)}
              />
              <Label htmlFor={`rating-${rating}`} className="flex items-center">
                {Array.from({ length: parseInt(rating) }).map((_, index) => (
                  <Star key={index} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </Label>
            </div>
          ))}
          <p className="text-xs text-muted-foreground mt-2">Select up to 4 ratings</p>
        </div>
      ),
    },
    {
      id: 'boardType',
      title: 'Board Type',
      content: (
        <RadioGroup value={filters.boardType} className="space-y-2">
          {Object.entries(BOARD_TYPES).map(([key, name]) => (
            <div key={key} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={key}
                id={`board-${key}`}
                onClick={() => handleRadioFilter('boardType', key)}
                disabled={loading}
              />
              <Label htmlFor={`board-${key}`}>{name}</Label>
            </div>
          ))}
        </RadioGroup>
      ),
    },
    {
      id: 'paymentPolicy',
      title: 'Payment Policy',
      content: (
        <RadioGroup value={filters.paymentPolicy} className="space-y-2">
          {Object.entries(PAYMENT_POLICIES).map(([key, name]) => (
            <div key={key} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={key}
                id={`payment-${key}`}
                onClick={() => handleRadioFilter('paymentPolicy', key)}
                disabled={loading}
              />
              <Label htmlFor={`payment-${key}`}>{name}</Label>
            </div>
          ))}
        </RadioGroup>
      ),
    },
  ]

  const hasActiveFilters = () => {
    return (
      priceRange.min !== '' ||
      priceRange.max !== '' ||
      filters.amenities.length > 0 ||
      filters.ratings.length > 0 ||
      filters.boardType !== '' ||
      filters.paymentPolicy !== ''
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