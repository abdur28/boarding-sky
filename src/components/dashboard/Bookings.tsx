'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Calendar, Pencil, Loader2, Check, Clock, Ban, Plane, Building2, Car, Map } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useDashboard } from '@/hooks/useDashboard';
import { differenceInDays, format, parseISO } from 'date-fns';
import Image from 'next/image';

const BOOKING_STATUS = ["confirmed", "pending", "cancelled", "completed"];
const FILTER_STATUS = ["All", ...BOOKING_STATUS];
const BOOKING_TYPES = ["All", "flight", "hotel", "car", "tour"];

export default function Bookings({ userAsString }: { userAsString: string }) {
  const router = useRouter();
  const user = JSON.parse(userAsString);
  const role = user?.role?.toLowerCase() || "user";
  const isHigherRole = role === 'admin' || role === 'manager';

  const { bookings, isLoading, getBookings, updateBookings } = useDashboard();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    getBookings(isHigherRole ? 'all' : user._id);
  }, [getBookings, isHigherRole, user._id]);

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const matchesSearch = searchQuery.toLowerCase() === "" || 
        (isHigherRole && booking.user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        booking.bookingId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = selectedStatus === "All" || booking.status === selectedStatus;
      const matchesType = selectedType === "All" || booking.bookingType === selectedType;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [bookings, searchQuery, selectedStatus, selectedType, isHigherRole]);

  const handleEdit = (booking: any) => {
    setEditingBooking(booking);
    setIsEditDialogOpen(true);
  };

  const handleUpdateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;
    
    setUpdateLoading(true);
    try {
      await updateBookings({
        bookingId: editingBooking.bookingId,
        status: editingBooking.status,
        isRefundable: editingBooking.isRefundable
      });
      
      setIsEditDialogOpen(false);
      setEditingBooking(null);
    } catch (error) {
      console.error('Failed to update booking:', error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
      case "failed":
        return "bg-red-100 text-red-800";
      case "completed":
      case "refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "paid":
      case "completed":
        return <Check className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
      case "failed":
        return <Ban className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getBookingTypeIcon = (type: string) => {
    switch (type) {
      case "flight":
        return <Plane className="h-4 w-4" />;
      case "hotel":
        return <Building2 className="h-4 w-4" />;
      case "car":
        return <Car className="h-4 w-4" />;
      case "tour":
        return <Map className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return '';
    return format(typeof dateString === 'string' ? parseISO(dateString) : dateString, 'MMM dd, yyyy');
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '';
    return format(parseISO(dateString), 'MMM dd, yyyy HH:mm');
  };

  const renderFlightDetails = (details: any) => {
    const firstSegment = details?.itineraries?.[0]?.segments?.[0];
    const lastSegment = details?.itineraries?.[0]?.segments?.slice(-1)[0];
    
    return (
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-500">Departure</div>
          <div className="text-sm">{formatDateTime(firstSegment?.departure?.at)}</div>
          <div className="text-base font-semibold">{firstSegment?.departure?.iataCode}</div>
          {firstSegment?.departure?.terminal && (
            <div className="text-sm text-gray-500">Terminal {firstSegment.departure.terminal}</div>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-500">Arrival</div>
          <div className="text-sm">{formatDateTime(lastSegment?.arrival?.at)}</div>
          <div className="text-base font-semibold">{lastSegment?.arrival?.iataCode}</div>
          {lastSegment?.arrival?.terminal && (
            <div className="text-sm text-gray-500">Terminal {lastSegment.arrival.terminal}</div>
          )}
        </div>

        <div className="col-span-2 divide-y divide-gray-200">
          <div className="py-1.5">
            <span className="text-sm font-medium text-gray-500">Passengers: </span>
            <span className="text-sm">{
              details?.passengers?.length || 
              (details?.fareDetails?.[0]?.passengers && 
                Object.values(details.fareDetails[0].passengers).reduce((a, b) => (a as number) + (b as number), 0)) || 
              "N/A"
            }</span>
          </div>
          <div className="py-2">
            <span className="text-sm font-medium text-gray-500">Class: </span>
            <span className="text-sm">{details?.fareDetails?.[0]?.cabin || "Economy"}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderHotelDetails = (details: any) => (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div className="space-y-1">
        <div className="text-sm font-medium text-gray-500">Check-in</div>
        <div className="text-sm">{formatDate(details?.checkIn)}</div>
      </div>
      
      <div className="space-y-1">
        <div className="text-sm font-medium text-gray-500">Check-out</div>
        <div className="text-sm">{formatDate(details?.checkOut)}</div>
      </div>

      <div className="col-span-2 divide-y divide-gray-200">
        <div className="py-2">
          <span className="text-sm font-medium text-gray-500">Room: </span>
          <span className="text-sm">{details?.roomDetails?.name || "Standard Room"}</span>
        </div>
        <div className="py-2">
          <span className="text-sm font-medium text-gray-500">Guests: </span>
          <span className="text-sm">{details?.guests?.length || 1} guests</span>
        </div>
        {details?.specialRequests && (
          <div className="py-2">
            <span className="text-sm font-medium text-gray-500">Special Requests: </span>
            <span className="text-sm">{details.specialRequests}</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderCarDetails = (details: any) => (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div className="space-y-1">
        <div className="text-sm font-medium text-gray-500">Pickup</div>
        <div className="text-sm">{formatDateTime(`${details?.pickupDate}T${details?.pickupTime}`)}</div>
        <div className="text-sm font-medium">{details?.pickupLocation}</div>
      </div>
      
      <div className="space-y-1">
        <div className="text-sm font-medium text-gray-500">Drop-off</div>
        <div className="text-sm">{formatDateTime(`${details?.dropoffDate}T${details?.dropoffTime}`)}</div>
        <div className="text-sm font-medium">{details?.dropoffLocation}</div>
      </div>

      <div className="col-span-2 divide-y divide-gray-200">
        <div className="py-2">
          <span className="text-sm font-medium text-gray-500">Duration: </span>
          <span className="text-sm">
            {differenceInDays(new Date(details?.dropoffDate), new Date(details?.pickupDate))} days
          </span>
        </div>
        <div className="py-2">
          <span className="text-sm font-medium text-gray-500">Driver: </span>
          <span className="text-sm">License: {details?.licenseNumber || "Not provided"}</span>
        </div>
      </div>
    </div>
  );

  const renderTourDetails = (details: any) => (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div className="space-y-1">
        <div className="text-sm font-medium text-gray-500">Destination</div>
        <div className="text-sm">{details?.destination}</div>
      </div>
      
      <div className="space-y-1">
        <div className="text-sm font-medium text-gray-500">Duration</div>
        <div className="text-sm">{details?.days} days</div>
      </div>
  
      <div className="col-span-2 divide-y divide-gray-200">
        <div className="py-2">
          <span className="text-sm font-medium text-gray-500">Departure: </span>
          <span className="text-sm">{details?.departure}</span>
        </div>
        <div className="py-2">
          <span className="text-sm font-medium text-gray-500">Participants: </span>
          <span className="text-sm">
            {details?.adults} Adults
            {details?.children > 0 && `, ${details?.children} Children`}
          </span>
        </div>
        <div className="py-2">
          <span className="text-sm font-medium text-gray-500">Total Participants: </span>
          <span className="text-sm">{details?.totalParticipants}</span>
        </div>
      </div>
    </div>
  );

  const renderBookingDetails = (booking: any) => {
    switch (booking.bookingType) {
      case 'flight':
        return renderFlightDetails(booking.bookingDetails);
      case 'hotel':
        return renderHotelDetails(booking.bookingDetails);
      case 'car':
        return renderCarDetails(booking.bookingDetails);
      case 'tour':
        return renderTourDetails(booking.bookingDetails);
      default:
        return null;
    }
  };

  const renderBookingItem = (booking: any) => (
    <div
      key={booking.bookingId}
      onClick={() => router.push(`/booking/${booking.bookingId}`)}
      className="flex flex-col p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between gap-3">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-2">
            {getBookingTypeIcon(booking.bookingType)}
            <span className="text-lg font-semibold text-gray-900">
              {booking.bookingId}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
              {getStatusIcon(booking.status)}
              {booking.status}
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.paymentStatus)}`}>
              {getStatusIcon(booking.paymentStatus)}
              {booking.paymentStatus}
            </span>
            {booking.paymentStatus === 'paid' && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                booking.isRefundable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {booking.isRefundable ? 'Refundable' : 'Non-refundable'}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Amount</div>
            <div className="text-lg font-semibold">${booking.amount.toFixed(2)}</div>
          </div>
          {isHigherRole && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(booking);
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={updateLoading}
            >
              <Pencil className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Customer Info */}
      {isHigherRole && (
        <div className="mt-2 flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
            {booking.user.profilePicture && <Image
              src={booking.user.profilePicture}
              alt="user"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full"
            />}
          </div>
          <div>
            <div className="font-medium">{booking.user.name}</div>
            <div className="text-sm text-gray-500">{booking.user.email}</div>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="my-2 border-t border-gray-100" />

      {/* Booking Details */}
      {renderBookingDetails(booking)}

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Booked on {formatDate(booking.createdAt)}</span>
        </div>
        {isHigherRole && (<div>
          Provider: {booking.provider}
        </div>)}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      {/* Filters Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder={isHigherRole ? "Search by booking ID or email..." : "Search your bookings..."}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={selectedStatus}
          onValueChange={setSelectedStatus}
        >
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {FILTER_STATUS.map(status => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedType}
          onValueChange={setSelectedType}
        >
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {BOOKING_TYPES.map(type => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bookings List */}
      <div className="grid gap-4">
        {filteredBookings.map(renderBookingItem)}

        {filteredBookings.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No bookings found matching your criteria
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      {isHigherRole && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Booking Status</DialogTitle>
              <DialogDescription>
                Update the booking status and refund policy
              </DialogDescription>
            </DialogHeader>
            
            {editingBooking && (
              <form onSubmit={handleUpdateBooking}>
                <div className="grid gap-6 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={editingBooking.status}
                      onValueChange={(value) => setEditingBooking({
                        ...editingBooking,
                        status: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {BOOKING_STATUS.map(status => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {editingBooking.paymentStatus === 'paid' && (
                    <div className="flex items-center justify-between">
                      <Label htmlFor="isRefundable">Refundable</Label>
                      <Checkbox 
                        id="isRefundable"
                        checked={editingBooking.isRefundable}
                        onCheckedChange={(checked: boolean) => setEditingBooking({
                          ...editingBooking,
                          isRefundable: checked
                        })}
                      />
                    </div>
                  )}
                </div>
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditDialogOpen(false)} 
                    disabled={updateLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateLoading}>
                    {updateLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}