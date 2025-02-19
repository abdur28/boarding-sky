import React, { useState} from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogFooter,
} from "@/components/ui/dialog";
import { FlightOffer, FlightSegment } from '@/types';

const FlightOfferForm = ({ 
    initialData,
    onSubmit,
    onCancel,
    isLoading 
  }: {
    initialData: Omit<FlightOffer, 'id'>;
    onSubmit: (data: Omit<FlightOffer, 'id'>) => void;
    onCancel: () => void;
    isLoading: boolean;
  }) => {
    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState<Record<string, string>>({});
  
    const handleChange = (field: string, value: any) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
      // Clear error when field is updated
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
      
      const totalAmount = (newBreakdown.base || 0) + 
                         (newBreakdown.taxes || 0) + 
                         (newBreakdown.fees || 0);
  
      setFormData((prev: any) => ({
        ...prev,
        price: {
          ...prev.price,
          amount: totalAmount,
          breakdown: newBreakdown,
          currency: prev.price.currency
        }
      }));
    };
  
    const updateSegment = (itineraryIndex: number, segmentIndex: number, field: string, value: any) => {
      const newItineraries: any = [...formData.itineraries];
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        newItineraries[itineraryIndex].segments[segmentIndex][parent][child] = value ;
      } else {
        newItineraries[itineraryIndex].segments[segmentIndex][field] = value;
      }
      
      // Auto-calculate duration if both departure and arrival times are set
      if ((field === 'departure.at' || field === 'arrival.at') && 
          newItineraries[itineraryIndex].segments[segmentIndex].departure.at &&
          newItineraries[itineraryIndex].segments[segmentIndex].arrival.at) {
        const departure = new Date(newItineraries[itineraryIndex].segments[segmentIndex].departure.at);
        const arrival = new Date(newItineraries[itineraryIndex].segments[segmentIndex].arrival.at);
        const durationInMinutes = Math.round((arrival.getTime() - departure.getTime()) / (1000 * 60));
        const hours = Math.floor(durationInMinutes / 60);
        const minutes = durationInMinutes % 60;
        newItineraries[itineraryIndex].segments[segmentIndex].duration = 
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
      
      // Auto-calculate total duration for each itinerary
      const totalDuration = newItineraries[itineraryIndex].segments.reduce((total: number, segment: any) => {
        const [hours, minutes] = segment.duration.split(':').map(Number);
        return total + hours * 60 + minutes;
      }, 0);
      const hours = Math.floor(totalDuration / 60);
      const minutes = totalDuration % 60;
      newItineraries[itineraryIndex].duration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  
      handleChange('itineraries', newItineraries);
    };
  
    const addSegment = (itineraryIndex: number) => {
      const newItineraries = [...formData.itineraries];
      const newSegment: FlightSegment = {
        departure: { iataCode: '', at: '' },
        arrival: { iataCode: '', at: '' },
        duration: '',
        carrierCode: '',
        number: '',
        aircraft: { code: '', name: '' }
      };
      newItineraries[itineraryIndex].segments.push(newSegment);
      handleChange('itineraries', newItineraries);
    };
  
    const removeSegment = (itineraryIndex: number, segmentIndex: number) => {
      const newItineraries = [...formData.itineraries];
      newItineraries[itineraryIndex].segments = 
        newItineraries[itineraryIndex].segments.filter((_, index) => index !== segmentIndex);
      handleChange('itineraries', newItineraries);
    };
  
    const addItinerary = () => {
      const newItineraries = [...formData.itineraries];
      newItineraries.push({
        duration: '',
        segments: [{
          departure: { iataCode: '', at: '' },
          arrival: { iataCode: '', at: '' },
          duration: '',
          carrierCode: '',
          number: '',
          aircraft: { code: '', name: '' }
        }]
      });
      handleChange('itineraries', newItineraries);
    };
  
    const removeItinerary = (index: number) => {
      const newItineraries = formData.itineraries.filter((_, i) => i !== index);
      handleChange('itineraries', newItineraries);
    };
  
    const validateForm = (): boolean => {
      const newErrors: Record<string, string> = {};
  
      // Basic validation
      if (!formData.travelClass) newErrors.travelClass = 'Travel class is required';
      if (!formData.meta.validatingCarrier) newErrors.validatingCarrier = 'Carrier is required';
      if (!formData.meta.validatingCarrierName) newErrors.validatingCarrierName = 'Carrier name is required';
      if (!formData.price.amount) newErrors.price = 'Price is required';
  
      // Validate each segment in each itinerary
      formData.itineraries.forEach((itinerary, itineraryIndex) => {
        itinerary.segments.forEach((segment, segmentIndex) => {
          if (!segment.departure.iataCode) 
            newErrors[`departure-${itineraryIndex}-${segmentIndex}`] = 'Departure airport is required';
          if (!segment.arrival.iataCode)
            newErrors[`arrival-${itineraryIndex}-${segmentIndex}`] = 'Arrival airport is required';
          if (!segment.number)
            newErrors[`number-${itineraryIndex}-${segmentIndex}`] = 'Flight number is required';
        });
      });
  
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (validateForm()) {
        onSubmit(formData);
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Travel Class</label>
              <Select
                value={formData.travelClass}
                onValueChange={(value) => handleChange('travelClass', value)}
                disabled={isLoading}
              >
                <SelectTrigger className={errors.travelClass ? 'border-red-500' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ECONOMY">Economy</SelectItem>
                  <SelectItem value="PREMIUM_ECONOMY">Premium Economy</SelectItem>
                  <SelectItem value="BUSINESS">Business</SelectItem>
                  <SelectItem value="FIRST">First</SelectItem>
                </SelectContent>
              </Select>
              {errors.travelClass && (
                <span className="text-xs text-red-500">{errors.travelClass}</span>
              )}
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Validating Carrier</label>
              <Input
                value={formData.meta.validatingCarrier}
                onChange={(e) => handleChange('meta', {...formData.meta, validatingCarrier: e.target.value})}
                placeholder="e.g., BA"
                disabled={isLoading}
                className={errors.validatingCarrier ? 'border-red-500' : ''}
              />
              {errors.validatingCarrier && (
                <span className="text-xs text-red-500">{errors.validatingCarrier}</span>
              )}
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Validating Carrier Name</label>
              <Input
                value={formData.meta.validatingCarrierName}
                onChange={(e) => handleChange('meta', {...formData.meta, validatingCarrierName: e.target.value})}
                placeholder="e.g., BA"
                disabled={isLoading}
                className={errors.validatingCarrierName ? 'border-red-500' : ''}
              />
              {errors.validatingCarrierName && (
                <span className="text-xs text-red-500">{errors.validatingCarrierName}</span>
              )}
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Available Seats</label>
              <Input
                type="number"
                min="1"
                max="500"
                value={formData.meta.numberOfBookableSeats}
                onChange={(e) => handleChange('meta', {
                  ...formData.meta, 
                  numberOfBookableSeats: parseInt(e.target.value)
                })}
                placeholder="e.g., 9"
                disabled={isLoading}
              />
            </div>
          </div>
  
          {/* Price Section */}
          <div className="border p-4 rounded-lg space-y-4">
            <h3 className="font-medium">Pricing Details</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Base Price</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price.breakdown?.base || 0}
                  onChange={(e) => handlePriceChange('base', parseFloat(e.target.value))}
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
            </div>
            <div className="flex justify-end">
              <div className="text-sm text-gray-500">
                Total: {formData.price.currency} {formData.price.amount.toFixed(2)}
              </div>
            </div>
          </div>
  
          {/* Baggage Section */}
          <div className="border p-4 rounded-lg space-y-4">
            <h3 className="font-medium">Baggage Allowance</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Cabin Baggage</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Quantity</label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.fareDetails[0].baggage.cabin?.quantity || 0}
                      onChange={(e) => {
                        const newFareDetails = [...formData.fareDetails];
                        newFareDetails[0].baggage.cabin = {
                          ...newFareDetails[0].baggage.cabin,
                          quantity: parseInt(e.target.value)
                        };
                        handleChange('fareDetails', newFareDetails);
                      }}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Checked Baggage</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Quantity</label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.fareDetails[0].baggage.checked?.quantity || 0}
                      onChange={(e) => {
                        const newFareDetails = [...formData.fareDetails];
                        newFareDetails[0].baggage.checked = {
                          ...newFareDetails[0].baggage.checked,
                          quantity: parseInt(e.target.value)
                        };
                        handleChange('fareDetails', newFareDetails);
                      }}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Weight</label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.fareDetails[0].baggage.checked?.weight || 0}
                      onChange={(e) => {
                        const newFareDetails = [...formData.fareDetails];
                        newFareDetails[0].baggage.checked = {
                          ...newFareDetails[0].baggage.checked,
                          weight: parseInt(e.target.value)
                        } as any;
                        handleChange('fareDetails', newFareDetails);
                      }}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Unit</label>
                    <Select
                      value={formData.fareDetails[0].baggage.checked?.weightUnit || 'KG'}
                      onValueChange={(value) => {
                        const newFareDetails = [...formData.fareDetails];
                        newFareDetails[0].baggage.checked = {
                          ...newFareDetails[0].baggage.checked,
                          weightUnit: value
                        } as any;
                        handleChange('fareDetails', newFareDetails);
                      }}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KG">KG</SelectItem>
                        <SelectItem value="LB">LB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Itineraries Section */}
          <div className="space-y-4">
            {formData.itineraries.map((itinerary, itineraryIndex) => (
              <div key={itineraryIndex} className="border p-4 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">
                    {itineraryIndex === 0 ? "Outbound" : "Return"} Flight</h3>
                  <div className="flex gap-2">
                    {itineraryIndex > 0 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeItinerary(itineraryIndex)}
                        disabled={isLoading}
                      >
                        Remove Itinerary
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addSegment(itineraryIndex)}
                      disabled={isLoading}
                    >
                      Add Segment
                    </Button>
                  </div>
                </div>
                
                {itinerary.segments.map((segment, segmentIndex) => (
                  <div key={segmentIndex} className="border p-4 rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">
                        {segmentIndex === 0 ? "Direct Flight" : `Connection ${segmentIndex}`}
                      </h4>
                      {segmentIndex > 0 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeSegment(itineraryIndex, segmentIndex)}
                          disabled={isLoading}
                        >
                          Remove Segment
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* Departure */}
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Departure Airport</label>
                          <Input
                            value={segment.departure.iataCode}
                            onChange={(e) => updateSegment(itineraryIndex, segmentIndex, 'departure.iataCode', e.target.value.toUpperCase())}
                            placeholder="e.g., LHR"
                            maxLength={3}
                            className={errors[`departure-${itineraryIndex}-${segmentIndex}`] ? 'border-red-500' : ''}
                            disabled={isLoading}
                          />
                          {errors[`departure-${itineraryIndex}-${segmentIndex}`] && (
                            <span className="text-xs text-red-500">
                              {errors[`departure-${itineraryIndex}-${segmentIndex}`]}
                            </span>
                          )}
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Terminal (Optional)</label>
                          <Input
                            value={segment.departure.terminal || ''}
                            onChange={(e) => updateSegment(itineraryIndex, segmentIndex, 'departure.terminal', e.target.value)}
                            placeholder="e.g., T5"
                            disabled={isLoading}
                          />
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Departure Time</label>
                          <Input
                            type="datetime-local"
                            value={segment.departure.at}
                            onChange={(e) => updateSegment(itineraryIndex, segmentIndex, 'departure.at', e.target.value)}
                            disabled={isLoading}
                          />
                        </div>
                      </div>
  
                      {/* Arrival */}
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Arrival Airport</label>
                          <Input
                            value={segment.arrival.iataCode}
                            onChange={(e) => updateSegment(itineraryIndex, segmentIndex, 'arrival.iataCode', e.target.value.toUpperCase())}
                            placeholder="e.g., JFK"
                            maxLength={3}
                            className={errors[`arrival-${itineraryIndex}-${segmentIndex}`] ? 'border-red-500' : ''}
                            disabled={isLoading}
                          />
                          {errors[`arrival-${itineraryIndex}-${segmentIndex}`] && (
                            <span className="text-xs text-red-500">
                              {errors[`arrival-${itineraryIndex}-${segmentIndex}`]}
                            </span>
                          )}
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Terminal (Optional)</label>
                          <Input
                            value={segment.arrival.terminal || ''}
                            onChange={(e) => updateSegment(itineraryIndex, segmentIndex, 'arrival.terminal', e.target.value)}
                            placeholder="e.g., T1"
                            disabled={isLoading}
                          />
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Arrival Time</label>
                          <Input
                            type="datetime-local"
                            value={segment.arrival.at}
                            onChange={(e) => updateSegment(itineraryIndex, segmentIndex, 'arrival.at', e.target.value)}
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </div>
  
                    <div className="grid grid-cols-4 gap-4">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Duration</label>
                        <Input
                          value={segment.duration}
                          onChange={(e) => {updateSegment(itineraryIndex, segmentIndex, 'duration', e.target.value)}}
                          placeholder="HH:mm"
                          disabled={true}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Carrier Code</label>
                        <Input
                          value={segment.carrierCode}
                          onChange={(e) => updateSegment(itineraryIndex, segmentIndex, 'carrierCode', e.target.value.toUpperCase())}
                          placeholder="e.g., BA"
                          maxLength={2}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Flight Number</label>
                        <Input
                          value={segment.number}
                          onChange={(e) => updateSegment(itineraryIndex, segmentIndex, 'number', e.target.value)}
                          placeholder="e.g., 123"
                          className={errors[`number-${itineraryIndex}-${segmentIndex}`] ? 'border-red-500' : ''}
                          disabled={isLoading}
                        />
                        {errors[`number-${itineraryIndex}-${segmentIndex}`] && (
                          <span className="text-xs text-red-500">
                            {errors[`number-${itineraryIndex}-${segmentIndex}`]}
                          </span>
                        )}
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Aircraft Type</label>
                        <Input
                          value={segment.aircraft.code}
                          onChange={(e) => updateSegment(itineraryIndex, segmentIndex, 'aircraft.code', e.target.value)}
                          placeholder="e.g., 320"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            
            {formData.itineraries.length === 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={addItinerary}
                className="w-full"
                disabled={isLoading}
              >
                Add Return Flight
              </Button>
            )}
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
        </div>
      </form>
    );
  };

export default FlightOfferForm;