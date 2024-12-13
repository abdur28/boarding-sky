'use client';

import React, { useState, useMemo } from 'react';
import { Search, Calendar, Receipt } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TRANSACTION_TYPES = ["All", "Flights", "Hotels", "Cars", "Tours"];
const TRANSACTION_STATUS = ["All", "Success", "Failed", "Pending", "Refunded"];

// Sample data - replace with your actual data source
const SAMPLE_TRANSACTIONS = [
  {
    id: "TXN-001",
    receiptId: "RCP-2024-001",
    userEmail: "john.doe@example.com",
    description: "Flight Booking - New York to London",
    type: "Flights",
    status: "Success",
    date: "2024-03-15",
    price: 850.00
  },
  {
    id: "TXN-002",
    receiptId: "RCP-2024-002",
    userEmail: "jane.smith@example.com",
    description: "Luxury Hotel Booking - 5 nights",
    type: "Hotels",
    status: "Pending",
    date: "2024-03-16",
    price: 1200.00
  },
  {
    id: "TXN-003",
    receiptId: "RCP-2024-003",
    userEmail: "abdurrahmanidris28@gmail.com",
    description: "City Tour Package - Paris",
    type: "Tours",
    status: "Failed",
    date: "2024-03-17",
    price: 299.99
  },
  {
    id: "TXN-004",
    receiptId: "RCP-2024-004",
    userEmail: "Abdurrahmanidris28@gmail.com",
    description: "Car Rental - SUV",
    type: "Cars",
    status: "Refunded",
    date: "2024-03-18",
    price: 450.00
  }
];

interface TransactionsProps {
  userAsString: string;
}

export default function Transactions({ userAsString }: TransactionsProps) {
  const user = JSON.parse(userAsString);
  const role = user?.role?.toLowerCase() || "user";
  const isHigherRole = role === 'admin' || role === 'manager';

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredTransactions = useMemo(() => {
    let filtered = SAMPLE_TRANSACTIONS;
    
    // If not admin/manager, only show user's own transactions
    if (!isHigherRole) {
      filtered = SAMPLE_TRANSACTIONS.filter(transaction => 
        transaction.userEmail.toLowerCase() === user.email.toLowerCase()
      );
    }

    return filtered.filter(transaction => {
      const matchesSearch = searchQuery.toLowerCase() === "" || 
        (isHigherRole && transaction.userEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
        transaction.receiptId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = selectedType === "All" || transaction.type === selectedType;
      const matchesStatus = selectedStatus === "All" || transaction.status === selectedStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchQuery, selectedType, selectedStatus, isHigherRole, user.email]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Flights":
        return "bg-blue-100 text-blue-800";
      case "Hotels":
        return "bg-purple-100 text-purple-800";
      case "Cars":
        return "bg-orange-100 text-orange-800";
      case "Tours":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Success":
        return "text-green-600";
      case "Failed":
        return "text-red-600";
      case "Pending":
        return "text-yellow-600";
      case "Refunded":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const renderTransaction = (transaction: typeof SAMPLE_TRANSACTIONS[0]) => (
    <div
      key={transaction.id}
      className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow space-y-4 md:space-y-0"
    >
      <div className="flex flex-col space-y-2 flex-1">
        <div className="flex items-center space-x-2">
          <Receipt className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-gray-900">
            {transaction.receiptId}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(transaction.type)}`}>
            {transaction.type}
          </span>
        </div>
        
        {/* Only show email for admin/manager */}
        {isHigherRole && (
          <span className="text-sm text-gray-500">
            {transaction.userEmail}
          </span>
        )}
        
        <span className="text-sm text-gray-700">
          {transaction.description}
        </span>
      </div>
      
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
        <div className="flex items-center space-x-2 text-gray-500">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">
            {new Date(transaction.date).toLocaleDateString()}
          </span>
        </div>
        
        <span className={`font-medium ${getStatusColor(transaction.status)}`}>
          {transaction.status}
        </span>
        
        <span className="font-medium text-lg">
          ${transaction.price.toFixed(2)}
        </span>
      </div>
    </div>
  );

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
                {type}
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
                {status}
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