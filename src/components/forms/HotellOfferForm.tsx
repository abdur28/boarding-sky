import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { HotelOffer, HotelImage, HotelLocation, HotelPrice, HotelRating, NearbyPlace } from '@/types';
import UploadImage from '../UploadImage';

interface DynamicListInputProps {
  items: string[];
  onChange: (newItems: string[]) => void;
  placeholder: string;
  label: string;
  disabled?: boolean;
}

interface RoomFormData {
  id: string;
  name: string;
  description?: string;
  maxOccupancy: number;
  amenities: string[];
  images: Array<{
    url: string;
    alt?: string;
  }>;
  price: {
    amount: number;
    currency: string;
    breakdown?: {
      baseRate: number;
      taxes: number;
      fees: number;
    };
  };
  cancellationPolicy?: {
    isCancellable: boolean;
    deadline?: string;
    penalties?: Array<{
      from: string;
      amount: number;
      currency: string;
    }>;
  };
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

const RoomForm = ({ 
  room, 
  onChange, 
  onRemove,
  isLoading 
}: {
  room: RoomFormData;
  onChange: (updatedRoom: RoomFormData) => void;
  onRemove: () => void;
  isLoading: boolean;
}) => {
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<string[]>(
    room.images.map(img => img.url)
  );

  useEffect(() => {
    if (uploadedImage) {
      const newImages = [...uploadedImages, uploadedImage];
      setUploadedImages(newImages);
      onChange({
        ...room,
        images: newImages.map(url => ({ url, alt: room.name }))
      });
      setUploadedImage('');
    }
  }, [uploadedImage]);

  return (
    <div className="border p-4 rounded-lg space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Room Details</h3>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onRemove}
          disabled={isLoading}
        >
          Remove Room
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Room Name</label>
          <Input
            value={room.name}
            onChange={(e) => onChange({ ...room, name: e.target.value })}
            disabled={isLoading}
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Max Occupancy</label>
          <Input
            type="number"
            min="1"
            value={room.maxOccupancy}
            onChange={(e) => onChange({ ...room, maxOccupancy: parseInt(e.target.value) })}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={room.description}
          onChange={(e) => onChange({ ...room, description: e.target.value })}
          disabled={isLoading}
        />
      </div>

      <UploadImage
        uploadedImages={uploadedImages}
        setUploadedImage={setUploadedImage}
        multiple={true}
        maxFiles={5}
        onRemove={(index) => {
          const newImages = uploadedImages.filter((_, i) => i !== index);
          setUploadedImages(newImages);
          onChange({
            ...room,
            images: newImages.map(url => ({ url, alt: room.name }))
          });
        }}
      />

      <div className="grid grid-cols-3 gap-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Base Price</label>
          <Input
            type="number"
            min="0"
            value={room.price.amount}
            onChange={(e) => onChange({
              ...room,
              price: {
                ...room.price,
                amount: parseFloat(e.target.value),
                breakdown: {
                  ...room.price.breakdown,
                  baseRate: parseFloat(e.target.value)
                } as any
              }
            })}
            disabled={isLoading}
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Taxes</label>
          <Input
            type="number"
            min="0"
            value={room.price.breakdown?.taxes || 0}
            onChange={(e) => {
              const taxes = parseFloat(e.target.value);
              const baseRate = room.price.breakdown?.baseRate || room.price.amount;
              const fees = room.price.breakdown?.fees || 0;
              onChange({
                ...room,
                price: {
                  ...room.price,
                  amount: baseRate + taxes + fees,
                  breakdown: {
                    baseRate,
                    taxes,
                    fees
                  }
                }
              });
            }}
            disabled={isLoading}
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Fees</label>
          <Input
            type="number"
            min="0"
            value={room.price.breakdown?.fees || 0}
            onChange={(e) => {
              const fees = parseFloat(e.target.value);
              const baseRate = room.price.breakdown?.baseRate || room.price.amount;
              const taxes = room.price.breakdown?.taxes || 0;
              onChange({
                ...room,
                price: {
                  ...room.price,
                  amount: baseRate + taxes + fees,
                  breakdown: {
                    baseRate,
                    taxes,
                    fees
                  }
                }
              });
            }}
            disabled={isLoading}
          />
        </div>
      </div>

      <DynamicListInput
        items={room.amenities}
        onChange={(newAmenities) => onChange({ ...room, amenities: newAmenities })}
        placeholder="Add room amenity"
        label="Room Amenities"
        disabled={isLoading}
      />

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Cancellable</label>
          <Select
            value={room.cancellationPolicy?.isCancellable?.toString() || "true"}
            onValueChange={(value) => onChange({
              ...room,
              cancellationPolicy: {
                ...room.cancellationPolicy,
                isCancellable: value === "true"
              }
            })}
            disabled={isLoading}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {room.cancellationPolicy?.isCancellable && (
          <div className="grid gap-2">
            <label className="text-sm font-medium">Cancellation Deadline</label>
            <Input
              type="datetime-local"
              value={room.cancellationPolicy.deadline}
              onChange={(e) => onChange({
                ...room,
                cancellationPolicy: {
                  ...room.cancellationPolicy,
                  deadline: e.target.value
                }
              } as any)}
              disabled={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface HotelOfferFormProps {
  initialData: Omit<HotelOffer, 'id'>;
  onSubmit: (data: Omit<HotelOffer, 'id'>, imagesToDelete: string[]) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const HotelOfferForm: React.FC<HotelOfferFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading
}) => {
  const [formData, setFormData] = useState<Omit<HotelOffer, 'id'>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<string[]>(
    initialData.images.map(img => img.original || img.thumbnail)
  );
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [rooms, setRooms] = useState<RoomFormData[]>([]);

  useEffect(() => {
    if (uploadedImage) {
      setUploadedImages(prev => [...prev, uploadedImage]);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, {
          thumbnail: uploadedImage,
          original: uploadedImage,
        }]
      }));
      setUploadedImage('');
    }
  }, [uploadedImage]);

  const handleChange = (field: keyof Omit<HotelOffer, 'id'>, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const addRoom = () => {
    const newRoom: RoomFormData = {
      id: `room-${Date.now()}`,
      name: '',
      description: '',
      maxOccupancy: 2,
      amenities: [],
      images: [],
      price: {
        amount: 0,
        currency: 'USD',
        breakdown: {
          baseRate: 0,
          taxes: 0,
          fees: 0
        }
      },
      cancellationPolicy: {
        isCancellable: true
      }
    };
    setRooms([...rooms, newRoom]);
  };

  const handleRoomChange = (index: number, updatedRoom: RoomFormData) => {
    const newRooms = [...rooms];
    newRooms[index] = updatedRoom;
    setRooms(newRooms);
  };

  const removeRoom = (index: number) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = 'Hotel name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.location.latitude) newErrors.latitude = 'Latitude is required';
    if (!formData.location.longitude) newErrors.longitude = 'Longitude is required';
    if (!formData.price.current) newErrors.price = 'Price is required';
    if (!formData.type) newErrors.type = 'Hotel type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const updatedFormData = {
        ...formData,
        images: uploadedImages.map(url => ({
          thumbnail: url,
          original: url,
        }))
      };
      onSubmit(updatedFormData, imagesToDelete);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Main Hotel Images */}
      <UploadImage
        uploadedImages={uploadedImages}
        setUploadedImage={setUploadedImage}
        multiple={true}
        maxFiles={5}
        onRemove={(index) => {
          const imageToDelete = uploadedImages[index];
          setUploadedImages(prev => prev.filter((_, i) => i !== index));
          if (imageToDelete && initialData.images.some(img => 
            img.original === imageToDelete || img.thumbnail === imageToDelete
          )) {
            setImagesToDelete(prev => [...prev, imageToDelete]);
          }
        }}
      />

