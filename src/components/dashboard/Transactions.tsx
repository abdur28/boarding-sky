'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Calendar, Receipt, Shield, Download, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { useDashboard } from '@/hooks/useDashboard';

const TRANSACTION_TYPES = ["All", "flight", "hotel", "car", "tour"];
const TRANSACTION_STATUS = ["All", "paid", "failed", "refunded"];

interface TransactionsProps {
  userAsString: string;
}

export default function Transactions({ userAsString }: TransactionsProps) {
  const user = JSON.parse(userAsString);
  const role = user?.role?.toLowerCase() || "user";
  const isHigherRole = role === 'admin' || role === 'manager';

  const { receipts, isLoading, getReceipts } = useDashboard();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  useEffect(() => {
    getReceipts(isHigherRole ? 'all' : user._id);
  }, [getReceipts, isHigherRole, user._id]);

  const filteredTransactions = useMemo(() => {
    return receipts.filter(receipt => {
      const matchesSearch = searchQuery.toLowerCase() === "" || 
        (isHigherRole && receipt.user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        receipt.receiptId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        receipt.itemDetails.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = selectedType === "All" || receipt.bookingType === selectedType;
      const matchesStatus = selectedStatus === "All" || receipt.status === selectedStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [receipts, searchQuery, selectedType, selectedStatus, isHigherRole]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "flight":
        return "bg-blue-100 text-blue-800";
      case "hotel":
        return "bg-purple-100 text-purple-800";
      case "car":
        return "bg-orange-100 text-orange-800";
      case "tour":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      case "refunded":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const renderTransaction = (receipt: any) => (
    <Card
      key={receipt.receiptId}
      className="p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => window.location.href = `/receipt/${receipt.receiptId}`}
    >
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{receipt.receiptId}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(receipt.bookingType)}`}>
                {receipt.bookingType}
              </span>
            </div>
            
            {isHigherRole && (
              <div className="text-sm text-gray-500">
                {receipt.user.name} ({receipt.user.email})
              </div>
            )}
            
            <div className="text-sm font-medium">{receipt.itemDetails.description}</div>
          </div>

          <div className="flex flex-col md:items-end gap-2">
            <div className={`font-medium ${getStatusColor(receipt.status)}`}>
              {receipt.status}
            </div>
            <div className="text-lg font-bold">
              ${receipt.paymentDetails.amount.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-500">Transaction ID</div>
            <div className="font-medium truncate">{receipt.paymentDetails.transactionId}</div>
          </div>
          <div>
            <div className="text-gray-500">Payment Method</div>
            <div className="font-medium capitalize">{receipt.paymentDetails.paymentMethod}</div>
          </div>
          <div>
            <div className="text-gray-500">Date</div>
            <div className="font-medium">{format(parseISO(receipt.transactionDate), 'MMM dd, yyyy HH:mm')}</div>
          </div>
          {isHigherRole && (<div>
            <div className="text-gray-500">Provider</div>
            <div className="font-medium">{receipt.provider}</div>
          </div>)}
        </div>

        {/* Extra Info */}
        {receipt.itemDetails.protection?.included && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Shield className="h-4 w-4" />
            <span>Travel Protection Included (${receipt.itemDetails.protection.amount.toFixed(2)})</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/receipt/${receipt.receiptId}`}>
              <Receipt className="h-4 w-4 mr-2" />
              View Details
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Loading Receipts...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      {/* Filters Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder={isHigherRole 
              ? "Search by receipt ID, email or description..." 
              : "Search by receipt ID or description..."}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={selectedType}
          onValueChange={setSelectedType}
        >
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {TRANSACTION_TYPES.map(type => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedStatus}
          onValueChange={setSelectedStatus}
        >
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {TRANSACTION_STATUS.map(status => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Transactions List */}
      <div className="grid gap-4">
        {filteredTransactions.map(renderTransaction)}

        {filteredTransactions.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No transactions found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
}