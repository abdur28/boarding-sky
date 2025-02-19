'use client';

import { useEffect, useState } from "react";
import { format, parseISO, differenceInDays } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CalendarDays, MapPin, Phone, Mail, Clock, CreditCard, Shield, Receipt, User, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const statusColors = {
    confirmed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-blue-100 text-blue-800"
};

type Status = keyof typeof statusColors;

const BookingDetailsPage = ({ id }: { id: string }) => {
    const [booking, setBooking] = useState<any>(null);
    const [receipt, setReceipt] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await fetch('/api/actions/get-booking', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ bookingId: id }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch booking');
                }

                setBooking(data.data.booking);
                setReceipt(data.data.receipt);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [id]);

    if (loading) {
        return (
            <div className="w-full h-[70vh] flex justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-[70vh] flex flex-col justify-center items-center gap-4">
                <div className="text-red-500">{error}</div>
                <Button asChild variant="outline">
                    <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="w-full h-[70vh] flex flex-col justify-center items-center gap-4">
                <div>Booking not found</div>
                <Button asChild variant="outline">
                    <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
            </div>
        );
    }

    const formatDate = (date: string) => {
        return format(parseISO(date), 'MMM dd, yyyy');
    };

    const formatDateTime = (date: string) => {
        return format(parseISO(date), 'MMM dd, yyyy HH:mm');
    };

    const renderBookingDetails = () => {
        const details = booking.bookingDetails;

        switch (booking.bookingType) {
            case 'flight':
                const firstSegment = details?.itineraries?.[0]?.segments?.[0];
                const lastSegment = details?.itineraries?.[0]?.segments?.slice(-1)[0];
                
                return (
                    <div className="space-y-6">
                        {/* Flight Summary */}
                        <Card className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-gray-500">Departure</div>
                                    <div className="text-lg font-semibold">{firstSegment?.departure?.iataCode}</div>
                                    <div className="text-sm text-gray-600">{formatDateTime(firstSegment?.departure?.at)}</div>
                                    {firstSegment?.departure?.terminal && (
                                        <div className="text-sm text-gray-500">Terminal {firstSegment.departure.terminal}</div>
                                    )}
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-gray-500">Arrival</div>
                                    <div className="text-lg font-semibold">{lastSegment?.arrival?.iataCode}</div>
                                    <div className="text-sm text-gray-600">{formatDateTime(lastSegment?.arrival?.at)}</div>
                                    {lastSegment?.arrival?.terminal && (
                                        <div className="text-sm text-gray-500">Terminal {lastSegment.arrival.terminal}</div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Passengers</div>
                                        <div className="text-sm mt-1">{details.passengers?.length || 1}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Class</div>
                                        <div className="text-sm mt-1">{details.fareDetails?.[0]?.cabin || "Economy"}</div>
                                    </div>
                                </div>
                                {receipt?.itemDetails?.protection?.included && (
                                    <div className="flex items-center gap-2 text-sm text-green-600">
                                        <Shield className="h-4 w-4" />
                                        Travel Protection Included
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Passenger Information */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Passenger Information</h3>
                            <div className="space-y-4">
                                {details.passengers?.map((passenger: any, index: number) => (
                                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Type</div>
                                                <div className="text-sm mt-1 capitalize">{passenger.type}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Name</div>
                                                <div className="text-sm mt-1">{passenger.firstName} {passenger.lastName}</div>
                                            </div>
                                            {passenger.dateOfBirth && (
                                                <div>
                                                    <div className="text-sm font-medium text-gray-500">Date of Birth</div>
                                                    <div className="text-sm mt-1">{formatDate(passenger.dateOfBirth)}</div>
                                                </div>
                                            )}
                                            {passenger.passportNumber && (
                                                <div>
                                                    <div className="text-sm font-medium text-gray-500">Passport</div>
                                                    <div className="text-sm mt-1">{passenger.passportNumber}</div>
                                                </div>
                                            )}
                                        </div>
                                        {passenger.specialRequests && passenger.specialRequests.length > 0 && (
                                            <div className="mt-2">
                                                <div className="text-sm font-medium text-gray-500">Special Requests</div>
                                                <div className="text-sm mt-1">{passenger.specialRequests.join(', ')}</div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Flight Itinerary */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Flight Itinerary</h3>
                            <div className="space-y-6">
                                {details.itineraries?.map((itinerary: any, itineraryIndex: number) => (
                                    <div key={itineraryIndex} className="space-y-4">
                                        {itineraryIndex > 0 && <div className="border-t pt-4" />}
                                        <div className="text-sm font-medium text-gray-500">
                                            {itineraryIndex === 0 ? 'Outbound' : 'Return'} Flight
                                        </div>
                                        {itinerary.segments.map((segment: any, segmentIndex: number) => (
                                            <div key={segmentIndex} className="p-4 bg-gray-50 rounded-lg">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-500">From</div>
                                                        <div className="text-base font-semibold">{segment.departure.iataCode}</div>
                                                        <div className="text-sm text-gray-600">{formatDateTime(segment.departure.at)}</div>
                                                        {segment.departure.terminal && (
                                                            <div className="text-sm text-gray-500">Terminal {segment.departure.terminal}</div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-500">To</div>
                                                        <div className="text-base font-semibold">{segment.arrival.iataCode}</div>
                                                        <div className="text-sm text-gray-600">{formatDateTime(segment.arrival.at)}</div>
                                                        {segment.arrival.terminal && (
                                                            <div className="text-sm text-gray-500">Terminal {segment.arrival.terminal}</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                                                    <div>Flight: {segment.carrierCode}{segment.number}</div>
                                                    <div>Duration: {segment.duration}</div>
                                                    {segment.aircraft?.name && <div>Aircraft: {segment.aircraft.name}</div>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                );

                case 'hotel':
                    return (
                        <div className="space-y-6">
                            {/* Hotel Summary */}
                            <Card className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium text-gray-500">Check-in</div>
                                        <div className="text-lg font-semibold">{formatDate(details.checkIn)}</div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium text-gray-500">Check-out</div>
                                        <div className="text-lg font-semibold">{formatDate(details.checkOut)}</div>
                                    </div>
                                </div>
                
                                <div className="pt-4 border-t">
                                    <div className="text-sm font-medium text-gray-500 mb-2">Duration</div>
                                    <div className="text-base">
                                        {differenceInDays(new Date(details.checkOut), new Date(details.checkIn))} nights
                                    </div>
                                </div>
                            </Card>
                
                            {/* Room Details */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Room Details</h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Room Type</div>
                                                <div className="text-base font-medium mt-1">{details.roomDetails?.name}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Max Occupancy</div>
                                                <div className="text-base mt-1">{details.roomDetails?.maxOccupancy} persons</div>
                                            </div>
                                        </div>
                
                                        {details.roomDetails?.price?.breakdown && (
                                            <div className="mt-4 border-t pt-4">
                                                <div className="text-sm font-medium text-gray-500 mb-2">Price Breakdown</div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-gray-600">Base Rate</span>
                                                        <span className="text-sm">${details.roomDetails.price.breakdown.baseRate}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-gray-600">Taxes</span>
                                                        <span className="text-sm">${details.roomDetails.price.breakdown.taxes}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-gray-600">Fees</span>
                                                        <span className="text-sm">${details.roomDetails.price.breakdown.fees}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                
                            {/* Guest Information */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Guest Information</h3>
                                <div className="space-y-4">
                                    {details.guests?.map((guest: any, index: number) => (
                                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-500">Guest {index + 1}</div>
                                                    <div className="text-sm mt-1">{guest.firstName} {guest.lastName}</div>
                                                </div>
                                                {guest.age && (
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-500">Age</div>
                                                        <div className="text-sm mt-1">{guest.age} years</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                
                            {/* Additional Services & Requests */}
                            {(details.specialRequests || details.additionalServices) && (
                                <Card className="p-6">
                                    <h3 className="text-lg font-semibold mb-4">Additional Services & Requests</h3>
                                    <div className="space-y-4">
                                        {details.specialRequests && (
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Special Requests</div>
                                                <div className="text-sm mt-1 p-3 bg-gray-50 rounded">{details.specialRequests}</div>
                                            </div>
                                        )}
                                        {details.additionalServices && (
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Additional Services</div>
                                                <div className="mt-2 space-y-2">
                                                    {details.additionalServices.map((service: any, index: number) => (
                                                        <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                                                            <span className="text-sm">{service.name}</span>
                                                            <span className="text-sm font-medium">${service.price}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            )}
                        </div>
                    );
                
                case 'car':
                    return (
                        <div className="space-y-6">
                            {/* Rental Summary */}
                            <Card className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium text-gray-500">Pickup</div>
                                        <div className="text-lg font-semibold">{details.pickupLocation}</div>
                                        <div className="text-sm text-gray-600">
                                            {formatDateTime(`${details.pickupDate}T${details.pickupTime}`)}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium text-gray-500">Drop-off</div>
                                        <div className="text-lg font-semibold">{details.dropoffLocation}</div>
                                        <div className="text-sm text-gray-600">
                                            {formatDateTime(`${details.dropoffDate}T${details.dropoffTime}`)}
                                        </div>
                                    </div>
                                </div>
                
                                <div className="pt-4 border-t">
                                    <div className="text-sm font-medium text-gray-500 mb-2">Duration</div>
                                    <div className="text-base">
                                        {differenceInDays(new Date(details.dropoffDate), new Date(details.pickupDate))} days
                                    </div>
                                </div>
                            </Card>
                
                            {/* Vehicle Details */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Vehicle Details</h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Vehicle</div>
                                                <div className="text-sm mt-1">{details.name || 'Standard Vehicle'}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Category</div>
                                                <div className="text-sm mt-1 capitalize">{details.features?.category || 'Standard'}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Transmission</div>
                                                <div className="text-sm mt-1 capitalize">{details.features?.transmission || 'Automatic'}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Fuel Type</div>
                                                <div className="text-sm mt-1 capitalize">{details.features?.fuelType || 'Petrol'}</div>
                                            </div>
                                        </div>
                
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Passengers</div>
                                                <div className="text-sm mt-1">{details.features?.seats || '5'} seats</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Doors</div>
                                                <div className="text-sm mt-1">{details.features?.doors || '4'} doors</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Large Bags</div>
                                                <div className="text-sm mt-1">{details.features?.baggageCapacity?.large || '2'}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Small Bags</div>
                                                <div className="text-sm mt-1">{details.features?.baggageCapacity?.small || '1'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                
                            {/* Driver Information */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Driver Information</h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">License Number</div>
                                                <div className="text-sm mt-1">{details.licenseNumber || "Not provided"}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Date of Birth</div>
                                                <div className="text-sm mt-1">{formatDate(details.dateOfBirth)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                
                            {/* Additional Services */}
                            {details.additionalServices && details.additionalServices.length > 0 && (
                                <Card className="p-6">
                                    <h3 className="text-lg font-semibold mb-4">Additional Services</h3>
                                    <div className="space-y-2">
                                        {details.additionalServices.map((service: any, index: number) => (
                                            <div key={index} className="flex justify-between p-3 bg-gray-50 rounded">
                                                <span className="text-sm">{service.name}</span>
                                                <span className="text-sm font-medium">${service.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            )}
                
                            {/* Insurance Information */}
                            {details.insurance && (
                                <Card className="p-6">
                                    <h3 className="text-lg font-semibold mb-4">Insurance Coverage</h3>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-500">Coverage Type</div>
                                                    <div className="text-sm mt-1 capitalize">{details.insurance.type}</div>
                                                </div>
                                                {details.insurance.excess && (
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-500">Excess Amount</div>
                                                        <div className="text-sm mt-1">
                                                            ${details.insurance.excess.amount} {details.insurance.excess.currency}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            {details.insurance.coverage && (
                                                <div className="mt-4 pt-4 border-t">
                                                    <div className="text-sm font-medium text-gray-500 mb-2">Coverage Details</div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {Object.entries(details.insurance.coverage).map(([key, value]) => (
                                                            <div key={key} className="flex items-center gap-2">
                                                                <div className={`h-2 w-2 rounded-full ${value ? 'bg-green-500' : 'bg-red-500'}`} />
                                                                <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            )}
                        </div>
                    );

            default:
                return null;
        }
    };

    return (
            <div className="container max-w-6xl mx-auto px-4">
                {/* Booking Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">{booking.bookingId}</h1>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[booking.status as Status]}`}>
                                {booking.status}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[booking.paymentStatus as Status]}`}>
                                {booking.paymentStatus}
                            </span>
                            {booking.paymentStatus === 'paid' && (
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    booking.isRefundable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {booking.isRefundable ? 'Refundable' : 'Non-refundable'}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href={`/receipt/${receipt?.receiptId}`}>
                                <Receipt className="h-4 w-4 mr-2" />
                                View Receipt
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Main Booking Details */}
                    <div className="md:col-span-2 space-y-6">
                        {renderBookingDetails()}
                        
                        {/* Metadata */}
                        <Card className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm">Booked on {formatDate(booking.createdAt)}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">Amount: ${booking.amount.toFixed(2)}</span>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* User Info */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Account Details</h3>
                            <div className="flex items-center gap-3 mb-4">
                                {booking.user.profilePicture ? (
                                    <Image
                                        src={booking.user.profilePicture}
                                        alt={booking.user.name}
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                        <User className="h-5 w-5 text-gray-500" />
                                    </div>
                                )}
                                <div>
                                    <div className="font-medium">{booking.user.name}</div>
                                    <div className="text-sm text-gray-500">{booking.user.email}</div>
                                </div>
                            </div>
                        </Card>

                        {/* Customer Info */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Customer Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm">{booking.customer.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm">{booking.customer.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm">{booking.customer.phone}</span>
                                </div>
                            </div>
                        </Card>

                        {/* Protection Info if applicable */}
                        {receipt?.itemDetails?.protection?.included && (
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Travel Protection</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-green-600">
                                        <Shield className="h-4 w-4" />
                                        <span className="text-sm">Protection Included</span>
                                    </div>
                                    <div className="text-sm">
                                        Amount: ${receipt.itemDetails.protection.amount.toFixed(2)}
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
    );
};

export default BookingDetailsPage;