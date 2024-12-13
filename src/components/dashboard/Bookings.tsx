'use client';

import React, { useState, useMemo } from 'react';
import { Search, Calendar, Pencil, Loader2 } from "lucide-react";
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

interface Booking {
  id: string;
  userEmail: string;
  description: string;
  type: string;
  status: string;
  date: string;
  amount: number;
  isRefundable: boolean;
}

const BOOKING_STATUS = ["Paid", "Unpaid", "Cancelled", "Refund"];
const FILTER_STATUS = ["All", ...BOOKING_STATUS];
const BOOKING_TYPES = ["All", "Flights", "Hotels", "Cars", "Tours"];

const SAMPLE_BOOKINGS: Booking[] = [
  {
    id: "BK-001",
    userEmail: "john.doe@example.com",
    description: "Round-trip flight to New York",
    type: "Flights",
    status: "Paid",
    date: "2024-03-15",
    amount: 450,
    isRefundable: true
  },
  {
    id: "BK-002",
    userEmail: "jane.smith@example.com",
    description: "3 nights at Hilton Hotel",
    type: "Hotels",
    status: "Unpaid",
    date: "2024-03-20",
    amount: 600,
    isRefundable: false
  },
  {
    id: "BK-003",
    userEmail: "alice.j@example.com",
    description: "City Tour Package",
    type: "Tours",
    status: "Paid",
    date: "2024-03-10",
    amount: 200,
    isRefundable: false
  },
  {
    id: "BK-004",
    userEmail: "Abdurrahmanidris28@gmail.com",
    description: "City Tour Package",
    type: "Tours",
    status: "Paid",
    date: "2024-03-10",
    amount: 200,
    isRefundable: false
  },
  {
    id: "BK-005",
    userEmail: "abdurrahmanidris28@gmail.com",
    description: "Round-trip flight to New York",
    type: "Flights",
    status: "Paid",
    date: "2024-03-15",
    amount: 450,
    isRefundable: true
  },
];

export default function Bookings({ userAsString }: { userAsString: string }) {
  const user = JSON.parse(userAsString);
  const role = user?.role?.toLowerCase() || "user";
  const isHigherRole = role === 'admin' || role === 'manager';

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [bookings, setBookings] = useState(SAMPLE_BOOKINGS);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredBookings = useMemo(() => {
    let filtered = bookings;
    
    // If not admin/manager, only show user's own bookings
    if (!isHigherRole) {
      filtered = bookings.filter(booking => booking.userEmail.toLowerCase() === user.email.toLowerCase());
    }

    return filtered.filter(booking => {
      const matchesSearch = searchQuery.toLowerCase() === "" || 
        (isHigherRole && booking.userEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
        booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = selectedStatus === "All" || booking.status === selectedStatus;
      const matchesType = selectedType === "All" || booking.type === selectedType;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [bookings, searchQuery, selectedStatus, selectedType, isHigherRole, user.email]);

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setIsEditDialogOpen(true);
  };

  const handleUpdateBooking = (updatedBooking: Booking) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === updatedBooking.id ? updatedBooking : booking
        )
      );
      setIsLoading(false);
      setIsEditDialogOpen(false);
      setEditingBooking(null);
    }, 1000);
  };

  const handleCancelRequest = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowCancelDialog(true);
  };

  const handleRefundRequest = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowRefundDialog(true);
  };

  const confirmCancel = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (selectedBooking) {
        setBookings(prevBookings =>
          prevBookings.map(booking =>
            booking.id === selectedBooking.id 
              ? { ...booking, status: "Cancelled" }
              : booking
          )
        );
      }
      setIsLoading(false);
      setShowCancelDialog(false);
      setSelectedBooking(null);
    }, 1000);
  };

  const confirmRefund = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (selectedBooking) {
        setBookings(prevBookings =>
          prevBookings.map(booking =>
            booking.id === selectedBooking.id 
              ? { ...booking, status: "Refund" }
              : booking
          )
        );
      }
      setIsLoading(false);
      setShowRefundDialog(false);
      setSelectedBooking(null);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Unpaid":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Refund":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderBookingActions = (booking: Booking) => {
    if (isHigherRole) {
      return (
        <button
          onClick={() => handleEdit(booking)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          disabled={isLoading}
        >
          <Pencil className="h-4 w-4 text-gray-500" />
        </button>
      );
    }

    if (booking.status === "Unpaid") {
      return (
        <Button 
          variant="outline" 
          onClick={() => handleCancelRequest(booking)}
          className="text-sm"
          disabled={isLoading}
        >
          Cancel Booking
        </Button>
      );
    }

    if (booking.status === "Paid" && booking.isRefundable) {
      return (
        <Button 
          variant="outline" 
          onClick={() => handleRefundRequest(booking)}
          className="text-sm"
          disabled={isLoading}
        >
          Request Refund
        </Button>
      );
    }

    return null;
  };

  const renderBookingItem = (booking: Booking) => (
    <div
      key={booking.id}
      className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow space-y-4 md:space-y-0"
    >
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-900">
            {booking.id}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(booking.status)}`}>
            {booking.status}
          </span>
          {booking.status === "Paid" && (
            <span className={`px-2 py-1 rounded-full text-xs ${
              booking.isRefundable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {booking.isRefundable ? 'Refundable' : 'Non-refundable'}
            </span>
          )}
        </div>
        {isHigherRole && (
          <span className="text-sm text-gray-500">
            {booking.userEmail}
          </span>
        )}
        <span className="text-sm">
          {booking.description}
        </span>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-gray-500">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">
            {new Date(booking.date).toLocaleDateString()}
          </span>
        </div>
        <span className="font-medium">
          ${booking.amount}
        </span>
        {renderBookingActions(booking)}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col space-y-6">
      {/* Filters Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder={isHigherRole ? "Search bookings..." : "Search your bookings..."}
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
                {status}
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
                {type}
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
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdateBooking(editingBooking);
              }}>
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
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {editingBooking.status === "Paid" && (
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
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isLoading}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
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

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowCancelDialog(false)} disabled={isLoading}>
              No, Keep Booking
            </Button>
            <Button variant="destructive" onClick={confirmCancel} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Yes, Cancel Booking'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Refund</DialogTitle>
            <DialogDescription>
              Are you sure you want to request a refund for this booking?
              Our team will review your request and process it according to our refund policy.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowRefundDialog(false)} 
              disabled={isLoading}
            >
              No, Keep Booking
            </Button>
            <Button onClick={confirmRefund} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Yes, Request Refund'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span>Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
}