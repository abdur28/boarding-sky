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
import { updateBlogs } from '@/lib/action';
import UploadImage from '../UploadImage';
import { useDashboard } from '@/hooks/useDashboard';
import { Textarea } from '../ui/textarea';

interface Blog {
  _id: string;
  title: string;
  subTitle: string;
  author: string;
  content: string;
  images: string[];
  published: boolean;
  publishDate: string | null;
}

type BlogFormData = Omit<Blog, '_id'>;

const initialFormState: BlogFormData = {
  title: "",
  subTitle: "",
  author: "",
  content: "",
  images: [] as string[],
  published: false,
  publishDate: null
};

const BlogForm = ({ 
  initialData,
  onSubmit,
  onCancel,
  isLoading 
}: {
  initialData: BlogFormData;
  onSubmit: (data: BlogFormData, imagesToDelete: string[]) => void;
  onCancel: () => void;
  isLoading: boolean;
}) => {
  const initialImages = initialData?.images ?? [];
  const [formData, setFormData] = useState({
    ...initialData,
    images: initialImages
  });
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<string[]>(initialImages);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  useEffect(() => {
    if (uploadedImage) {
      setUploadedImages(prev => [...(prev || []), uploadedImage]);
      setUploadedImage('');
    }
  }, [uploadedImage]);

  const handleChange = (field: keyof BlogFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'published' && {
        publishDate: value ? new Date().toLocaleDateString() : null
      })
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      images: uploadedImages || []
    }, imagesToDelete);
  };

  const handleCancel = () => {
    setImagesToDelete([]);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6 py-4">
        <UploadImage
          uploadedImages={uploadedImages}
          setUploadedImage={setUploadedImage}
          multiple={true}
          maxFiles={5}
          onRemove={(index) => {
            const imageToDelete = uploadedImages[index];
            setUploadedImages(prev => (prev || []).filter((_, i) => i !== index));
            if (imageToDelete && initialImages.includes(imageToDelete)) {
              setImagesToDelete(prev => [...prev, imageToDelete]);
            }
          }}
        />

        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter blog title"
              disabled={isLoading}
            />
          </div>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">Subtitle</label>
            <Input
              value={formData.subTitle}
              onChange={(e) => handleChange('subTitle', e.target.value)}
              placeholder="Enter blog subtitle"
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Author</label>
            <Input
              value={formData.author}
              onChange={(e) => handleChange('author', e.target.value)}
              placeholder="Enter author name"
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Content</label>
            <Textarea
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Enter blog content"
              className="min-h-[200px]"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => handleChange('published', e.target.checked)}
              disabled={isLoading}
            />
            <label className="text-sm font-medium">
              {formData.published ? 'Published' : 'Draft'}
            </label>
          </div>
        </div>
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

export default function Blogs() {
  const { blogs, getBlogs, isLoading: isDataLoading, deleteImages } = useDashboard();
  const [isPending, startTransition] = useTransition();
  const [blogsData, setBlogsData] = useState<Blog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [deletingBlog, setDeletingBlog] = useState<Blog | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    getBlogs();
  }, []);

  useEffect(() => {
    if (blogs) {
      const processedBlogs = blogs.map(blog => ({
        ...blog,
        images: blog.images || []
      }));
      setBlogsData(processedBlogs);
    }
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return blogsData.filter(blog => 
      blog.title.toLowerCase().includes(query) ||
      blog.author.toLowerCase().includes(query) ||
      blog.subTitle.toLowerCase().includes(query)
    );
  }, [blogsData, searchQuery]);

  const handleAdd = async (data: BlogFormData, imagesToDelete: string[]) => {
    setIsProcessing(true);
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'images') {
        const imagesArray = Array.isArray(value) ? value : [];
        formData.append('images', JSON.stringify(imagesArray));
      } else {
        formData.append(key, value?.toString() || '');
      }
    });

    startTransition(async () => {
      try {
        await updateBlogs(formData);
        if (imagesToDelete.length > 0) {
          deleteImages(imagesToDelete);
        }
        await getBlogs();
        setIsAddDialogOpen(false);
      } catch (error) {
        console.error('Failed to add blog:', error);
      } finally {
        setIsProcessing(false);
      }
    });
  };

  const handleUpdate = async (data: BlogFormData, imagesToDelete: string[]) => {
    if (!editingBlog) return;
    setIsProcessing(true);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'images') {
        const imagesArray = Array.isArray(value) ? value : [];
        formData.append('images', JSON.stringify(imagesArray));
      } else {
        formData.append(key, value?.toString() || '');
      }
    });
    formData.append('_id', editingBlog._id.toString());

    startTransition(async () => {
      try {
        await updateBlogs(formData);
        if (imagesToDelete.length > 0) {
          deleteImages(imagesToDelete);
        }
        await getBlogs();
        setIsEditDialogOpen(false);
        setEditingBlog(null);
      } catch (error) {
        console.error('Failed to update blog:', error);
      } finally {
        setIsProcessing(false);
      }
    });
  };

  const handleDelete = (blog: Blog) => {
    setDeletingBlog({
      ...blog,
      images: blog.images || []
    });
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingBlog) return;
    setIsProcessing(true);

    startTransition(async () => {
      try {
        const images = deletingBlog.images || [];
        
        const formData = new FormData();
        formData.append('_id', deletingBlog._id.toString());
        formData.append('action', 'delete');
        
        await updateBlogs(formData);
        if (images.length > 0) {
          deleteImages(images);
        }
        await getBlogs();
        setIsDeleteDialogOpen(false);
        setDeletingBlog(null);
      } catch (error) {
        console.error('Failed to delete blog:', error);
      } finally {
        setIsProcessing(false);
      }
    });
  };


  const handleEdit = (blog: Blog) => {
    setEditingBlog({
      ...blog,
      images: blog.images || []
    });
    setIsEditDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isDataLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Loading blogs...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by title, subtitle, or author..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Blog
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredBlogs.map((blog, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col flex-1">
              <span className="font-medium text-gray-900">{blog.title}</span>
              <span className="text-sm text-gray-500">{blog.subTitle}</span>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <span className="text-gray-600">By {blog.author}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs
                  ${blog.published ? 'text-green-600' : 'text-yellow-600'}`}
                >
                  {blog.published 
                    ? `Published on ${formatDate(blog.publishDate!)}` 
                    : 'Draft'
                  }
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 ml-4">
              <Button
                onClick={() => handleEdit(blog)}
                variant="ghost"
                size="icon"
                disabled={isProcessing}
              >
                <Pencil className="h-4 w-4 text-gray-500" />
              </Button>
              <Button
                onClick={() => handleDelete(blog)}
                variant="ghost"
                size="icon"
                disabled={isProcessing}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}

        {filteredBlogs.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No blogs found matching your criteria
          </div>
        )}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl" onClose={() => setIsAddDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Add New Blog</DialogTitle>
            <DialogDescription>
              Enter the blog details below
            </DialogDescription>
          </DialogHeader>
          <BlogForm
            initialData={initialFormState}
            onSubmit={handleAdd}
            onCancel={() => setIsAddDialogOpen(false)}
            isLoading={isProcessing}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl" onClose={() => setIsEditDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Edit Blog</DialogTitle>
            <DialogDescription>
              Update the blog details
            </DialogDescription>
          </DialogHeader>
          {editingBlog && (
            <BlogForm
              initialData={editingBlog}
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
            <AlertDialogTitle>Delete Blog</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingBlog?.title}"? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing} onCancel={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
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