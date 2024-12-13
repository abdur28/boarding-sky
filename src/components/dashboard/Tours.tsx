'use client';

import React, { useState, useMemo, useTransition, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Search,
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Star, 
  Pencil, 
  Trash2, 
  Plus,
  CircleIcon,
  ScrollText,
  Loader2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { updateTours } from '@/lib/action';
import UploadImage from '../UploadImage';
import { useDashboard } from '@/hooks/useDashboard';
import Image from 'next/image';

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
}

interface Tour {
  _id: string;
  name: string;
  destination: string;
  days: number;
  tourId: string;
  price: number;
  details: string;
  images: string[];
  highlights: string[];
  itinerary: ItineraryDay[];
  included: string[];
  notIncluded: string[];
  departure: string;
  maxGroupSize: number;
  minAge: number;
  difficulty: "Easy" | "Moderate" | "Challenging";
  rating: number;
  reviewCount: number;
}

type TourFormData = Omit<Tour, '_id'>;

const initialFormState: TourFormData = {
  name: "",
  destination: "",
  days: 1,
  tourId: "",
  price: 0,
  details: "",
  images: [],
  highlights: [],
  itinerary: [],
  included: [],
  notIncluded: [],
  departure: "Every Monday",
  maxGroupSize: 12,
  minAge: 0,
  difficulty: "Moderate",
  rating: 0,
  reviewCount: 0
};

interface DynamicListInputProps {
  items: string[];
  onChange: (newItems: string[]) => void;
  placeholder: string;
  label: string;
  disabled?: boolean;
}

const DynamicListInput = ({ items, onChange, placeholder, label, disabled }: DynamicListInputProps) => {
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    if (newItem.trim()) {
      onChange([...items, newItem.trim()]);
      setNewItem("");
    }
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input 
              value={item} 
              onChange={(e) => {
                const newItems = [...items];
                newItems[index] = e.target.value;
                onChange(newItems);
              }}
              disabled={disabled}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeItem(index)}
              disabled={disabled}
            >
              Remove
            </Button>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
          />
          <Button
            type="button"
            onClick={addItem}
            disabled={disabled || !newItem.trim()}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

interface ItineraryInputProps {
  itinerary: ItineraryDay[];
  onChange: (newItinerary: ItineraryDay[]) => void;
  disabled?: boolean;
}

