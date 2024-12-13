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
import { updateHotels } from '@/lib/action';
import UploadImage from '../UploadImage';
import { useDashboard } from '@/hooks/useDashboard';

interface Hotel {
  _id: string;
  name: string;
  iata: string;
  hotelId: string;
  images: string[];
}

type HotelFormData = Omit<Hotel, '_id'>;

const initialFormState: HotelFormData = {
  name: "",
  iata: "",
  hotelId: "",
  images: [] as string[]
};

const HotelForm = ({ 
  initialData,
  onSubmit,
  onCancel,
  isLoading 
}: {
  initialData: HotelFormData;
  onSubmit: (data: HotelFormData, imagesToDelete: string[]) => void;
  onCancel: () => void;
  isLoading: boolean;
}) => {
  const initialImages = initialData?.images ?? [];
  const [formData, setFormData] = useState({
    ...initialData,
    images: initialImages
  });
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<string[]>(initialImages);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  useEffect(() => {
    if (uploadedImage) {
      setUploadedImages(prev => [...(prev || []), uploadedImage]);
      setUploadedImage('');
    }
  }, [uploadedImage]);

  const handleChange = (field: keyof HotelFormData, value: any) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: field === 'iata' ? value.toUpperCase() : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      images: uploadedImages || []
    }, imagesToDelete);
  };

  const handleCancel = () => {
    setImagesToDelete([]);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <UploadImage
          uploadedImages={uploadedImages}
          setUploadedImage={setUploadedImage}
          multiple={true}
          maxFiles={5}
          onRemove={(index) => {
            const imageToDelete = uploadedImages[index];
            setUploadedImages(prev => (prev || []).filter((_, i) => i !== index));
            if (imageToDelete && initialImages.includes(imageToDelete)) {
              setImagesToDelete(prev => [...prev, imageToDelete]);
            }
          }}
        />

        <div className="grid gap-2">
          <label className="text-sm font-medium">Hotel Name</label>
          <Input
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter hotel name"
            disabled={isLoading}
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">IATA Code</label>
          <Input
            value={formData.iata}
            onChange={(e) => handleChange('iata', e.target.value)}
            placeholder="Enter IATA code"
            maxLength={3}
            className="uppercase"
            disabled={isLoading}
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Hotel ID</label>
          <Input
            value={formData.hotelId}
            onChange={(e) => handleChange('hotelId', e.target.value)}
            placeholder="Enter hotel ID"
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

export default function Hotels() {
  const { hotels, getHotels, isLoading: isDataLoading, deleteImages } = useDashboard();
  const [isPending, startTransition] = useTransition();
  const [hotelsData, setHotelsData] = useState<Hotel[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [deletingHotel, setDeletingHotel] = useState<Hotel | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    getHotels();
  }, []);

  useEffect(() => {
    if (hotels) {
      const processedHotels = hotels.map(hotel => ({
        ...hotel,
        images: hotel.images || []
      }));
      setHotelsData(processedHotels);
    }
  }, [hotels]);

  const filteredHotels = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return hotelsData.filter(hotel => 
      hotel.name.toLowerCase().includes(query) ||
      hotel.iata.toLowerCase().includes(query) ||
      hotel.hotelId.toLowerCase().includes(query)
    );
  }, [hotelsData, searchQuery]);

  const handleAdd = async (data: HotelFormData, imagesToDelete: string[]) => {
    setIsProcessing(true);
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'images') {
        const imagesArray = Array.isArray(value) ? value : [];
        formData.append('images', JSON.stringify(imagesArray));
      } else {
        formData.append(key, value?.toString() || '');
      }
    });

    startTransition(async () => {
      try {
        await updateHotels(formData);
        if (imagesToDelete.length > 0) {
          deleteImages(imagesToDelete);
        }
        await getHotels();
        setIsAddDialogOpen(false);
      } catch (error) {
        console.error('Failed to add hotel:', error);
      } finally {
        setIsProcessing(false);
      }
    });
  };

  const handleEdit = (hotel: Hotel) => {
    setEditingHotel({
      ...hotel,
      images: hotel.images || []
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (data: HotelFormData, imagesToDelete: string[]) => {
    if (!editingHotel) return;
    setIsProcessing(true);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'images') {
        const imagesArray = Array.isArray(value) ? value : [];
        formData.append('images', JSON.stringify(imagesArray));
      } else {
        formData.append(key, value?.toString() || '');
      }
    });
    formData.append('_id', editingHotel._id.toString());

    startTransition(async () => {
      try {
        await updateHotels(formData);
        if (imagesToDelete.length > 0) {
          deleteImages(imagesToDelete);
        }
        await getHotels();
        setIsEditDialogOpen(false);
        setEditingHotel(null);
      } catch (error) {
        console.error('Failed to update hotel:', error);
      } finally {
        setIsProcessing(false);
      }
    });
  };

  const handleDelete = (hotel: Hotel) => {
    setDeletingHotel({
      ...hotel,
      images: hotel.images || []
    });
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingHotel) return;
    setIsProcessing(true);

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('_id', deletingHotel._id.toString());
        formData.append('action', 'delete');
        
        await updateHotels(formData);
        if (deletingHotel.images.length > 0) {
          deleteImages(deletingHotel.images);
        }
        await getHotels();
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
            placeholder="Search by hotel name, IATA code, or hotel ID..."
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
        {filteredHotels.map((hotel) => (
          <div
            key={hotel._id}
            className="flex items-center justify-between p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">{hotel.name}</span>
              <div className="flex gap-4 text-sm text-gray-500">
                <span>IATA: {hotel.iata}</span>
                <span>Hotel ID: {hotel.hotelId}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
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
        ))}

        {filteredHotels.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No hotels found matching your criteria
          </div>
        )}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl" onClose={() => setIsAddDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Add New Hotel</DialogTitle>
            <DialogDescription>
              Enter the hotel details below
            </DialogDescription>
          </DialogHeader>
          <HotelForm
            initialData={initialFormState}
            onSubmit={handleAdd}
            onCancel={() => setIsAddDialogOpen(false)}
            isLoading={isProcessing}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl" onClose={() => setIsEditDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Edit Hotel</DialogTitle>
            <DialogDescription>
              Update the hotel details
            </DialogDescription>
          </DialogHeader>
          {editingHotel && (
            <HotelForm
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