      {/* Basic Information */}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Hotel Name</label>
          <Input
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            disabled={isLoading}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <span className="text-xs text-red-500">{errors.name}</span>
          )}
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Type</label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleChange('type', value)}
            disabled={isLoading}
          >
            <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hotel">Hotel</SelectItem>
              <SelectItem value="resort">Resort</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && (
            <span className="text-xs text-red-500">{errors.type}</span>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="grid gap-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className={`min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
          disabled={isLoading}
        />
        {errors.description && (
          <span className="text-xs text-red-500">{errors.description}</span>
        )}
      </div>

      {/* Check-in/Check-out Times */}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Check-in Time</label>
          <Input
            type="time"
            value={formData.checkIn}
            onChange={(e) => handleChange('checkIn', e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Check-out Time</label>
          <Input
            type="time"
            value={formData.checkOut}
            onChange={(e) => handleChange('checkOut', e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Location */}
      <div className="grid grid-cols-3 gap-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Latitude</label>
          <Input
            type="number"
            step="any"
            value={formData.location.latitude}
            onChange={(e) => handleChange('location', {
              ...formData.location,
              latitude: parseFloat(e.target.value)
            })}
            className={errors.latitude ? 'border-red-500' : ''}
            disabled={isLoading}
          />
          {errors.latitude && (
            <span className="text-xs text-red-500">{errors.latitude}</span>
          )}
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Longitude</label>
          <Input
            type="number"
            step="any"
            value={formData.location.longitude}
            onChange={(e) => handleChange('location', {
              ...formData.location,
              longitude: parseFloat(e.target.value)
            })}
            className={errors.longitude ? 'border-red-500' : ''}
            disabled={isLoading}
          />
          {errors.longitude && (
            <span className="text-xs text-red-500">{errors.longitude}</span>
          )}
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Address</label>
          <Input
            value={formData.location.address}
            onChange={(e) => handleChange('location', {
              ...formData.location,
              address: e.target.value
            })}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Price Information */}
      <div className="border p-4 rounded-lg space-y-4">
        <h3 className="font-medium">Pricing Details</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Current Price</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={formData.price.current}
              onChange={(e) => handleChange('price', {
                ...formData.price,
                current: parseFloat(e.target.value)
              })}
              className={errors.price ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.price && (
              <span className="text-xs text-red-500">{errors.price}</span>
            )}
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Original Price</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={formData.price.original}
              onChange={(e) => handleChange('price', {
                ...formData.price,
                original: parseFloat(e.target.value)
              })}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Currency</label>
            <Input
              value={formData.price.currency}
              onChange={(e) => handleChange('price', {
                ...formData.price,
                currency: e.target.value
              })}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Discount Section */}
        <div className="grid grid-cols-3 gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Discount Label</label>
            <Input
              value={formData.price.discount?.label || ''}
              onChange={(e) => handleChange('price', {
                ...formData.price,
                discount: {
                  ...formData.price.discount,
                  label: e.target.value
                }
              })}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Discount Amount</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={formData.price.discount?.amount || 0}
              onChange={(e) => handleChange('price', {
                ...formData.price,
                discount: {
                  ...formData.price.discount,
                  amount: parseFloat(e.target.value)
                }
              })}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Discount Percentage</label>
            <Input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.price.discount?.percentage || 0}
              onChange={(e) => handleChange('price', {
                ...formData.price,
                discount: {
                  ...formData.price.discount,
                  percentage: parseFloat(e.target.value)
                }
              })}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Rating and Reviews */}
      <div className="border p-4 rounded-lg space-y-4">
        <h3 className="font-medium">Ratings & Reviews</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Overall Rating</label>
            <Input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={formData.rating.overall}
              onChange={(e) => handleChange('rating', {
                ...formData.rating,
                overall: parseFloat(e.target.value)
              })}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Total Reviews</label>
            <Input
              type="number"
              min="0"
              value={formData.rating.totalReviews}
              onChange={(e) => handleChange('rating', {
                ...formData.rating,
                totalReviews: parseInt(e.target.value)
              })}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Location Rating</label>
            <Input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={formData.rating.location || 0}
              onChange={(e) => handleChange('rating', {
                ...formData.rating,
                location: parseFloat(e.target.value)
              })}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Amenities */}
      <DynamicListInput
        items={formData.amenities}
        onChange={(newAmenities) => handleChange('amenities', newAmenities)}
        placeholder="Add amenity"
        label="Hotel Amenities"
        disabled={isLoading}
      />

      {/* Badges */}
      <DynamicListInput
        items={formData.badges || []}
        onChange={(newBadges) => handleChange('badges', newBadges)}
        placeholder="Add badge"
        label="Hotel Badges"
        disabled={isLoading}
      />

      {/* Rooms Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Rooms</h3>
          <Button
            type="button"
            onClick={addRoom}
            disabled={isLoading}
          >
            Add Room
          </Button>
        </div>
        
        {rooms.map((room, index) => (
          <RoomForm
            key={room.id}
            room={room}
            onChange={(updatedRoom) => handleRoomChange(index, updatedRoom)}
            onRemove={() => removeRoom(index)}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* Form Actions */}
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

export default HotelOfferForm;