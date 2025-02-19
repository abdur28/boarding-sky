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
import { CarOffer, CarFeatures, CarLocation, CarPrice, CarVendor, CarAgent, CarInsurance } from '@/types';
import { Switch } from "@/components/ui/switch";
import UploadImage from '../UploadImage';

// Interfaces
interface CarOfferFormProps {
    initialData: Omit<CarOffer, 'id'>;
    onSubmit: (data: Omit<CarOffer, 'id'>, imagesToDelete: string[]) => void;
    onCancel: () => void;
    isLoading: boolean;
}

interface DynamicListInputProps {
    items: string[];
    onChange: (newItems: string[]) => void;
    placeholder: string;
    label: string;
    disabled?: boolean;
}

interface LocationInputProps {
    location: CarLocation;
    onChange: (location: CarLocation) => void;
    label: string;
    disabled: boolean;
}

// Utility Components
const DynamicListInput: React.FC<DynamicListInputProps> = ({ 
    items, 
    onChange, 
    placeholder, 
    label, 
    disabled 
}) => {
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

const LocationInput: React.FC<LocationInputProps> = ({ 
    location, 
    onChange, 
    label, 
    disabled 
}) => {
    return (
        <div className="space-y-4">
            <h3 className="font-medium">{label}</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input
                        value={location.name}
                        onChange={(e) => onChange({ ...location, name: e.target.value })}
                        disabled={disabled}
                    />
                </div>
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Type</label>
                    <Select
                        value={location.type}
                        onValueChange={(value: 'airport' | 'city' | 'station' | 'other') =>
                            onChange({ ...location, type: value })}
                        disabled={disabled}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="airport">Airport</SelectItem>
                            <SelectItem value="city">City</SelectItem>
                            <SelectItem value="station">Station</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid gap-2">
                <label className="text-sm font-medium">Address</label>
                <Input
                    value={location.address || ''}
                    onChange={(e) => onChange({ ...location, address: e.target.value })}
                    disabled={disabled}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Latitude</label>
                    <Input
                        type="number"
                        step="any"
                        value={location.coordinates?.latitude || 0}
                        onChange={(e) => onChange({
                            ...location,
                            coordinates: {
                                ...location.coordinates,
                                latitude: parseFloat(e.target.value)
                            } as any
                        })}
                        disabled={disabled}
                    />
                </div>
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Longitude</label>
                    <Input
                        type="number"
                        step="any"
                        value={location.coordinates?.longitude || 0}
                        onChange={(e) => onChange({
                            ...location,
                            coordinates: {
                                ...location.coordinates,
                                longitude: parseFloat(e.target.value)
                            } as any
                        })}
                        disabled={disabled}
                    />
                </div>
            </div>
        </div>
    );
};

// Main Component
const CarOfferForm: React.FC<CarOfferFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isLoading
}) => {
    // State
    const [formData, setFormData] = useState<Omit<CarOffer, 'id'>>(initialData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [uploadedImage, setUploadedImage] = useState<string>('');
    const [uploadedImages, setUploadedImages] = useState<string[]>(
        initialData.images.map(img => img.url)
    );
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

    // Effects
    useEffect(() => {
        if (uploadedImage) {
            setUploadedImages(prev => [...prev, uploadedImage]);
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, {
                    url: uploadedImage,
                    alt: `${prev.name} - ${prev.images.length + 1}`
                }]
            }));
            setUploadedImage('');
        }
    }, [uploadedImage]);

    // Handlers
    const handleChange = (field: keyof Omit<CarOffer, 'id'>, value: any) => {
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

    const handlePriceChange = (field: string, value: number) => {
        const newBreakdown = {
            ...formData.price.breakdown,
            [field]: value
        };
        
        const totalAmount = (newBreakdown.baseRate || 0) + 
                          (newBreakdown.taxes || 0) + 
                          (newBreakdown.fees || 0) +
                          (newBreakdown.insurance || 0) +
                          (newBreakdown.extras || 0);
    
        handleChange('price', {
            ...formData.price,
            amount: totalAmount,
            breakdown: newBreakdown
        });
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name) newErrors.name = 'Car name is required';
        if (!formData.brand) newErrors.brand = 'Brand is required';
        if (!formData.model) newErrors.model = 'Model is required';
        if (!formData.status) newErrors.status = 'Status is required';
        if (!formData.price.amount) newErrors.price = 'Price is required';
        if (!formData.pickupLocation.name) newErrors.pickupLocation = 'Pickup location is required';
        if (!formData.dropoffLocation.name) newErrors.dropoffLocation = 'Dropoff location is required';
        if (!formData.pickupDateTime) newErrors.pickupDateTime = 'Pickup date/time is required';
        if (!formData.dropoffDateTime) newErrors.dropoffDateTime = 'Dropoff date/time is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            const updatedFormData = {
                ...formData,
                vendor: {
                    ...formData.vendor,
                    id: formData.vendor.id || `vendor-${Date.now()}`
                },
                agent: {
                    ...formData.agent,
                    id: formData.agent.id || `agent-${Date.now()}`
                },
                pickupLocation: {
                    ...formData.pickupLocation,
                    id: formData.pickupLocation.id || `location-${Date.now()}-pickup`
                },
                dropoffLocation: {
                    ...formData.dropoffLocation,
                    id: formData.dropoffLocation.id || `location-${Date.now()}-dropoff`
                },
                images: uploadedImages.map(url => ({
                    url,
                    alt: `${formData.name} - View`
                }))
            };
            onSubmit(updatedFormData, imagesToDelete);
        }
    };

    // Render
    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Car Images */}
            <UploadImage
                uploadedImages={uploadedImages}
                setUploadedImage={setUploadedImage}
                multiple={true}
                maxFiles={5}
                onRemove={(index) => {
                    const imageToDelete = uploadedImages[index];
                    setUploadedImages(prev => prev.filter((_, i) => i !== index));
                    if (imageToDelete && initialData.images.some(img => img.url === imageToDelete)) {
                        setImagesToDelete(prev => [...prev, imageToDelete]);
                    }
                }}
            />

            {/* Basic Information */}
            <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Car Name</label>
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
                    <label className="text-sm font-medium">Brand</label>
                    <Input
                        value={formData.brand || ''}
                        onChange={(e) => handleChange('brand', e.target.value)}
                        disabled={isLoading}
                        className={errors.brand ? 'border-red-500' : ''}
                    />
                    {errors.brand && (
                        <span className="text-xs text-red-500">{errors.brand}</span>
                    )}
                </div>
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Model</label>
                    <Input
                        value={formData.model || ''}
                        onChange={(e) => handleChange('model', e.target.value)}
                        disabled={isLoading}
                        className={errors.model ? 'border-red-500' : ''}
                    />
                    {errors.model && (
                        <span className="text-xs text-red-500">{errors.model}</span>
                    )}
                </div>
            </div>

            {/* Status */}
            <div className="grid gap-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                    value={formData.status}
                    onValueChange={(value: 'available' | 'on_request' | 'sold_out') => 
                        handleChange('status', value)}
                    disabled={isLoading}
                >
                    <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="on_request">On Request</SelectItem>
                        <SelectItem value="sold_out">Sold Out</SelectItem>
                    </SelectContent>
                </Select>
                {errors.status && (
                    <span className="text-xs text-red-500">{errors.status}</span>
                )}
            </div>

            {/* Features */}
            <div className="border p-4 rounded-lg space-y-4">
                <h3 className="font-medium">Car Features</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Transmission</label>
                        <Select
                            value={formData.features.transmission}
                            onValueChange={(value: 'automatic' | 'manual') =>
                                handleChange('features', { ...formData.features, transmission: value })}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="automatic">Automatic</SelectItem>
                                <SelectItem value="manual">Manual</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Category</label>
                        <Input
                            value={formData.features.category}
                            onChange={(e) => handleChange('features', {
                                ...formData.features,
                                category: e.target.value
                            })}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Fuel Type</label>
                        <Select
                            value={formData.features.fuelType}
                            onValueChange={(value: 'petrol' | 'diesel' | 'electric' | 'hybrid') =>
                                handleChange('features', { ...formData.features, fuelType: value })}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="petrol">Petrol</SelectItem>
                                <SelectItem value="diesel">Diesel</SelectItem>
                                <SelectItem value="electric">Electric</SelectItem>
                                <SelectItem value="hybrid">Hybrid</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Doors</label>
                        <Input
                            type="number"
                            min="2"
                            max="5"
                            value={formData.features.doors}
                            onChange={(e) => handleChange('features', {
                                ...formData.features,
                                doors: parseInt(e.target.value)
                            })}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Seats</label>
                        <Input
                            type="number"
                            min="2"
                            max="9"
                            value={formData.features.seats}
                            onChange={(e) => handleChange('features', {
                                ...formData.features,
                                seats: parseInt(e.target.value)
                            })}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Large Bags</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.features.baggageCapacity.large}
                            onChange={(e) => handleChange('features', {
                                ...formData.features,
                                baggageCapacity: {
                                    ...formData.features.baggageCapacity,
                                    large: parseInt(e.target.value)
                                }
                            })}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Small Bags</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.features.baggageCapacity.small}
                            onChange={(e) => handleChange('features', {
                                ...formData.features,
                                baggageCapacity: {
                                    ...formData.features.baggageCapacity,
                                    small: parseInt(e.target.value)
                                }
                            })}
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2 mt-4">
                    <Switch
                        checked={formData.features.airConditioning}
                        onCheckedChange={(checked) => handleChange('features', {
                            ...formData.features,
                            airConditioning: checked
                        })}
                        disabled={isLoading}
                    />
                    <label className="text-sm font-medium">Air Conditioning</label>
                </div>
            </div>

            {/* Location and Timing */}
            <div className="space-y-6">
                <LocationInput
                    location={formData.pickupLocation}
                    onChange={(location) => handleChange('pickupLocation', location)}
                    label="Pickup Location"
                    disabled={isLoading}
                />

                <LocationInput
                    location={formData.dropoffLocation}
                    onChange={(location) => handleChange('dropoffLocation', location)}
                    label="Drop-off Location"
                    disabled={isLoading}
                />

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Pickup Date & Time</label>
                        <Input
                            type="datetime-local"
                            value={formData.pickupDateTime}
                            onChange={(e) => handleChange('pickupDateTime', e.target.value)}
                            disabled={isLoading}
                            className={errors.pickupDateTime ? 'border-red-500' : ''}
                        />
                        {errors.pickupDateTime && (
                            <span className="text-xs text-red-500">{errors.pickupDateTime}</span>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Drop-off Date & Time</label>
                        <Input
                            type="datetime-local"
                            value={formData.dropoffDateTime}
                            onChange={(e) => handleChange('dropoffDateTime', e.target.value)}
                            disabled={isLoading}
                            className={errors.dropoffDateTime ? 'border-red-500' : ''}
                        />
                        {errors.dropoffDateTime && (
                            <span className="text-xs text-red-500">{errors.dropoffDateTime}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Price and Insurance */}
            <div className="border p-4 rounded-lg space-y-4">
                <h3 className="font-medium">Pricing Details</h3>
                <div className="grid grid-cols-4 gap-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Base Rate</label>
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.price.breakdown?.baseRate || 0}
                            onChange={(e) => handlePriceChange('baseRate', parseFloat(e.target.value))}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Taxes</label>
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.price.breakdown?.taxes || 0}
                            onChange={(e) => handlePriceChange('taxes', parseFloat(e.target.value))}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Fees</label>
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.price.breakdown?.fees || 0}
                            onChange={(e) => handlePriceChange('fees', parseFloat(e.target.value))}
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

                <div className="mt-2 text-right text-sm text-gray-500">
                    Total: {formData.price.currency} {formData.price.amount.toFixed(2)}
                </div>

                <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                        <Switch
                            checked={formData.price.includesTaxes}
                            onCheckedChange={(checked) => handleChange('price', {
                                ...formData.price,
                                includesTaxes: checked
                            })}
                            disabled={isLoading}
                        />
                        <label className="text-sm font-medium">Includes Taxes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            checked={formData.price.includesInsurance}
                            onCheckedChange={(checked) => handleChange('price', {
                                ...formData.price,
                                includesInsurance: checked
                            })}
                            disabled={isLoading}
                        />
                        <label className="text-sm font-medium">Includes Insurance</label>
                    </div>
                </div>
            </div>

            {/* Vendor and Agent */}
            <div className="grid grid-cols-2 gap-4">
                {/* Vendor Section */}
                <div className="border p-4 rounded-lg space-y-4">
                    <h3 className="font-medium">Vendor Details</h3>
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Vendor Name</label>
                            <Input
                                value={formData.vendor.name}
                                onChange={(e) => handleChange('vendor', {
                                    ...formData.vendor,
                                    name: e.target.value
                                })}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Logo URL</label>
                            <Input
                                value={formData.vendor.logo || ''}
                                onChange={(e) => handleChange('vendor', {
                                    ...formData.vendor,
                                    logo: e.target.value
                                })}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Rating</label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    value={formData.vendor.rating || 0}
                                    onChange={(e) => handleChange('vendor', {
                                        ...formData.vendor,
                                        rating: parseFloat(e.target.value)
                                    })}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Review Count</label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={formData.vendor.reviewCount || 0}
                                    onChange={(e) => handleChange('vendor', {
                                        ...formData.vendor,
                                        reviewCount: parseInt(e.target.value)
                                    })}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Agent Section */}
                <div className="border p-4 rounded-lg space-y-4">
                    <h3 className="font-medium">Agent Details</h3>
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Agent Name</label>
                            <Input
                                value={formData.agent.name}
                                onChange={(e) => handleChange('agent', {
                                    ...formData.agent,
                                    name: e.target.value
                                })}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Type</label>
                            <Select
                                value={formData.agent.type}
                                onValueChange={(value: 'vendor' | 'broker' | 'other') =>
                                    handleChange('agent', { ...formData.agent, type: value })}
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="vendor">Vendor</SelectItem>
                                    <SelectItem value="broker">Broker</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mileage and Restrictions */}
            <div className="grid grid-cols-2 gap-4">
                {/* Mileage Section */}
                <div className="border p-4 rounded-lg space-y-4">
                    <h3 className="font-medium">Mileage</h3>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Switch
                                checked={formData.mileage?.unlimited}
                                onCheckedChange={(checked) => handleChange('mileage', {
                                    ...formData.mileage,
                                    unlimited: checked
                                })}
                                disabled={isLoading}
                            />
                            <label className="text-sm font-medium">Unlimited Mileage</label>
                        </div>
                        {!formData.mileage?.unlimited && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Limit</label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={formData.mileage?.limit || 0}
                                        onChange={(e) => handleChange('mileage', {
                                            ...formData.mileage,
                                            limit: parseInt(e.target.value)
                                        })}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Unit</label>
                                    <Select
                                        value={formData.mileage?.unit || 'km'}
                                        onValueChange={(value: 'km' | 'miles') =>
                                            handleChange('mileage', { ...formData.mileage, unit: value })}
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="km">Kilometers</SelectItem>
                                            <SelectItem value="miles">Miles</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Restrictions Section */}
                <div className="border p-4 rounded-lg space-y-4">
                    <h3 className="font-medium">Restrictions</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Minimum Age</label>
                                <Input
                                    type="number"
                                    min="18"
                                    max="99"
                                    value={formData.restrictions?.minAge || 18}
                                    onChange={(e) => handleChange('restrictions', {
                                        ...formData.restrictions,
                                        minAge: parseInt(e.target.value)
                                    })}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Maximum Age</label>
                                <Input
                                    type="number"
                                    min="18"
                                    max="99"
                                    value={formData.restrictions?.maxAge || 99}
                                    onChange={(e) => handleChange('restrictions', {
                                        ...formData.restrictions,
                                        maxAge: parseInt(e.target.value)
                                    })}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Minimum License Period (Years)</label>
                            <Input
                                type="number"
                                min="0"
                                value={formData.restrictions?.minLicenseHeld || 0}
                                onChange={(e) => handleChange('restrictions', {
                                    ...formData.restrictions,
                                    minLicenseHeld: parseInt(e.target.value)
                                })}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                checked={formData.restrictions?.requiredCreditCard}
                                onCheckedChange={(checked) => handleChange('restrictions', {
                                    ...formData.restrictions,
                                    requiredCreditCard: checked
                                })}
                                disabled={isLoading}
                            />
                            <label className="text-sm font-medium">Credit Card Required</label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Required Documents */}
            <DynamicListInput
                items={formData.requiredDocuments || []}
                onChange={(newDocs) => handleChange('requiredDocuments', newDocs)}
                placeholder="Add required document"
                label="Required Documents"
                disabled={isLoading}
            />

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

export default CarOfferForm;