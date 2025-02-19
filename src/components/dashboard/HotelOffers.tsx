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
  BadgeCheck,
  Clock,
  WifiIcon,
  Home,
  ChevronRight,
  Tag
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
import { updateHotelOffers } from '@/lib/action';
import { useDashboard } from '@/hooks/useDashboard';
import { HotelOffer } from '@/types';
import Image from 'next/image';
import HotelOfferForm from '../forms/HotelOfferForm';

const initialFormState: Omit<HotelOffer, 'id'> & { rooms?: Array<any> } = {
  type: 'hotel',
  name: '',
  provider: 'direct',
  description: '',
  location: {
    latitude: 0,
    longitude: 0,
    address: '',
    cityCode: '',
    countryCode: ''
  },
  hotelClass: 0,
  checkIn: "15:00",
  checkOut: "12:00",
  amenities: [],
  images: [],
  price: {
    current: 0,
    original: 0,
    currency: 'USD',
    beforeTaxes: 0,
    includesTaxes: true,
    discount: {
      label: '',
      amount: 0,
      percentage: 0
    }
  },
  rating: {
    overall: 0,
    totalReviews: 0,
    location: 0,
    breakdown: []
  },
  brand: {
    name: '',
    logo: ''
  },
  nearbyPlaces: [],
  refundable: true,
  sponsored: false,
  propertyToken: '',
  availableRooms: 0,
  badges: [],
  meta: {
    typicalPriceRange: {
      min: 0,
      max: 0
    },
    ecoCertified: false,
    dealDescription: ''
  }
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
      hotel.location.address?.toLowerCase().includes(query) ||
      hotel.location.cityCode?.toLowerCase().includes(query)
    );
  }, [hotelsData, searchQuery]);

  const handleAdd = async (data: Omit<HotelOffer, 'id'> & { rooms?: Array<any> }, imagesToDelete: string[]) => {
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
        await updateHotelOffers(formData);
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
    formData.append('id', editingHotel.id.toString());
  
    startTransition(async () => {
      try {
        await updateHotelOffers(formData);
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
        formData.append('id', deletingHotel.id.toString());
        formData.append('action', 'delete');
        
        await updateHotelOffers(formData);
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
            placeholder="Search by hotel name, location, or city code..."
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
              <div className="relative w-full md:w-1/3 h-48 md:h-auto">
                {hotel.images && hotel.images.length > 0 ? (
                  <Image
                    src={hotel.images[0].original || hotel.images[0].thumbnail}
                    alt={hotel.images[0].alt || hotel.name}
                    fill
                    className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-t-lg md:rounded-l-lg md:rounded-t-none">
                    <Building className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <Badge 
                  className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm"
                  variant="secondary"
                >
                  {hotel.type}
                </Badge>
                {hotel.sponsored && (
                  <Badge 
                    className="absolute top-2 left-2 bg-blue-500 text-white"
                    variant="secondary"
                  >
                    Sponsored
                  </Badge>
                )}
              </div>

              {/* Content Section */}
              <div className="flex-1 p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{hotel.name}</h3>
                      {hotel.brand?.name && (
                        <Badge variant="outline" className="text-xs">
                          {hotel.brand.name}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {hotel.location.address}
                      {hotel.location.cityCode && (
                        <span className="ml-1">({hotel.location.cityCode})</span>
                      )}
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

                {/* Details Grid */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="h-4 w-4 mr-2 text-yellow-400" />
                    {hotel.hotelClass} Stars
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {hotel.checkIn} - {hotel.checkOut}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Home className="h-4 w-4 mr-2" />
                    {hotel.availableRooms} rooms left
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <BadgeCheck className="h-4 w-4 mr-2" />
                    {hotel.rating.overall.toFixed(1)} ({hotel.rating.totalReviews})
                  </div>
                </div>

                {/* Price Section */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500">
                      {hotel.refundable ? 'Refundable' : 'Non-refundable'}
                    </div>
                    {hotel.price.discount && (
                      <Badge variant="destructive" className="text-xs">
                        {hotel.price.discount.label} - {hotel.price.discount.percentage}% OFF
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    {hotel.price.original && hotel.price.original > hotel.price.current && (
                      <div className="text-sm text-gray-500 line-through">
                        {hotel.price.currency} {hotel.price.original.toLocaleString()}
                      </div>
                    )}
                    <div className="text-lg font-semibold">
                      {hotel.price.currency} {hotel.price.current.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="mt-4 flex flex-wrap gap-2">
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

                {/* Badges and Meta */}
                {hotel.badges && (hotel.badges?.length > 0 || hotel.meta?.dealDescription) && (
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {hotel.badges?.map((badge, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {badge}
                      </Badge>
                    ))}
                    {hotel.meta?.dealDescription && (
                      <Badge variant="secondary" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {hotel.meta.dealDescription}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Nearby Places */}
                {hotel.nearbyPlaces && hotel.nearbyPlaces.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium">Nearby Places</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {hotel.nearbyPlaces.map((place, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded"
                        >
                          <div>
                            <div className="font-medium">{place.name}</div>
                            <div className="text-xs text-gray-500">
                              {place.transportations[0].type} • {place.transportations[0].duration}
                            </div>
                          </div>
                          {place.rating && (
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-400 mr-1" />
                              <span className="text-xs">{place.rating}</span>
                            </div>
                          )}
                        </div>
                      ))}
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
        <DialogContent className="max-w-4xl">
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
        <DialogContent className="max-w-4xl">
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