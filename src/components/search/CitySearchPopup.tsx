import React, { useState, useEffect, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    const autoComplete = async (searchTerm: string) => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/autocomplete`, {
          cache: "no-store",
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: JSON.stringify({ query: searchTerm }),
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        return data.data
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    if (searchTerm !== "") {
      autoComplete(searchTerm).then(data => {
        setSuggestions(data)
      })
    }
  }, [searchTerm])

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
                    type === 'city' ? `${city.cityName} - ${city.iataCode}` : type === 'car' ? `${city.cityName} - ${city.iataCode} - ${city.countryCode}` :
                    `${city.cityName} (${city.iataCode} - ${city.name})`)
                  }
                >
                  <div className="flex items-center gap-3">
                    {type === 'city' || type === 'car' ? <MapPin className="w-5 h-5 flex-shrink-0" /> : <Plane className="w-5 h-5 flex-shrink-0" fill='black' />}
                    <div className="flex flex-col">
                      <span className="text-sm">{type === 'city' || type === 'car' ? `${city.cityName}` : `${city.cityName} (${city.iataCode} - ${city.name})`}</span>
                      <span className="text-xs text-muted-foreground">{city.cityName}, {city.cityCode && city.cityCode + ', '} {city.countryCode}</span>
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