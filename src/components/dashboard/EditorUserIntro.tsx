import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Wallet, XCircle, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import NumberTicker from '../ui/number-ticker';
import { useDashboard } from '@/hooks/useDashboard';
import { BaseBooking } from '@/types';

interface Stats {
  totalBookings: number;
  unpaidBookings: number;
  cancelledBookings: number;
}

interface BookingTrend {
  month: string;
  bookings: number;
}

interface FlightDeal {
  id: string;
  origin: string;
  destination: string;
  date: string;
  class: string;
  price: number;
  image: string;
}

// Helper functions
const formatDate = (dateString: string | Date): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const getMonthName = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short' });
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export function EditorUserIntro() {
  const { 
    bookings, 
    flightDeals, 
    isLoading,
    getBookings,
    getFlightDeals 
  } = useDashboard();

  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    unpaidBookings: 0,
    cancelledBookings: 0
  });

  const [bookingTrends, setBookingTrends] = useState<BookingTrend[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [processedDeals, setProcessedDeals] = useState<FlightDeal[]>([]);

  useEffect(() => {
    getBookings();
    getFlightDeals();
  }, [getBookings, getFlightDeals]);

  useEffect(() => {
    if (bookings) {
      const typedBookings = bookings as BaseBooking[];
      
      // Calculate stats
      setStats({
        totalBookings: typedBookings.length || 0,
        unpaidBookings: typedBookings.filter(b => b.paymentStatus === 'pending').length || 0,
        cancelledBookings: typedBookings.filter(b => b.status === 'cancelled').length || 0
      });

      // Calculate booking trends (last 6 months)
      const trends = typedBookings.reduce((acc, booking) => {
        const month = getMonthName(new Date(booking.createdAt));
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const trendData = Object.entries(trends)
        .map(([month, count]) => ({
          month,
          bookings: count
        }))
        .slice(-6);

      setBookingTrends(trendData);
    }
  }, [bookings]);

  useEffect(() => {
    if (flightDeals) {
      const deals = flightDeals.map(deal => ({
        ...deal,
        image: deal.image || '/placeholder-image.png'
      }));
      setProcessedDeals(deals);
    }
  }, [flightDeals]);

  const nextSlide = () => {
    setCurrentSlide(prev => 
      prev === (processedDeals.length - 1) ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide(prev => 
      prev === 0 ? processedDeals.length - 1 : prev - 1
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full flex-col gap-3">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Loading dashboard data...</p>
      </div>
    );
  }

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
            <div className="text-2xl font-bold">
              {stats.totalBookings === 0 ? '0' : <NumberTicker value={stats.totalBookings} />}
            </div>
          </CardContent>
        </Card>

        <Card>
          <div className="h-1 bg-yellow-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpaid Bookings</CardTitle>
            <Wallet className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.unpaidBookings === 0 ? '0' : <NumberTicker value={stats.unpaidBookings} />}
            </div>
          </CardContent>
        </Card>

        <Card>
          <div className="h-1 bg-red-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled Bookings</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.cancelledBookings === 0 ? '0' : <NumberTicker value={stats.cancelledBookings} />}
            </div>
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
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Loading flight deals...</p>
                </div>
              </div>
            ) : processedDeals.length > 0 ? (
              <div className="relative h-[300px]">
                <div className="absolute inset-0">
                  <img
                    src={processedDeals[currentSlide].image}
                    alt={`${processedDeals[currentSlide].origin} to ${processedDeals[currentSlide].destination}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 rounded-b-lg">
                    <h3 className="text-xl font-bold">
                      {processedDeals[currentSlide].origin} → {processedDeals[currentSlide].destination}
                    </h3>
                    <p className="text-sm mt-1">
                      {formatDate(processedDeals[currentSlide].date)} • {processedDeals[currentSlide].class}
                    </p>
                    <p className="text-2xl font-bold text-green-400 mt-2">
                      {formatCurrency(processedDeals[currentSlide].price)}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}