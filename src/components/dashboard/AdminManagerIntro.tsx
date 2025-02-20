import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Wallet, XCircle, Users, Loader2, DollarSign } from "lucide-react";
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
import NumberTicker from '../ui/number-ticker';
import { useDashboard } from '@/hooks/useDashboard';
import { BaseBooking, BookingType, Receipt } from '@/types';

interface Stats {
  totalUsers: number;
  totalBookings: number;
  paidBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
}

interface DestinationStat {
  destination: string;
  bookings: number;
}

interface BookingTrend {
  month: string;
  bookings: number;
}

interface DisplayBooking {
  bookingId: string;
  email: string;
  type: BookingType;
  date: string;
  price: number;
}

// Helper function to format dates
const formatDate = (dateString: string | Date): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// Helper function to get month name
const getMonthName = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short' });
};

// Helper function to format currency
const formatCurrency = (amount: number | undefined, currency: string = 'USD'): string => {
  if (typeof amount !== 'number') return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export function AdminManagerIntro() {
  const { 
    users, 
    bookings, 
    receipts,
    isLoading,
    getUsers,
    getBookings,
    getReceipts
  } = useDashboard();

  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalBookings: 0,
    paidBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0
  });

  const [destinationStats, setDestinationStats] = useState<DestinationStat[]>([]);
  const [bookingTrends, setBookingTrends] = useState<BookingTrend[]>([]);
  const [confirmedBookings, setConfirmedBookings] = useState<DisplayBooking[]>([]);

  useEffect(() => {
    getUsers();
    getBookings();
    getReceipts();
  }, [getUsers, getBookings, getReceipts]);

  useEffect(() => {
    if (bookings && users && receipts) {
      // Calculate main stats
      const totalPaidAmount = (receipts as Receipt[]).reduce((sum, receipt) => 
        sum + (receipt.paymentDetails?.amount || 0), 0
      );
      
      const typedBookings = bookings as BaseBooking[];
      
      setStats({
        totalUsers: users.length || 0,
        totalBookings: typedBookings.length || 0,
        paidBookings: typedBookings.filter(b => b.paymentStatus === 'paid').length || 0,
        cancelledBookings: typedBookings.filter(b => b.status === 'cancelled').length || 0,
        totalRevenue: totalPaidAmount
      });

      // Calculate destination statistics based on booking type
      const destinations = typedBookings.reduce((acc, booking) => {
        let destination = '';
        
        switch (booking.bookingType) {
          case 'flight':
            destination = (booking as unknown as { destination: string }).destination;
            break;
          case 'hotel':
          case 'tour':
            destination = (booking as unknown as { destination: string }).destination;
            break;
          default:
            return acc;
        }
        
        if (destination) {
          acc[destination] = (acc[destination] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const destinationData = Object.entries(destinations)
        .map(([destination, count]) => ({
          destination,
          bookings: count
        }))
        .sort((a, b) => b.bookings - a.bookings)
        .slice(0, 5);

      setDestinationStats(destinationData);

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

      // Get confirmed but not completed bookings
      const confirmedData = typedBookings
        .filter(booking => 
          booking.status === 'confirmed'
        )
        .slice(0, 5)
        .map(booking => ({
          bookingId: booking.bookingId,
          email: booking.customer.email,
          type: booking.bookingType,
          date: formatDate(booking.createdAt),
          price: booking.amount
        }));

      setConfirmedBookings(confirmedData);
    }
  }, [bookings, users, receipts]);

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="h-1 bg-blue-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <NumberTicker value={stats.totalUsers} />
            </div>
            <p className="text-xs text-muted-foreground">
              Active platform users
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
            <div className="text-2xl font-bold">
              <NumberTicker value={stats.totalBookings} />
            </div>
            <p className="text-xs text-muted-foreground">
              All time bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <div className="h-1 bg-yellow-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Bookings</CardTitle>
            <Wallet className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <NumberTicker value={stats.paidBookings} />
            </div>
            <p className="text-xs text-muted-foreground">
              All time paid bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <div className="h-1 bg-red-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              All time revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Lists Section */}
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

        {/* Recent Confirmed Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Confirmed Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="pb-2 text-left font-medium">Booking ID</th>
                    <th className="pb-2 text-left font-medium">Type</th>
                    <th className="pb-2 text-left font-medium">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {confirmedBookings.map((booking) => (
                    <tr key={booking.bookingId} className="border-b">
                      <td className="py-2">
                        <div>{booking.bookingId}</div>
                        <div className="text-xs text-gray-500">{booking.email}</div>
                      </td>
                      <td className="py-2 capitalize">{booking.type}</td>
                      <td className="py-2">{formatCurrency(booking.price)}</td>
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
