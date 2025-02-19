'use client';

import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    Loader2, 
    CalendarDays, 
    CreditCard, 
    Shield, 
    Building, 
    Mail, 
    Phone, 
    User,
    Receipt,
    ArrowLeft,
    Map,
    Users,
    MapPin
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const statusColors = {
    paid: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-blue-100 text-blue-800"
};

type Status = keyof typeof statusColors;
type BookingType = 'flight' | 'hotel' | 'car' | 'tour';

const getBookingTypeIcon = (type: BookingType) => {
    switch (type) {
        case 'tour':
            return <Map className="h-4 w-4 text-gray-500" />;
        case 'car':
            return <CreditCard className="h-4 w-4 text-gray-500" />;
        case 'hotel':
            return <Building className="h-4 w-4 text-gray-500" />;
        case 'flight':
            return <Users className="h-4 w-4 text-gray-500" />;
        default:
            return null;
    }
};

const ReceiptDetailsPage = ({ id }: { id: string }) => {
    const [receipt, setReceipt] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReceipt = async () => {
            try {
                const response = await fetch('/api/actions/get-receipt', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ receiptId: id }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch receipt');
                }

                setReceipt(data.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchReceipt();
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

    if (!receipt) {
        return (
            <div className="w-full h-[70vh] flex flex-col justify-center items-center gap-4">
                <div>Receipt not found</div>
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

    const renderPriceBreakdown = () => {
        switch (receipt.bookingType) {
            case 'tour':
                return (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Tour Package</span>
                            <span className="text-sm">${receipt.itemDetails.unitPrice.toFixed(2)}</span>
                        </div>
                        {receipt.itemDetails.breakdown && (
                            <>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">
                                        Adults ({receipt.itemDetails.breakdown.adults})
                                    </span>
                                    <span className="text-sm">
                                        ${receipt.itemDetails.breakdown.adultPrice.toFixed(2)}
                                    </span>
                                </div>
                                {receipt.itemDetails.breakdown.children > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                            Children ({receipt.itemDetails.breakdown.children})
                                        </span>
                                        <span className="text-sm">
                                            ${receipt.itemDetails.breakdown.childPrice.toFixed(2)}
                                        </span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                );
            default:
                return (
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{receipt.itemDetails.name}</span>
                        <span className="text-sm">${receipt.itemDetails.unitPrice.toFixed(2)}</span>
                    </div>
                );
        }
    };

    return (
        <div className="container max-w-4xl mx-auto px-4">
            {/* Receipt Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold">{receipt.receiptId}</h1>
                    <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[receipt.status as Status]}`}>
                            {receipt.status}
                        </span>
                        <span className="text-sm text-gray-500">
                            Reference: {receipt.bookingId}
                        </span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button asChild variant="outline">
                        <Link href={`/dashboard`}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                {/* Transaction Details */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Transaction Details</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm font-medium text-gray-500">Date</div>
                                <div className="text-sm mt-1">{formatDateTime(receipt.transactionDate)}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-500">Payment Method</div>
                                <div className="text-sm mt-1 capitalize">{receipt.paymentDetails.paymentMethod}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-500">Transaction ID</div>
                                <div className="text-sm mt-1">{receipt.paymentDetails.transactionId}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-500">Booking Type</div>
                                <div className="text-sm mt-1 capitalize">{receipt.bookingType}</div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Price Breakdown */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Price Details</h3>
                    <div className="space-y-4">
                        {renderPriceBreakdown()}
                        
                        {receipt.itemDetails.protection?.included && (
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Travel Protection</span>
                                <span className="text-sm">${receipt.itemDetails.protection.amount.toFixed(2)}</span>
                            </div>
                        )}

                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center font-medium">
                                <span>Total Amount</span>
                                <span>${receipt.paymentDetails.amount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Customer & Account Details */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Customer Info */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Customer Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">{receipt.customer.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">{receipt.customer.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">{receipt.customer.phone}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Account Info */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Account Details</h3>
                        <div className="flex items-center gap-3 mb-4">
                            {receipt.user.profilePicture ? (
                                <Image
                                    src={receipt.user.profilePicture}
                                    alt={receipt.user.name}
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
                                <div className="font-medium">{receipt.user.name}</div>
                                <div className="text-sm text-gray-500">{receipt.user.email}</div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Company Details */}
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-500">Boarding Sky</span>
                        </div>
                        <div className="text-sm text-gray-500">
                            Receipt generated on {formatDateTime(receipt.transactionDate)}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ReceiptDetailsPage;