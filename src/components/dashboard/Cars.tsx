import React, { useState, useMemo, useTransition, useEffect } from 'react';
import { Search, Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { updateCars } from '@/lib/action';
import UploadImage from '../UploadImage';
import { useDashboard } from '@/hooks/useDashboard';

interface Car {
  _id: string;
  carId: string;
  brand: string;
  model: string;
  image: string;
}

type CarFormData = Omit<Car, '_id'>;

const initialFormState: CarFormData = {
  carId: "",
  brand: "",
  model: "",
  image: "/placeholder-image.png"
};

const CarForm = ({ 
  initialData,
  onSubmit,
  onCancel,
  isLoading 
}: {
  initialData: CarFormData;
  onSubmit: (data: CarFormData, imageToDelete?: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState(initialData);
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

  const handleChange = (field: keyof CarFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, imageToDelete);
  };

  const handleCancel = () => {
    setImageToDelete(undefined);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit}>
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
          <label className="text-sm font-medium">Car ID</label>
          <Input
            value={formData.carId}
            onChange={(e) => handleChange('carId', e.target.value)}
            placeholder="Enter car ID"
            disabled={isLoading}
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Brand</label>
          <Input
            value={formData.brand}
            onChange={(e) => handleChange('brand', e.target.value)}
            placeholder="Enter car brand"
            disabled={isLoading}
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Model</label>
          <Input
            value={formData.model}
            onChange={(e) => handleChange('model', e.target.value)}
            placeholder="Enter car model"
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
            'Submit'
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default function Cars() {
  const { cars, getCars, isLoading: isDataLoading, deleteImages } = useDashboard();
  const [isPending, startTransition] = useTransition();
  const [carsData, setCarsData] = useState<Car[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [deletingCar, setDeletingCar] = useState<Car | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    getCars();
  }, []);

  useEffect(() => {
    if (cars) {
      const processedCars = cars.map((car: any) => ({
        ...car,
        image: car.image || '/placeholder-image.png'
      }));
      setCarsData(processedCars);
    }
  }, [cars]);

  const filteredCars = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return carsData.filter(car => 
      car.brand.toLowerCase().includes(query) ||
      car.model.toLowerCase().includes(query) ||
      car.carId.toLowerCase().includes(query)
    );
  }, [carsData, searchQuery]);

  const handleAdd = async (data: CarFormData, imageToDelete?: string) => {
    setIsProcessing(true);
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value?.toString() || '');
    });

    startTransition(async () => {
      try {
        await updateCars(formData);
        if (imageToDelete) {
          deleteImages([imageToDelete]);
        }
        await getCars();
        setIsAddDialogOpen(false);
      } catch (error) {
        console.error('Failed to add car:', error);
      } finally {
        setIsProcessing(false);
      }
    });
  };

  const handleEdit = (car: Car) => {
    setEditingCar({
      ...car,
      image: car.image || '/placeholder-image.png'
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (data: CarFormData, imageToDelete?: string) => {
    if (!editingCar) return;
    setIsProcessing(true);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value?.toString() || '');
    });
    formData.append('_id', editingCar._id.toString());

    startTransition(async () => {
      try {
        await updateCars(formData);
        if (imageToDelete) {
          deleteImages([imageToDelete]);
        }
        await getCars();
        setIsEditDialogOpen(false);
        setEditingCar(null);
      } catch (error) {
        console.error('Failed to update car:', error);
      } finally {
        setIsProcessing(false);
      }
    });
  };

  const handleDelete = (car: Car) => {
    setDeletingCar({
      ...car,
      image: car.image || '/placeholder-image.png'
    });
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingCar) return;
    setIsProcessing(true);

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('_id', deletingCar._id.toString());
        formData.append('action', 'delete');
        
        await updateCars(formData);
        if (deletingCar.image !== '/placeholder-image.png') {
          deleteImages([deletingCar.image]);
        }
        await getCars();
        setIsDeleteDialogOpen(false);
        setDeletingCar(null);
      } catch (error) {
        console.error('Failed to delete car:', error);
      } finally {
        setIsProcessing(false);
      }
    });
  };

  if (isDataLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Loading cars...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by brand, model, or car ID..."
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
        {filteredCars.map(car => (
          <div
            key={car._id}
            className="flex flex-row md:flex-row gap-4 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-24 h-24">
              <img
                src={car.image}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <div className="flex flex-col flex-1 justify-between">
              <div>
                <h3 className="text-xl font-medium text-gray-900">
                  {car.brand} {car.model}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Car ID: {car.carId}
                </p>
              </div>
              <div className="flex justify-end space-x-4 mt-4 md:mt-0">
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
          </div>
        ))}

        {filteredCars.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No cars found matching your criteria
          </div>
        )}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md" onClose={() => setIsAddDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Add New Car</DialogTitle>
            <DialogDescription>
              Enter the car details below
            </DialogDescription>
          </DialogHeader>
          <CarForm
            initialData={initialFormState}
            onSubmit={handleAdd}
            onCancel={() => setIsAddDialogOpen(false)}
            isLoading={isProcessing}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md" onClose={() => setIsEditDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Edit Car</DialogTitle>
            <DialogDescription>
              Update the car details
            </DialogDescription>
          </DialogHeader>
          {editingCar && (
            <CarForm
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
              Are you sure you want to delete {deletingCar?.brand} {deletingCar?.model}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}
            onCancel={() => setIsDeleteDialogOpen(false)}
            >Cancel</AlertDialogCancel>
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