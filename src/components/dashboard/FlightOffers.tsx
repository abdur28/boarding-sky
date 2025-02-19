import React, { useState, useMemo, useTransition, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plane,
  Search,
  Calendar,
  Clock,
  DollarSign,
  Users,
  Pencil,
  Trash2,
  Plus,
  Loader2,
  ArrowRight,
  Briefcase
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { updateFlightOffers } from '@/lib/action';
import { useDashboard } from '@/hooks/useDashboard';
import { FlightOffer, Itinerary } from '@/types';
import FlightOfferForm from '../forms/FlightOfferForm';

const initialFormState: Omit<FlightOffer, 'id'> = {
  providerId: 'direct',
  source: 'OTHER',
  travelClass: 'ECONOMY',
  passengers: {
    adults: 1,
    children: 0,
    infants: 0
  },
  price: {
    amount: 0,
    currency: 'USD',
    breakdown: {
      base: 0,
      taxes: 0,
      fees: 0
    }
  },
  itineraries: [{
    duration: '',
    segments: [{
      departure: {
        iataCode: '',
        at: ''
      },
      arrival: {
        iataCode: '',
        at: ''
      },
      duration: '',
      carrierCode: '',
      number: '',
      aircraft: {
        code: '',
        name: ''
      }
    }]
  }],
  fareDetails: [{
    cabin: 'ECONOMY',
    baggage: {
      cabin: {
        quantity: 1
      },
      checked: {
        quantity: 1,
        weight: 23,
        weightUnit: 'KG'
      }
    }
  }],
  meta: {
    numberOfBookableSeats: 9,
    validatingCarrier: '',
    validatingCarrierName: '',
  }
};



export default function FlightOffers() {
  const { flightOffers, getFlightOffers, isLoading: isDataLoading } = useDashboard();
  const [isPending, startTransition] = useTransition();
  const [offersData, setOffersData] = useState<FlightOffer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<FlightOffer | null>(null);
  const [deletingOffer, setDeletingOffer] = useState<FlightOffer | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    getFlightOffers();
  }, []);

  useEffect(() => {
    if (flightOffers) {
      setOffersData(flightOffers);
    }
  }, [flightOffers]);

  const filteredOffers = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return offersData.filter(offer => 
      offer.itineraries.some(itinerary => 
        itinerary.segments.some(segment => 
          segment.departure.iataCode.toLowerCase().includes(query) ||
          segment.arrival.iataCode.toLowerCase().includes(query) ||
          segment.number.toLowerCase().includes(query)
        )
      )
    );
  }, [offersData, searchQuery]);

  const handleAdd = async (data: Omit<FlightOffer, 'id'>) => {
    setIsProcessing(true);
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value?.toString() || '');
      }
    });
  
    startTransition(async () => {
      try {
        await updateFlightOffers(formData);
        await getFlightOffers();
        setIsAddDialogOpen(false);
      } catch (error) {
        console.error('Failed to add flight offer:', error);
      } finally {
        setIsProcessing(false);
      }
    });
  };
  
  const handleUpdate = async (data: Omit<FlightOffer, 'id'>) => {
    if (!editingOffer) return;
    setIsProcessing(true);
  
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value?.toString() || '');
      }
    });
    formData.append('id', editingOffer.id!.toString());
  
    startTransition(async () => {
      try {
        await updateFlightOffers(formData);
        await getFlightOffers();
        setIsEditDialogOpen(false);
        setEditingOffer(null);
      } catch (error) {
        console.error('Failed to update flight offer:', error);
      } finally {
        setIsProcessing(false);
      }
    });
  };

  const handleEdit = (offer: FlightOffer) => {
    setEditingOffer(offer);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (offer: FlightOffer) => {
    setDeletingOffer(offer);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingOffer) return;
    setIsProcessing(true);

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('id', deletingOffer.id!.toString());
        formData.append('action', 'delete');
        
        await updateFlightOffers(formData);
        await getFlightOffers();
        setIsDeleteDialogOpen(false);
        setDeletingOffer(null);
      } catch (error) {
        console.error('Failed to delete flight offer:', error);
      } finally {
        setIsProcessing(false);
      }
    });
  };

  if (isDataLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Loading flight offers...</p>
      </div>
    );
  }

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  const calculateTotalDuration = (itinerary: Itinerary) => {
    // Assuming duration is in format "HH:mm"
    return itinerary.segments.reduce((total, segment) => {
      const [hours, minutes] = segment.duration.split(':').map(Number);
      return total + hours * 60 + minutes;
    }, 0);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by airport code or flight number..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Flight Offer
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredOffers.map((offer: FlightOffer, index: number) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4"
          >
            {offer.itineraries.map((itinerary, index) => (
              <div key={index} className="border-b last:border-b-0 py-4 first:pt-0 last:pb-0">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    {index === 0 && <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {offer.travelClass}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {offer.meta.validatingCarrier}
                      </Badge>
                    </div>}
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDuration(calculateTotalDuration(itinerary))}
                    </div>
                  </div>
                  {index === 0 && <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">
                      ${offer.price.amount.toLocaleString()}
                    </span>
                    <div className="flex">
                      <Button
                        onClick={() => handleEdit(offer)}
                        variant="ghost"
                        size="icon"
                        disabled={isProcessing}
                      >
                        <Pencil className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(offer)}
                        variant="ghost"
                        size="icon"
                        disabled={isProcessing}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>}
                </div>

                <div className="space-y-4">
                  {itinerary.segments.map((segment, segIndex) => (
                    <div key={segIndex} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-lg font-medium">{segment.departure.iataCode}</div>
                            <div className="text-sm text-gray-500">{formatDateTime(segment.departure.at)}</div>
                          </div>
                          <div className="flex flex-col items-center">
                            <Plane className="h-4 w-4 text-gray-400 rotate-90" />
                            <div className="text-xs text-gray-500">{segment.duration}</div>
                            <div className="text-xs text-gray-500">{segment.number}</div>
                          </div>
                          <div>
                            <div className="text-lg font-medium">{segment.arrival.iataCode}</div>
                            <div className="text-sm text-gray-500">{formatDateTime(segment.arrival.at)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {offer.meta.numberOfBookableSeats || 9} seats left
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="h-4 w-4 mr-2" />
                    {offer.fareDetails[0].baggage.checked 
                      ? `${offer.fareDetails[0].baggage.checked.quantity}x${offer.fareDetails[0].baggage.checked.weight}${offer.fareDetails[0].baggage.checked.weightUnit}`
                      : 'No checked baggage'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {filteredOffers.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No flight offers found matching your criteria
          </div>
        )}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Flight Offer</DialogTitle>
            <DialogDescription>
              Enter the flight offer details below
            </DialogDescription>
          </DialogHeader>
          <FlightOfferForm
            initialData={initialFormState}
            onSubmit={handleAdd}
            onCancel={() => setIsAddDialogOpen(false)}
            isLoading={isProcessing}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Flight Offer</DialogTitle>
            <DialogDescription>
              Update the flight offer details
            </DialogDescription>
          </DialogHeader>
          {editingOffer && (
            <FlightOfferForm
              initialData={editingOffer}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditDialogOpen(false)}
              isLoading={isProcessing}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Flight Offer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this flight offer? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-red-500 hover:bg-red-600"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}