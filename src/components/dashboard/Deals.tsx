import React, { useState, useTransition, useEffect } from 'react';
import { Pencil, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { updateFlightDeals, updateDestinations } from '@/lib/action';
import UploadImage from '../UploadImage';
import { useDashboard } from '@/hooks/useDashboard';
import { Textarea } from '../ui/textarea';

interface FlightDeal {
  _id: string;
  image: string;
  origin: string;
  destination: string;
  date: string;
  class: string;
  price: string;
  link: string;
}

interface TravelDestination {
  _id: string;
  image: string;
  country: string;
  description: string;
}

const FlightDealForm = ({ 
  deal,
  onSubmit,
  onCancel,
  isLoading,
}: { 
  deal: FlightDeal;
  onSubmit: (data: FlightDeal, imageToDelete?: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState(deal);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [imageToDelete, setImageToDelete] = useState<string | undefined>();

  useEffect(() => {
    if (uploadedImage) {
      if (formData.image !== '/placeholder-image.png' && formData.image !== uploadedImage) {
        setImageToDelete(formData.image);
      }
      setFormData(prev => ({
        ...prev,
        image: uploadedImage
      }));
      setUploadedImage('');
    }
  }, [uploadedImage]);

  const handleCancel = () => {
    setImageToDelete(undefined);
    onCancel();
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(formData, imageToDelete);
    }}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <UploadImage
            uploadedImages={[formData.image]}
            setUploadedImage={setUploadedImage}
            multiple={false}
            maxFiles={1}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Origin</label>
            <Input
              value={formData.origin}
              onChange={(e) => setFormData({...formData, origin: e.target.value})}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Destination</label>
            <Input
              value={formData.destination}
              onChange={(e) => setFormData({...formData, destination: e.target.value})}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Date</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Class</label>
            <Input
              value={formData.class}
              onChange={(e) => setFormData({...formData, class: e.target.value})}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Price</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 ">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Link</label>
            <Input
              value={formData.link}
              onChange={(e) => setFormData({...formData, link: e.target.value})}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
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
  );
};

const DestinationForm = ({ 
  destination,
  onSubmit,
  onCancel,
  isLoading
}: { 
  destination: TravelDestination;
  onSubmit: (data: TravelDestination, imageToDelete?: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState(destination);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [imageToDelete, setImageToDelete] = useState<string | undefined>();

  useEffect(() => {
    if (uploadedImage) {
      if (formData.image !== '/placeholder-image.png' && formData.image !== uploadedImage) {
        setImageToDelete(formData.image);
      }
      setFormData(prev => ({
        ...prev,
        image: uploadedImage
      }));
      setUploadedImage('');
    }
  }, [uploadedImage]);

  const handleCancel = () => {
    setImageToDelete(undefined);
    onCancel();
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(formData, imageToDelete);
    }}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <UploadImage
            uploadedImages={[formData.image]}
            setUploadedImage={setUploadedImage}
            multiple={false}
            maxFiles={1}
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Country</label>
          <Input
            value={formData.country}
            onChange={(e) => setFormData({...formData, country: e.target.value})}
            disabled={isLoading}
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="min-h-[100px]"
            disabled={isLoading}
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
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
  );
};

export default function Deals({role}: {role: string}) {
  const { flightDeals, destinations, getFlightDeals, getDestinations, isLoading: isDataLoading, deleteImages } = useDashboard();
  const [isPending, startTransition] = useTransition();
  const [dealsData, setDealsData] = useState<FlightDeal[]>([]);
  const [destinationsData, setDestinationsData] = useState<TravelDestination[]>([]);
  const [editingFlight, setEditingFlight] = useState<FlightDeal | null>(null);
  const [editingDestination, setEditingDestination] = useState<TravelDestination | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const isHigherRole = role === 'admin' || role === 'manager';

  useEffect(() => {
    getFlightDeals();
    getDestinations();
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

  useEffect(() => {
    if (destinations) {
      const processedDestinations = destinations.map((dest: any) => ({
        ...dest,
        image: dest.image || '/placeholder-image.png'
      }));
      setDestinationsData(processedDestinations);
    }
  }, [destinations]);

  const handleUpdateFlight = async (updatedDeal: FlightDeal, imageToDelete?: string) => {
    setIsProcessing(true);
    const formData = new FormData();
    Object.entries(updatedDeal).forEach(([key, value]) => {
      formData.append(key, value?.toString() || '');
    });
    formData.append('_id', updatedDeal._id.toString());

    startTransition(async () => {
      try {
        await updateFlightDeals(formData);
        if (imageToDelete) {
          deleteImages([imageToDelete]);
        }
        await getFlightDeals();
        setEditingFlight(null);
      } catch (error) {
        console.error('Failed to update flight deal:', error);
      } finally {
        setIsProcessing(false);
      }
    });
  };

  const handleUpdateDestination = async (updatedDestination: TravelDestination, imageToDelete?: string) => {
    setIsProcessing(true);
    const formData = new FormData();
    Object.entries(updatedDestination).forEach(([key, value]) => {
      formData.append(key, value?.toString() || '');
    });
    formData.append('_id', updatedDestination._id.toString());

    startTransition(async () => {
      try {
        await updateDestinations(formData);
        if (imageToDelete) {
          deleteImages([imageToDelete]);
        }
        await getDestinations();
        setEditingDestination(null);
      } catch (error) {
        console.error('Failed to update destination:', error);
      } finally {
        setIsProcessing(false);
      }
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isDataLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Loading deals...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Flight Deals Section */}
      {isHigherRole && (
        <div>
        <h2 className="text-2xl font-semibold mb-4">Flight Deals</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {dealsData.map(deal => (
            <div key={deal._id} className="bg-white rounded-lg shadow-md p-4">
              <div className="relative">
                <img
                  src={deal.image}
                  alt={`${deal.origin} to ${deal.destination}`}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <Button
                  onClick={() => setEditingFlight(deal)}
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2"
                  disabled={isProcessing}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <div className="text-lg font-medium">
                  {deal.origin} → {deal.destination}
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(deal.date)} • {deal.class}
                </div>
                <div className="text-xl font-bold text-green-600">
                  ${deal.price.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Travel Destinations Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Travel Destinations</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {destinationsData.map(destination => (
            <div key={destination._id} className="bg-white rounded-lg shadow-md p-4">
              <div className="relative">
                <img
                  src={destination.image}
                  alt={destination.country}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <Button
                  onClick={() => setEditingDestination(destination)}
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2"
                  disabled={isProcessing}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <div className="text-lg font-medium">{destination.country}</div>
                <p className="text-sm text-gray-600">{destination.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Flight Deal Dialog */}
      <Dialog open={!!editingFlight} onOpenChange={(open: any) => {
        if (!open) setEditingFlight(null);
      }}>
        <DialogContent className="max-w-3xl" onClose={() => setEditingFlight(null)}>
          <DialogHeader>
            <DialogTitle>Edit Flight Deal</DialogTitle>
            <DialogDescription>
              Update the flight deal details below
            </DialogDescription>
          </DialogHeader>
          {editingFlight && (
            <FlightDealForm
              deal={editingFlight}
              onSubmit={handleUpdateFlight}
              onCancel={() => setEditingFlight(null)}
              isLoading={isProcessing}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Destination Dialog */}
      <Dialog open={!!editingDestination} onOpenChange={(open: any) => {
        if (!open) setEditingDestination(null);
      }}>
        <DialogContent className="max-w-2xl" onClose={() => setEditingDestination(null)}>
          <DialogHeader>
            <DialogTitle>Edit Travel Destination</DialogTitle>
            <DialogDescription>
              Update the destination details below
            </DialogDescription>
          </DialogHeader>
          {editingDestination && (
            <DestinationForm
              destination={editingDestination}
              onSubmit={handleUpdateDestination}
              onCancel={() => setEditingDestination(null)}
              isLoading={isProcessing}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}