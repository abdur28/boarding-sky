'use client';

import React, { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, DollarSign, Search, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Tour {
  _id: string;
  name: string;
  destination: string;
  days: number;
  tourId: string;
  price: number;
  details: string;
  images: string[];
  maxGroupSize?: number;
  rating?: number;
  reviewCount?: number;
  difficulty?: "Easy" | "Moderate" | "Challenging";
}

// Sample tours data
const sampleTours: Tour[] = [
  {
    _id: "tour1",
    name: "Magical Northern Thailand Adventure",
    destination: "Thailand",
    days: 7,
    tourId: "TH-2024-001",
    price: 1299,
    details: `Explore the cultural heart of Thailand with this immersive 7-day tour...`,
    images: [
      "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800",
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800"
    ],
    maxGroupSize: 12,
    rating: 4.9,
    reviewCount: 127,
    difficulty: "Moderate"
  },
  {
    _id: "tour2",
    name: "Iconic Japan Cultural Tour",
    destination: "Japan",
    days: 10,
    tourId: "JP-2024-001",
    price: 2499,
    details: `Discover the perfect blend of ancient and modern Japan...`,
    images: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800"
    ],
    maxGroupSize: 10,
    rating: 4.8,
    reviewCount: 89,
    difficulty: "Easy"
  },
  {
    _id: "tour3",
    name: "Vietnam Heritage Trail",
    destination: "Vietnam",
    days: 5,
    tourId: "VN-2024-001",
    price: 899,
    details: `Experience the rich heritage and natural beauty of Vietnam...`,
    images: [
      "https://images.unsplash.com/photo-1528127269322-539801943592?w=800",
      "https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=800"
    ],
    maxGroupSize: 15,
    rating: 4.7,
    reviewCount: 156,
    difficulty: "Moderate"
  },
  // Add more sample tours as needed
];

interface ToursListProps {
  toursAsString: string;
}

export default function ToursList({ toursAsString }: ToursListProps) {
  // For demo purposes, we'll use sampleTours instead of parsing toursAsString
  // const tours: Tour[] = sampleTours;
  
  const tours: Tour[] = JSON.parse(toursAsString);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("All");
  const [selectedDuration, setSelectedDuration] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 10000]);

  // Filter options
  const destinations = useMemo(() => {
    const uniqueDestinations = Array.from(new Set(tours.map(tour => tour.destination)));
    return ["All", ...uniqueDestinations];
  }, [tours]);

  const difficultyLevels = ["All", "Easy", "Moderate", "Challenging"];
  const durationRanges = ["All", "1-3 days", "4-7 days", "8+ days"];

  const maxPrice = useMemo(() => {
    return Math.max(...tours.map(tour => tour.price), 10000);
  }, [tours]);

  React.useEffect(() => {
    setPriceRange([0, maxPrice]);
  }, [maxPrice]);

  const filteredTours = useMemo(() => {
    return tours.filter(tour => {
      const matchesSearch = 
        tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.details.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDestination = selectedDestination === "All" || tour.destination === selectedDestination;
      const matchesDifficulty = selectedDifficulty === "All" || tour.difficulty === selectedDifficulty;
      
      const matchesDuration = selectedDuration === "All" || (
        (selectedDuration === "1-3 days" && tour.days <= 3) ||
        (selectedDuration === "4-7 days" && tour.days > 3 && tour.days <= 7) ||
        (selectedDuration === "8+ days" && tour.days > 7)
      );

      const matchesPrice = tour.price >= priceRange[0] && tour.price <= priceRange[1];
      
      return matchesSearch && matchesDestination && matchesDuration && matchesPrice && matchesDifficulty;
    });
  }, [tours, searchQuery, selectedDestination, selectedDuration, selectedDifficulty, priceRange]);

  const renderTourCard = (tour: Tour) => (
    <Link 
      href={`/tour/${tour._id}`} 
      key={tour._id}
      className="block group"
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden">
          {tour.images.length > 0 ? (
            <Image
              src={tour.images[0]}
              alt={tour.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
          )}
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
              {tour.difficulty}
            </Badge>
          </div>
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-sm font-semibold">${tour.price.toLocaleString()}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
              {tour.name}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-500 text-sm">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{tour.destination}</span>
              </div>
              {tour.rating && (
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{tour.rating}</span>
                  <span className="text-gray-500 ml-1">({tour.reviewCount})</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm border-t pt-4">
            <div className="flex items-center text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>{tour.days} days</span>
            </div>
            <div className="flex items-center text-gray-500">
              <Users className="h-4 w-4 mr-1" />
              <span>Max {tour.maxGroupSize} people</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-[1400px] mx-auto p-4">
      {/* Filters Sidebar */}
      <div className="w-full lg:w-1/4 lg:sticky top-20 h-max space-y-6 bg-white p-6 rounded-xl shadow-sm">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Filters</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Search</label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search tours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Destination</label>
            <Select value={selectedDestination} onValueChange={setSelectedDestination}>
              <SelectTrigger>
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                {destinations.map(destination => (
                  <SelectItem key={destination} value={destination}>
                    {destination}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Difficulty</label>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficultyLevels.map(level => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Duration</label>
            <Select value={selectedDuration} onValueChange={setSelectedDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {durationRanges.map(range => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium">Price Range</label>
            <Slider
              defaultValue={priceRange}
              max={maxPrice}
              step={100}
              value={priceRange}
              onValueChange={setPriceRange}
              className="py-4"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>${priceRange[0].toLocaleString()}</span>
              <span>${priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTours.map(renderTourCard)}

          {filteredTours.length === 0 && (
            <div className="col-span-full text-center py-10">
              <div className="text-gray-500">No tours found matching your criteria</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}