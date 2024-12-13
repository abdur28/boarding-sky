import React, { useState, useMemo, useEffect, useTransition } from 'react';
import { Search, Pencil, Trash2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDashboard } from '@/hooks/useDashboard';
import { updateUser, deleteUser } from '@/lib/action';

const ROLES = ["admin", "manager", "editor", "user"] as const;
type Role = typeof ROLES[number];

interface User {
  _id: string;
  clerkId: string;
  firstName: string;
  lastName: string;
  userName: string;
  profilePicture: string;
  email: string;
  role: Role;
}

export default function Users() {
  const { users, getUsers, isLoading: isDataLoading } = useDashboard();
  const [isPending, startTransition] = useTransition();
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [usersData, setUsersData] = useState<User[]>([]);

  // Edit modal state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<Role>("user");

  // Delete dialog state
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (users) {
      setUsersData(users);
    }
  }, [users]);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setNewRole(user.role);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    setDeletingUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmEdit = async () => {
    if (!editingUser) return;
    setIsProcessing(true);

    const formData = new FormData();
    formData.append('_id', editingUser._id);
    formData.append('role', newRole);

    startTransition(async () => {
      try {
        await updateUser(formData);
        await getUsers();
        setIsEditDialogOpen(false);
        setEditingUser(null);
      } catch (error) {
        console.error('Failed to update user role:', error);
      } finally {
        setIsProcessing(false);
      }
    });
  };

  const confirmDelete = async () => {
    if (!deletingUser) return;
    setIsProcessing(true);
  
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('_id', deletingUser._id);
        // Add clerkId if available in your user object
        if (deletingUser.clerkId) {
          formData.append('clerkId', deletingUser.clerkId);
        }
  
        const result = await deleteUser(formData);
        if (result.success) {
          await getUsers();
          setIsDeleteDialogOpen(false);
          setDeletingUser(null);
        } else {
          console.error('Failed to delete user');
        }
      } catch (error) {
        console.error('Failed to delete user:', error);
      } finally {
        setIsProcessing(false);
      }
    });
  };

  const filteredUsers = useMemo(() => {
    return usersData.filter(user => {
      const matchesSearch = searchQuery.toLowerCase() === "" || 
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.userName?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = selectedRole === "all" || user.role === selectedRole;
      
      return matchesSearch && matchesRole;
    });
  }, [searchQuery, selectedRole, usersData]);

  if (isDataLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Loading users...</p>
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
            placeholder="Search by name, username, or email..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={selectedRole}
          onValueChange={setSelectedRole}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {ROLES.map(role => (
              <SelectItem key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Users List */}
      <div className="grid gap-4">
        {filteredUsers.map(user => (
          <div
            key={user._id}
            className="flex items-center justify-between p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <img
                src={user.profilePicture || '/hero.png'}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-10 h-10 rounded-full object-cover bg-gray-100"
              />
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-sm text-gray-500">
                  {user.email}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm ${
                user.role === "admin" 
                  ? "bg-blue-100 text-blue-800" 
                  : user.role === "manager"
                  ? "bg-green-100 text-green-800"
                  : user.role === "editor"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>

              <Button
                onClick={() => handleEdit(user)}
                variant="ghost"
                size="icon"
                disabled={isProcessing}
              >
                <Pencil className="h-4 w-4 text-gray-500" />
              </Button>
              <Button
                onClick={() => handleDelete(user)}
                variant="ghost"
                size="icon"
                disabled={isProcessing}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No users found matching your criteria
          </div>
        )}
      </div>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent onClose={() => setIsEditDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Change role for {editingUser?.firstName} {editingUser?.lastName}
            </DialogDescription>
          </DialogHeader>
          <Select
            value={newRole}
            onValueChange={setNewRole as (value: string) => void}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select new role" />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map(role => (
                <SelectItem key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmEdit}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingUser?.firstName} {deletingUser?.lastName}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
            onCancel={() => setIsDeleteDialogOpen(false)}
            disabled={isProcessing}>Cancel</AlertDialogCancel>
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