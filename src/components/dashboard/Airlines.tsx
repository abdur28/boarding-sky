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
import { updateAirlines } from '@/lib/action';
import UploadImage from '../UploadImage';
import { useDashboard } from '@/hooks/useDashboard';

interface Airline {
  _id: string;
  name: string;
  iata: string;
  logo: string;
}

type AirlineFormData = Omit<Airline, '_id'>;

const initialFormState: AirlineFormData = {
  name: "",
  iata: "",
  logo: "/placeholder-image.png"
};

const AirlineForm = ({ 
  initialData,
  onSubmit,
  onCancel,
  isLoading 
}: {
  initialData: AirlineFormData;
  onSubmit: (data: AirlineFormData, imageToDelete?: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState(initialData);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [imageToDelete, setImageToDelete] = useState<string | undefined>();

  useEffect(() => {
    if (uploadedImage) {
      if (formData.logo !== '/placeholder-image.png' && formData.logo !== uploadedImage) {
        setImageToDelete(formData.logo);
      }
      setFormData(prev => ({
        ...prev,
        logo: uploadedImage
      }));
      setUploadedImage('');
    }
  }, [uploadedImage]);

  const handleChange = (field: keyof AirlineFormData, value: any) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: field === 'iata' ? value.toUpperCase() : value 
    }));
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
            uploadedImages={[formData.logo]}
            setUploadedImage={setUploadedImage}
            multiple={false}
            maxFiles={1}
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Airline Name</label>
          <Input
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter airline name"
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

export default function Airlines() {
  const { airlines, getAirlines, isLoading: isDataLoading, deleteImages } = useDashboard();
  const [isPending, startTransition] = useTransition();
  const [airlinesData, setAirlinesData] = useState<Airline[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingAirline, setEditingAirline] = useState<Airline | null>(null);
  const [deletingAirline, setDeletingAirline] = useState<Airline | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    getAirlines();
  }, []);

  useEffect(() => {
    if (airlines) {
      const processedAirlines = airlines.map(airline => ({
        ...airline,
        logo: airline.logo || '/placeholder-image.png'
      }));
      setAirlinesData(processedAirlines);
    }
  }, [airlines]);

  const filteredAirlines = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return airlinesData.filter(airline => 
      airline.name.toLowerCase().includes(query) ||
      airline.iata.toLowerCase().includes(query)
    );
  }, [airlinesData, searchQuery]);

  const handleAdd = async (data: AirlineFormData, imageToDelete?: string) => {
    setIsProcessing(true);
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value?.toString() || '');
    });

    startTransition(async () => {
      try {
        await updateAirlines(formData);
        if (imageToDelete) {
          deleteImages([imageToDelete]);
        }
        await getAirlines();
        setIsAddDialogOpen(false);
      } catch (error) {
        console.error('Failed to add airline:', error);
      } finally {
        setIsProcessing(false);
      }
    });
  };

  const handleEdit = (airline: Airline) => {
    setEditingAirline({
      ...airline,
      logo: airline.logo || '/placeholder-image.png'
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (data: AirlineFormData, imageToDelete?: string) => {
    if (!editingAirline) return;
    setIsProcessing(true);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value?.toString() || '');
    });
    formData.append('_id', editingAirline._id.toString());

    startTransition(async () => {
      try {
        await updateAirlines(formData);
        if (imageToDelete) {
          deleteImages([imageToDelete]);
        }
        await getAirlines();
        setIsEditDialogOpen(false);
        setEditingAirline(null);
      } catch (error) {
        console.error('Failed to update airline:', error);
      } finally {
        setIsProcessing(false);
      }
    });
  };

  const handleDelete = (airline: Airline) => {
    setDeletingAirline({
      ...airline,
      logo: airline.logo || '/placeholder-image.png'
    });
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingAirline) return;
    setIsProcessing(true);

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('_id', deletingAirline._id.toString());
        formData.append('action', 'delete');
        
        await updateAirlines(formData);
        if (deletingAirline.logo !== '/hero.png') {
          deleteImages([deletingAirline.logo]);
        }
        await getAirlines();
        setIsDeleteDialogOpen(false);
        setDeletingAirline(null);
      } catch (error) {
        console.error('Failed to delete airline:', error);
      } finally {
        setIsProcessing(false);
      }
    });
  };

  if (isDataLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Loading airlines...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by airline name or IATA code..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Airline
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredAirlines.map(airline => (
          <div
            key={airline._id}
            className="flex items-center justify-between p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <img
                src={airline.logo}
                alt={`${airline.name} logo`}
                className="w-12 h-12 rounded-full object-cover bg-gray-100"
              />
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">{airline.name}</span>
                <span className="text-sm text-gray-500">IATA: {airline.iata}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => handleEdit(airline)}
                variant="ghost"
                size="icon"
                disabled={isProcessing}
              >
                <Pencil className="h-4 w-4 text-gray-500" />
              </Button>
              <Button
                onClick={() => handleDelete(airline)}
                variant="ghost"
                size="icon"
                disabled={isProcessing}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}

        {filteredAirlines.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No airlines found matching your criteria
          </div>
        )}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md" onClose={() => setIsAddDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Add New Airline</DialogTitle>
            <DialogDescription>
              Enter the airline details below
            </DialogDescription>
          </DialogHeader>
          <AirlineForm
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
            <DialogTitle>Edit Airline</DialogTitle>
            <DialogDescription>
              Update the airline details
            </DialogDescription>
          </DialogHeader>
          {editingAirline && (
            <AirlineForm
              initialData={editingAirline}
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
            <AlertDialogTitle>Delete Airline</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingAirline?.name}? 
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