'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Utensils,
  Hotel,
  Bus,
  Camera,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Star,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from 'next/link';

interface Tour {
  _id: string;
  name: string;
  destination: string;
  days: number;
  tourId: string;
  price: number;
  details: string;
  images: string[];
  // Suggested additional fields
  highlights: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
    activities: string[];
  }[];
  included: string[];
  notIncluded: string[];
  departure: string;
  maxGroupSize: number;
  minAge: number;
  difficulty: "Easy" | "Moderate" | "Challenging";
  rating: number;
  reviewCount: number;
}

export default function SingleTourPage({ tourAsString }: { tourAsString: string }) {
  const tour: Tour = JSON.parse(tourAsString);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % tour.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + tour.images.length) % tour.images.length);
  };

  // Mock data for demo
  const mockHighlights = [
    "Visit UNESCO World Heritage sites",
    "Experience local culture and traditions",
    "Taste authentic local cuisine",
    "Scenic mountain views",
    "Professional photography opportunities"
  ];

  const mockItinerary = [
    {
      day: 1,
      title: "Arrival & Welcome Dinner",
      description: "Arrive at your destination and meet your tour guide. Evening welcome dinner with the group.",
      activities: ["Airport transfer", "Hotel check-in", "Welcome dinner"]
    },
    // Add more days...
  ];

  return (
    <div className="max-w-7xl mx-auto px-5 py-8">
      {/* Back Button */}
      <Link href={'/tour'}>
        <Button
          variant="ghost"
          className="mb-6"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Tours
        </Button>
      </Link>
      <div className="grid lg:grid-cols-3  gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <div className="relative h-[500px] w rounded-2xl overflow-hidden group">
            {tour.images.length > 0 && (
              <Image
                src={tour.images[currentImageIndex]}
                alt={tour.name}
                fill
                className="object-cover"
              />
            )}
            
            {/* Image Navigation */}
            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="icon"
                onClick={prevImage}
                className="rounded-full backdrop-blur-sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={nextImage}
                className="rounded-full backdrop-blur-sm"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {tour.images.length}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex w-full justify-center items-center pb-2 ">
            <div className='w-full flex flex-wrap gap-2 overflow-x-auto p-1'>
            {tour.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={cn(
                  "relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0",
                  currentImageIndex === index && "ring-2 ring-blue-500"
                )}
              >
                <Image
                  src={image}
                  alt={`${tour.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
            </div>
          </div>

          {/* Tour Information */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">{tour.name}</h1>
                
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {tour.destination}
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  {tour.days} days
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  Max {tour.maxGroupSize || 12} people
                </div>
                <div className="flex items-center text-gray-600">
                  <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                  {tour.rating || 4.8} ({tour.reviewCount || 24} reviews)
                </div>
              </div>

              <Badge variant="secondary" className="text-sm">
                {tour.difficulty || "Moderate"} Tour
              </Badge>
            </div>

            {/* Description */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Tour Overview</h2>
              <p className={cn(
                "text-gray-600 whitespace-pre-line",
                !showFullDescription && "line-clamp-4"
              )}>
                {tour.details}
              </p>
              {tour.details.length > 300 && (
                <Button
                  variant="link"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-2 p-0"
                >
                  {showFullDescription ? "Show less" : "Read more"}
                </Button>
              )}
            </Card>

            {/* Highlights */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Tour Highlights</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {(tour.highlights || mockHighlights).map((highlight, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Camera className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-gray-600">{highlight}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Itinerary */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Tour Itinerary</h2>
              <div className="space-y-6">
                {(tour.itinerary || mockItinerary).map((day, index) => (
                  <div key={index} className="border-l-2 border-blue-200 pl-4 pb-6">
                    <h3 className="font-semibold text-lg">
                      Day {day.day}: {day.title}
                    </h3>
                    <p className="text-gray-600 mt-2">{day.description}</p>
                    <div className="mt-3 space-y-2">
                      {day.activities.map((activity, actIndex) => (
                        <div key={actIndex} className="flex items-center text-gray-600">
                          <div className="w-2 h-2 rounded-full bg-blue-400 mr-2" />
                          {activity}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Price Card */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-500">Starting from</p>
                  <p className="text-3xl font-bold">${tour.price.toLocaleString()}</p>
                </div>
                <Badge variant="secondary">Per person</Badge>
              </div>
              <Button className="w-full" size="lg">
                Book Now
              </Button>
            </Card>

            {/* Included Features */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">{`What's Included`}</h3>
              <div className="space-y-3">
                {tour.included.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-gray-600">{feature}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Important Info */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Important Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tour ID</span>
                  <span className="font-medium">{tour.tourId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-medium">{tour.days} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Group Size</span>
                  <span className="font-medium">Max {tour.maxGroupSize || 12} people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Minimum Age</span>
                  <span className="font-medium">{tour.minAge || 12} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Departure</span>
                  <span className="font-medium">{tour.departure || "Daily"}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}