'use client'

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Wallet, XCircle, Users, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Button } from '@/components/ui/button';
import NumberTicker from '../ui/number-ticker';
import { useDashboard } from '@/hooks/useDashboard';

// Sample data for the charts
const countryData = [
  { country: "Thailand", visits: 1200 },
  { country: "France", visits: 800 },
  { country: "Japan", visits: 750 },
  { country: "Italy", visits: 700 },
  { country: "Spain", visits: 650 },
];

const bookingTrends = [
  { month: "Jan", bookings: 120 },
  { month: "Feb", bookings: 150 },
  { month: "Mar", bookings: 180 },
  { month: "Apr", bookings: 220 },
  { month: "May", bookings: 250 },
  { month: "Jun", bookings: 280 },
];

// Admin/Manager Version
export function AdminManagerIntro() {
  return (
    <div className="flex flex-col space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="h-1 bg-blue-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"><NumberTicker value={2850} /></div>
            <p className="text-xs text-muted-foreground">
              +20% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <div className="h-1 bg-green-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <BookOpen className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"><NumberTicker value={1250} /></div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <div className="h-1 bg-yellow-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpaid Bookings</CardTitle>
            <Wallet className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"><NumberTicker value={120} /></div>
            <p className="text-xs text-muted-foreground">
              -5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <div className="h-1 bg-red-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled Bookings</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"><NumberTicker value={25} /></div>
            <p className="text-xs text-muted-foreground">
              +2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Lists Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Most Visited Countries Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Most Visited Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="country" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visits" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Cancellation Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Cancellation Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="pb-2 text-left font-medium">Booking ID</th>
                    <th className="pb-2 text-left font-medium">Type</th>
                    <th className="pb-2 text-left font-medium">Description</th>
                    <th className="pb-2 text-left font-medium">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {cancellationRequests.map((request) => (
                    <tr key={request.bookingId} className="border-b">
                      <td className="py-2">
                        <div>{request.bookingId}</div>
                        <div className="text-xs text-gray-500">{request.email}</div>
                      </td>
                      <td className="py-2">{request.type}</td>
                      <td className="py-2">
                        <div>{request.description}</div>
                        <div className="text-xs text-gray-500">{request.date}</div>
                      </td>
                      <td className="py-2">${request.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Editor/User Version
export function EditorUserIntro() {
  const { flightDeals, getFlightDeals, isLoading } = useDashboard();
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [dealsData, setDealsData] = React.useState<any[]>([]);

  useEffect(() => {
    getFlightDeals();
  }, []);

  useEffect(() => {
    if (flightDeals) {
      const processedDeals = flightDeals.map((deal: any) => ({
        ...deal,
        image: deal.image || '/placeholder-image.png'
      }));
      setDealsData(processedDeals);
    }
  }, [flightDeals]);

  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev === (dealsData?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? (dealsData?.length || 1) - 1 : prev - 1
    );
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <div className="h-1 bg-green-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <BookOpen className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"><NumberTicker value={1250} /></div>
          </CardContent>
        </Card>

        <Card>
          <div className="h-1 bg-yellow-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpaid Bookings</CardTitle>
            <Wallet className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"><NumberTicker value={120} /></div>
          </CardContent>
        </Card>

        <Card>
          <div className="h-1 bg-red-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled Bookings</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"><NumberTicker value={25} /></div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Deals Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Booking Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bookingTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke="#4f46e5" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Flight Deals Slider */}
        <Card>
          <CardHeader>
            <CardTitle>Featured Flight Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {isLoading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading flight deals...</p>
                  </div>
                </div>
              ) : dealsData && dealsData.length > 0 ? (
                <div className="relative h-[300px]">
                  <div className="absolute inset-0">
                    <img
                      src={dealsData[currentSlide].image}
                      alt={`${dealsData[currentSlide].origin} to ${dealsData[currentSlide].destination}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 rounded-b-lg">
                      <h3 className="text-xl font-bold">
                        {dealsData[currentSlide].origin} → {dealsData[currentSlide].destination}
                      </h3>
                      <p className="text-sm mt-1">
                        {new Date(dealsData[currentSlide].date).toLocaleDateString()} • {dealsData[currentSlide].class}
                      </p>
                      <p className="text-2xl font-bold text-green-400 mt-2">
                        ${Number(dealsData[currentSlide].price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-1/2 transform -translate-y-1/2 left-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={prevSlide}
                      className="rounded-full bg-white bg-opacity-50 hover:bg-opacity-75"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute top-1/2 transform -translate-y-1/2 right-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={nextSlide}
                      className="rounded-full bg-white bg-opacity-50 hover:bg-opacity-75"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">No flight deals available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Main Intro component that handles role-based rendering
export default function Intro({ role }: { role: string }) {
  const isHigherRole = role === 'admin' || role === 'manager';
  return isHigherRole ? <AdminManagerIntro /> : <EditorUserIntro />;
}

// Sample data for cancellation requests
const cancellationRequests = [
  {
    email: "john@example.com",
    bookingId: "BK-001",
    type: "Flight",
    description: "Flight to Paris",
    date: "2024-03-15",
    price: 450,
  },
  {
    email: "sarah@example.com",
    bookingId: "BK-002",
    type: "Hotel",
    description: "Hilton Hotel - 3 nights",
    date: "2024-03-20",
    price: 600,
  },
  {
    email: "mike@example.com",
    bookingId: "BK-003",
    type: "Tour",
    description: "City Tour Package",
    date: "2024-03-18",
    price: 200,
  },
];