const ItineraryInput = ({ itinerary, onChange, disabled }: ItineraryInputProps) => {
  const addDay = () => {
    const newDay = {
      day: itinerary.length + 1,
      title: "",
      description: "",
      activities: []
    };
    onChange([...itinerary, newDay]);
  };

  const removeDay = (index: number) => {
    onChange(itinerary.filter((_, i) => i !== index));
  };

  const updateDay = (index: number, field: keyof ItineraryDay, value: any) => {
    const newItinerary = [...itinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    onChange(newItinerary);
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium">Itinerary</label>
      {itinerary.map((day, index) => (
        <div key={index} className="border p-4 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Day {day.day}</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeDay(index)}
              disabled={disabled}
            >
              Remove Day
            </Button>
          </div>
          <Input
            value={day.title}
            onChange={(e) => updateDay(index, 'title', e.target.value)}
            placeholder="Day title"
            disabled={disabled}
          />
          <Textarea
            value={day.description}
            onChange={(e) => updateDay(index, 'description', e.target.value)}
            placeholder="Day description"
            disabled={disabled}
          />
          <DynamicListInput
            items={day.activities}
            onChange={(newActivities) => updateDay(index, 'activities', newActivities)}
            placeholder="Add activity"
            label="Activities"
            disabled={disabled}
          />
        </div>
      ))}
      <Button
        type="button"
        onClick={addDay}
        className="w-full"
        disabled={disabled}
      >
        Add Day
      </Button>
    </div>
  );
};

const TourForm = ({ 
  initialData,
  onSubmit,
  onCancel,
  isLoading 
}: {
  initialData: TourFormData;
  onSubmit: (data: TourFormData, imagesToDelete: string[]) => void;
  onCancel: () => void;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState(initialData);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<string[]>(initialData.images);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  useEffect(() => {
    if (uploadedImage) {
      setUploadedImages(prev => [...prev, uploadedImage]);
      setUploadedImage('');
    }
  }, [uploadedImage]);

  const handleChange = (field: keyof TourFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit({ ...formData, images: uploadedImages }, imagesToDelete);
    }}>
      <div className="grid gap-6 py-4 ">
        <UploadImage
          uploadedImages={uploadedImages}
          setUploadedImage={setUploadedImage}
          multiple={true}
          maxFiles={5}
          onRemove={(index) => {
            const imageToDelete = uploadedImages[index];
            setUploadedImages(prev => prev.filter((_, i) => i !== index));
            if (imageToDelete && initialData.images.includes(imageToDelete)) {
              setImagesToDelete(prev => [...prev, imageToDelete]);
            }
          }}
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Tour Name</label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Destination</label>
            <Input
              value={formData.destination}
              onChange={(e) => handleChange('destination', e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Days</label>
            <Input
              type="number"
              min="1"
              value={formData.days}
              onChange={(e) => handleChange('days', parseInt(e.target.value))}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Tour ID</label>
            <Input
              value={formData.tourId}
              onChange={(e) => handleChange('tourId', e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Price</label>
            <Input
              type="number"
              min="0"
              value={formData.price}
              onChange={(e) => handleChange('price', parseFloat(e.target.value))}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
        <div className="grid gap-2">
            <label className="text-sm font-medium">Difficulty</label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) => handleChange('difficulty', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Moderate">Moderate</SelectItem>
                <SelectItem value="Challenging">Challenging</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Max Group Size</label>
            <Input
              type="number"
              min="1"
              value={formData.maxGroupSize}
              onChange={(e) => handleChange('maxGroupSize', parseInt(e.target.value))}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Minimum Age</label>
            <Input
              type="number"
              min="0"
              value={formData.minAge}
              onChange={(e) => handleChange('minAge', parseInt(e.target.value))}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Rating</label>
            <Input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={(e) => handleChange('rating', parseFloat(e.target.value))}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Review Count</label>
            <Input
              type="number"
              min="0"
              value={formData.reviewCount}
              onChange={(e) => handleChange('reviewCount', parseInt(e.target.value))}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Departure</label>
            <Input
              value={formData.departure}
              onChange={(e) => handleChange('departure', e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Details</label>
          <Textarea
            value={formData.details}
            onChange={(e) => handleChange('details', e.target.value)}
            className="min-h-[100px]"
            disabled={isLoading}
          />
        </div>

        <DynamicListInput
          items={formData.highlights}
          onChange={(newHighlights) => handleChange('highlights', newHighlights)}
          placeholder="Add highlight"
          label="Highlights"
          disabled={isLoading}
        />

        <ItineraryInput
          itinerary={formData.itinerary}
          onChange={(newItinerary) => handleChange('itinerary', newItinerary)}
          disabled={isLoading}
        />

        <DynamicListInput
          items={formData.included}
          onChange={(newIncluded) => handleChange('included', newIncluded)}
          placeholder="Add included item"
          label="Included"
          disabled={isLoading}
        />

        <DynamicListInput
          items={formData.notIncluded}
          onChange={(newNotIncluded) => handleChange('notIncluded', newNotIncluded)}
          placeholder="Add not included item"
          label="Not Included"
          disabled={isLoading}
        />
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
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

export default function Tours() {
  const { tours, getTours, isLoading: isDataLoading, deleteImages } = useDashboard();
  const [isPending, startTransition] = useTransition();
  const [toursData, setToursData] = useState<Tour[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [deletingTour, setDeletingTour] = useState<Tour | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    getTours();
  }, []);

  useEffect(() => {
    if (tours) {
      const processedTours = tours.map((tour: any) => ({
        ...tour,
        images: tour.images || []
      }));
      setToursData(processedTours);
    }
  }, [tours]);

  const filteredTours = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return toursData.filter(tour => 
      tour.name.toLowerCase().includes(query) ||
      tour.destination.toLowerCase().includes(query) ||
      tour.tourId.toLowerCase().includes(query)
    );
  }, [toursData, searchQuery]);

  const handleAdd = async (data: TourFormData, imagesToDelete: string[]) => {
    setIsProcessing(true);
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value) || typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value?.toString() || '');
      }
    });
  
    startTransition(async () => {
      try {
        await updateTours(formData);
        if (imagesToDelete.length > 0) {
          deleteImages(imagesToDelete);
        }
        await getTours();
        setIsAddDialogOpen(false);
      } catch (error) {
        console.error('Failed to add tour:', error);
      } finally {
        setIsProcessing(false);
      }
    });
  };
  
  const handleUpdate = async (data: TourFormData, imagesToDelete: string[]) => {
    if (!editingTour) return;
    setIsProcessing(true);
  
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value) || typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value?.toString() || '');
      }
    });
    formData.append('_id', editingTour._id.toString());
  
    startTransition(async () => {
      try {
        await updateTours(formData);
        if (imagesToDelete.length > 0) {
          deleteImages(imagesToDelete);
        }
        await getTours();
        setIsEditDialogOpen(false);
        setEditingTour(null);
      } catch (error) {
        console.error('Failed to update tour:', error);
      } finally {
        setIsProcessing(false);
      }
    });
  };
  const handleEdit = (tour: Tour) => {
    setEditingTour({
      ...tour,
      images: tour.images || []
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (tour: Tour) => {
    setDeletingTour({
      ...tour,
      images: tour.images || []
    });
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingTour) return;
    setIsProcessing(true);

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('_id', deletingTour._id.toString());
        formData.append('action', 'delete');
        
        await updateTours(formData);
        if (deletingTour.images.length > 0) {
          deleteImages(deletingTour.images);
        }
        await getTours();
        setIsDeleteDialogOpen(false);
        setDeletingTour(null);
      } catch (error) {
        console.error('Failed to delete tour:', error);
      } finally {
        setIsProcessing(false);
      }
    });
  };

  if (isDataLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Loading tours...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by tour name, destination, or tour ID..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Tour
        </Button>
      </div>

      <div className="grid gap-4">
      {filteredTours.map(tour => (
        <div
          key={tour._id}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="relative w-full md:w-48 h-48 md:h-auto">
              {tour.images && tour.images.length > 0 ? (
                <Image
                  src={tour.images[0]}
                  alt={tour.name}
                  fill
                  className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-t-lg md:rounded-l-lg md:rounded-t-none">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <Badge 
                className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm"
                variant="secondary"
              >
                {tour.difficulty || 'Moderate'}
              </Badge>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{tour.name}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {tour.destination}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => handleEdit(tour)}
                    variant="ghost"
                    size="icon"
                    disabled={isProcessing}
                  >
                    <Pencil className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(tour)}
                    variant="ghost"
                    size="icon"
                    disabled={isProcessing}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>

              {/* Tour Details Grid */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  {tour.days} days
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  Max {tour.maxGroupSize || 12} people
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2" />
                  ${tour.price.toLocaleString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {tour.departure || 'Flexible'}
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">{tour.rating || '0.0'}</span>
                  <span className="text-gray-500 ml-1">
                    ({tour.reviewCount || 0} reviews)
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CircleIcon className="h-4 w-4 mr-1" />
                  Min age: {tour.minAge || 0}+
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ScrollText className="h-4 w-4 mr-1" />
                  ID: {tour.tourId}
                </div>
              </div>

              {/* Highlights Preview */}
              {tour.highlights && tour.highlights.length > 0 && (
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {tour.highlights.slice(0, 3).map((highlight, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                    {tour.highlights.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{tour.highlights.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {filteredTours.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No tours found matching your criteria
        </div>
      )}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl" onClose={() => setIsAddDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Add New Tour</DialogTitle>
            <DialogDescription>
              Enter the tour details below
            </DialogDescription>
          </DialogHeader>
          <TourForm
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
            <DialogTitle>Edit Tour</DialogTitle>
            <DialogDescription>
              Update the tour details
            </DialogDescription>
          </DialogHeader>
          {editingTour && (
            <TourForm
              initialData={editingTour}
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
            <AlertDialogTitle>Delete Tour</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingTour?.name}? 
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