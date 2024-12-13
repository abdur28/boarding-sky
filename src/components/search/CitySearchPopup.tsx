import React, { useState, useEffect, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAmadeus } from '@/hooks/useAmadeus'
import { Plane, MapPin } from 'lucide-react'


interface CitySearchPopupProps {
  label: string
  placeholder: string
  type?: string
  onCitySelect: (city: string) => void
  onChange: (value: string) => void
}

export function CitySearchPopup({ label, placeholder, type, onCitySelect, onChange }: CitySearchPopupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<any>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  const { citySearch, isLoading, airports } = useAmadeus();

  useEffect(() => {
    if (searchTerm !== "") {
      citySearch(searchTerm)
    }
  }, [searchTerm])

  useEffect(() => {
    if (airports && airports.length > 0) {
      setSuggestions(airports)
    } else {
      setSuggestions([])
    }
  }, [airports])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
    setSearchTerm(e.target.value)
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const handleCitySelect = (city: string) => {
    setSearchTerm(city)
    onCitySelect(city)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Label htmlFor={label}>{label}</Label>
      <Input
        ref={inputRef}
        id={label}
        autoComplete='off'
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
      />
      {isOpen && (
        <div
          ref={popupRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
        >
          {suggestions.length > 0 ? (
            <ul className="py-1 max-h-60 overflow-auto">
              {suggestions.map((city: any, index: number) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer "
                  onClick={() => handleCitySelect(
                    type === 'city' ? `${city.cityName} - ${city.iataCode}` :
                    `${city.cityName} (${city.iataCode} - ${city.name})`)
                  }
                >
                  <div className="flex items-center  gap-3">
                    {type === 'city' ? <MapPin className="w-5 h-5" /> : <Plane className="w-5 h-5" fill='black' />}
                    <div className="flex flex-col">
                      <span className="text-sm">{type === 'city' ? `${city.cityName}` : `${city.cityName} (${city.iataCode} - ${city.name})`}</span>
                      <span className="text-xs text-muted-foreground">{city.cityName}, {city.stateCode && city.stateCode + ', '} {city.countryCode}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-2 text-gray-500">{isLoading ? 'Loading...' : 'No results found'}</div>
          )}
        </div>
      )}
    </div>
  )
}