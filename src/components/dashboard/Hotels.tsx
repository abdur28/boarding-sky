import React, { useState, useMemo, useTransition, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Hotel,
  Search,
  MapPin,
  Star,
  DollarSign,
  Users,
  Pencil,
  Trash2,
  Plus,
  Loader2,
  Building,
  BadgeCheck
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { updateHotels } from '@/lib/action';
import { useDashboard } from '@/hooks/useDashboard';
import { HotelOffer } from '@/types';
import Image from 'next/image';
import HotelOfferForm from '../forms/HotellOfferForm';

const initialFormState: Omit<HotelOffer, 'id'> = {
  type: 'hotel',
  name: '',
  provider: 'direct',
  description: '',
  location: {
    latitude: 0,
    longitude: 0,
    address: '',
  },
  hotelClass: 0,
  amenities: [],
  images: [],
  price: {
    current: 0,
    currency: 'USD',
    includesTaxes: true
  },
  rating: {
    overall: 0,
    totalReviews: 0
  },
  availableRooms: 0
};

export default function HotelOffers() {
  const { hotelOffers, getHotelOffers, isLoading: isDataLoading, deleteImages } = useDashboard();
  const [isPending, startTransition] = useTransition();
  const [hotelsData, setHotelsData] = useState<HotelOffer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<HotelOffer | null>(null);
  const [deletingHotel, setDeletingHotel] = useState<HotelOffer | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    getHotelOffers();
  }, []);

  useEffect(() => {
    if (hotelOffers) {
      setHotelsData(hotelOffers);
    }
  }, [hotelOffers]);

  const filteredHotels = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return hotelsData.filter(hotel => 
      hotel.name.toLowerCase().includes(query) ||
      hotel.location.address?.toLowerCase().includes(query)
    );
  }, [hotelsData, searchQuery]);

  const handleAdd = async (data: Omit<HotelOffer, 'id'>, imagesToDelete: string[]) => {
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
        await updateHotels(formData);
        if (imagesToDelete.length > 0) {
          await deleteImages(imagesToDelete);
        }
        await getHotelOffers();
        setIsAddDialogOpen(false);
      } catch (error) {
        console.error('Failed to add hotel:', error);
      } finally {
        setIsProcessing(false);
      }
    });
  };

  const handleUpdate = async (data: Omit<HotelOffer, 'id'>, imagesToDelete: string[]) => {
    if (!editingHotel) return;
    setIsProcessing(true);
  
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value?.toString() || '');
      }
    });
    formData.append('_id', editingHotel.id.toString());
  
    startTransition(async () => {
      try {
        await updateHotels(formData);
        if (imagesToDelete.length > 0) {
          await deleteImages(imagesToDelete);
        }
        await getHotelOffers();
        setIsEditDialogOpen(false);
        setEditingHotel(null);
      } catch (error) {
        console.error('Failed to update hotel:', error);
      } finally {
        setIsProcessing(false);
      }
    });
  };

  const handleEdit = (hotel: HotelOffer) => {
    setEditingHotel(hotel);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (hotel: HotelOffer) => {
    setDeletingHotel(hotel);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingHotel) return;
    setIsProcessing(true);

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('_id', deletingHotel.id.toString());
        formData.append('action', 'delete');
        
        await updateHotels(formData);
        if (deletingHotel.images.length > 0) {
          await deleteImages(deletingHotel.images.map(img => img.original || img.thumbnail));
        }
        await getHotelOffers();
        setIsDeleteDialogOpen(false);
        setDeletingHotel(null);
      } catch (error) {
        console.error('Failed to delete hotel:', error);
      } finally {
        setIsProcessing(false);
      }
    });
  };

  if (isDataLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Loading hotels...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by hotel name or location..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Hotel
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredHotels.map((hotel: HotelOffer) => (
          <div
            key={hotel.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row">
              {/* Image Section */}
              <div className="relative w-full md:w-48 h-48 md:h-auto">
                {hotel.images && hotel.images.length > 0 ? (
                  <Image
                    src={hotel.images[0].original || hotel.images[0].thumbnail}
                    alt={hotel.name}
                    fill
                    className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-t-lg md:rounded-l-lg md:rounded-t-none">
                    <Building className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                {hotel.type && (
                  <Badge 
                    className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm"
                    variant="secondary"
                  >
                    {hotel.type}
                  </Badge>
                )}
              </div>

              {/* Content Section */}
              <div className="flex-1 p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{hotel.name}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {hotel.location.address || 'Location not specified'}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => handleEdit(hotel)}
                      variant="ghost"
                      size="icon"
                      disabled={isProcessing}
                    >
                      <Pencil className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(hotel)}
                      variant="ghost"
                      size="icon"
                      disabled={isProcessing}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                {/* Hotel Details Grid */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="h-4 w-4 mr-2" />
                    {hotel.hotelClass || 0} Stars
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {hotel.availableRooms || 0} rooms available
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    {hotel.price.currency} {hotel.price.current.toLocaleString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <BadgeCheck className="h-4 w-4 mr-2" />
                    {hotel.rating.overall.toFixed(1)} ({hotel.rating.totalReviews} reviews)
                  </div>
                </div>

                {/* Amenities */}
                {hotel.amenities && hotel.amenities.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {hotel.amenities.slice(0, 3).map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {hotel.amenities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{hotel.amenities.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredHotels.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No hotels found matching your criteria
          </div>
        )}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Hotel</DialogTitle>
            <DialogDescription>
              Enter the hotel details below
            </DialogDescription>
          </DialogHeader>
          <HotelOfferForm
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
            <DialogTitle>Edit Hotel</DialogTitle>
            <DialogDescription>
              Update the hotel details
            </DialogDescription>
          </DialogHeader>
          {editingHotel && (
            <HotelOfferForm
              initialData={editingHotel}
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
            <AlertDialogTitle>Delete Hotel</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingHotel?.name}? 
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