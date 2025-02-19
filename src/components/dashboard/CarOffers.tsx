import React, { useState, useMemo, useTransition, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Car,
  Search,
  MapPin,
  Star,
  DollarSign,
  Users,
  Pencil,
  Trash2,
  Plus,
  Loader2,
  Calendar,
  Fuel,
  GaugeCircle,
  CarFront,
  CreditCard,
  Settings,
  Info
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
import { updateCarOffers } from '@/lib/action';
import { useDashboard } from '@/hooks/useDashboard';
import { CarOffer } from '@/types';
import Image from 'next/image';
import CarOfferForm from '../forms/CarOfferForm';

const initialFormState: Omit<CarOffer, 'id'> = {
  provider: 'direct',
  status: 'available',
  name: '',
  model: '',
  brand: '',
  images: [],
  features: {
    transmission: 'automatic',
    airConditioning: true,
    doors: 4,
    seats: 5,
    baggageCapacity: {
      large: 2,
      small: 1
    },
    category: 'economy',
    fuelType: 'petrol',
    fuelPolicy: 'full_to_full'
  },
  pickupLocation: {
    id: '',
    name: '',
    type: 'airport',
    address: '',
    coordinates: {
      latitude: 0,
      longitude: 0
    }
  },
  dropoffLocation: {
    id: '',
    name: '',
    type: 'airport',
    address: '',
    coordinates: {
      latitude: 0,
      longitude: 0
    }
  },
  pickupDateTime: '',
  dropoffDateTime: '',
  price: {
    amount: 0,
    currency: 'USD',
    breakdown: {
      baseRate: 0,
      taxes: 0,
      fees: 0,
      insurance: 0,
      extras: 0
    },
    includesTaxes: true,
    includesInsurance: false
  },
  insurance: [{
    type: 'basic',
    coverage: {
      collision: true,
      theft: true,
      thirdParty: true,
      personal: false
    },
    excess: {
      amount: 1000,
      currency: 'USD'
    }
  }],
  vendor: {
    id: '',
    name: '',
    logo: '',
    rating: 0,
    reviewCount: 0
  },
  agent: {
    id: '',
    name: '',
    logo: '',
    type: 'vendor',
    rating: 0,
    reviewCount: 0
  },
  mileage: {
    limit: 1000,
    unlimited: false,
    unit: 'km'
  },
  requiredDocuments: [],
  restrictions: {
    minAge: 21,
    maxAge: 75,
    minLicenseHeld: 1,
    requiredCreditCard: true
  }
};

export default function CarOffers() {
  const { carOffers, getCarOffers, isLoading: isDataLoading, deleteImages } = useDashboard();
  const [isPending, startTransition] = useTransition();
  const [carsData, setCarsData] = useState<CarOffer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<CarOffer | null>(null);
  const [deletingCar, setDeletingCar] = useState<CarOffer | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    getCarOffers();
  }, []);

  useEffect(() => {
    if (carOffers) {
      setCarsData(carOffers);
    }
  }, [carOffers]);

  const filteredCars = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return carsData.filter(car => 
      car.name.toLowerCase().includes(query) ||
      car.brand?.toLowerCase().includes(query) ||
      car.model?.toLowerCase().includes(query) ||
      car.pickupLocation.name.toLowerCase().includes(query)
    );
  }, [carsData, searchQuery]);

  const handleAdd = async (data: Omit<CarOffer, 'id'>, imagesToDelete: string[]) => {
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
        await updateCarOffers(formData);
        if (imagesToDelete.length > 0) {
          await deleteImages(imagesToDelete);
        }
        await getCarOffers();
        setIsAddDialogOpen(false);
      } catch (error) {
        console.error('Failed to add car offer:', error);
      } finally {
        setIsProcessing(false);
      }
    });
  };

  const handleUpdate = async (data: Omit<CarOffer, 'id'>, imagesToDelete: string[]) => {
    if (!editingCar) return;
    setIsProcessing(true);
  
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value?.toString() || '');
      }
    });
    formData.append('id', editingCar.id.toString());
  
    startTransition(async () => {
      try {
        await updateCarOffers(formData);
        if (imagesToDelete.length > 0) {
          await deleteImages(imagesToDelete);
        }
        await getCarOffers();
        setIsEditDialogOpen(false);
        setEditingCar(null);
      } catch (error) {
        console.error('Failed to update car offer:', error);
      } finally {
        setIsProcessing(false);
      }
    });
  };

  const handleEdit = (car: CarOffer) => {
    setEditingCar(car);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (car: CarOffer) => {
    setDeletingCar(car);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingCar) return;
    setIsProcessing(true);

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('id', deletingCar.id.toString());
        formData.append('action', 'delete');
        
        await updateCarOffers(formData);
        if (deletingCar.images.length > 0) {
          await deleteImages(deletingCar.images.map(img => img.url));
        }
        await getCarOffers();
        setIsDeleteDialogOpen(false);
        setDeletingCar(null);
      } catch (error) {
        console.error('Failed to delete car offer:', error);
      } finally {
        setIsProcessing(false);
      }
    });
  };

  if (isDataLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Loading car offers...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by car name, brand, model or location..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Car
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredCars.map((car: CarOffer) => (
          <div
            key={car.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row">
              {/* Image Section */}
              <div className="relative w-full md:w-1/3 h-48 md:h-auto">
                {car.images && car.images.length > 0 ? (
                  <Image
                    src={car.images[0].url}
                    alt={car.images[0].alt || car.name}
                    fill
                    className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-t-lg md:rounded-l-lg md:rounded-t-none">
                    <CarFront className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <Badge 
                  className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm"
                  variant="secondary"
                >
                  {car.features.category}
                </Badge>
                <Badge 
                  className={`absolute top-2 left-2 ${
                    car.status === 'available' ? 'bg-green-500' : 
                    car.status === 'on_request' ? 'bg-yellow-500' : 'bg-red-500'
                  } text-white`}
                  variant="secondary"
                >
                  {car.status}
                </Badge>
              </div>

              {/* Content Section */}
              <div className="flex-1 p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{car.name}</h3>
                      {car.vendor?.logo && (
                        <img
                          src={car.vendor.logo}
                          alt={car.vendor.name}
                          width={20}
                          height={20}
                          className="h-5 w-auto"
                        />
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Car className="h-4 w-4 mr-1" />
                      {car.brand} {car.model}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => handleEdit(car)}
                      variant="ghost"
                      size="icon"
                      disabled={isProcessing}
                    >
                      <Pencil className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(car)}
                      variant="ghost"
                      size="icon"
                      disabled={isProcessing}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                {/* Car Details */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Settings className="h-4 w-4 mr-2" />
                    {car.features.transmission}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Fuel className="h-4 w-4 mr-2" />
                    {car.features.fuelType}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {car.features.seats} seats
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Info className="h-4 w-4 mr-2" />
                    {car.features.baggageCapacity.large + car.features.baggageCapacity.small} bags
                  </div>
                </div>

                {/* Location and Time */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {car.pickupLocation.name}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(car.pickupDateTime).toLocaleString()}
                  </div>
                </div>

                {/* Price and Features */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {car.vendor.rating && (
                      <div className="flex items-center text-sm">
                        <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium">{car.vendor.rating}</span>
                        <span className="text-gray-500 ml-1">
                          ({car.vendor.reviewCount})
                        </span>
                      </div>
                    )}
                    {car.features.airConditioning && (
                      <Badge variant="secondary" className="text-xs">
                        A/C
                      </Badge>
                    )}
                    {car.mileage?.unlimited ? (
                      <Badge variant="outline" className="text-xs">
                        Unlimited Mileage
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        {car.mileage?.limit} {car.mileage?.unit}
                      </Badge>
                    )}
                    {car.restrictions?.requiredCreditCard && (
                      <Badge variant="secondary" className="text-xs">
                        <CreditCard className="h-3 w-3 mr-1" />
                        Credit Card Required
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {car.price.currency} {car.price.amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {car.price.includesTaxes ? 'Includes taxes' : 'Taxes not included'}
                    </div>
                  </div>
                </div>

                {/* Insurance Info */}
                {car.insurance && car.insurance.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {car.insurance.map((ins, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {ins.type} Insurance
                          {ins.excess && ` - Excess: ${ins.excess.currency} ${ins.excess.amount}`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredCars.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No cars found matching your criteria
          </div>
        )}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Add New Car</DialogTitle>
            <DialogDescription>
              Enter the car rental details below
            </DialogDescription>
          </DialogHeader>
          <CarOfferForm
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
            <DialogTitle>Edit Car</DialogTitle>
            <DialogDescription>
              Update the car rental details
            </DialogDescription>
          </DialogHeader>
          {editingCar && (
            <CarOfferForm
              initialData={editingCar}
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
            <AlertDialogTitle>Delete Car</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingCar?.name}? 
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