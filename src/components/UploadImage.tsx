'use client'

import { useState, useCallback } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { Trash2, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadImageProps {
  setUploadedImage: React.Dispatch<React.SetStateAction<string>>;
  uploadedImages: Array<string>;
  multiple?: boolean;
  maxFiles?: number;
  onRemove?: (index: number) => void;
}



export default function UploadImage({ 
  setUploadedImage, 
  uploadedImages, 
  multiple = false,
  maxFiles = 1,
  onRemove
}: UploadImageProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [loadingImages, setLoadingImages] = useState<{ [key: string]: boolean }>(
    uploadedImages.reduce((acc, url) => ({ ...acc, [url]: true }), {})
  );

  const handleUploadSuccess = useCallback((result: any) => {
    setIsUploading(false);
    const imageUrl = result.info.secure_url;
    setUploadedImage(imageUrl);
  }, [setUploadedImage]);

  const handleImageLoad = useCallback((imageUrl: string) => {
    setLoadingImages(prev => ({ ...prev, [imageUrl]: false }));
  }, []);

  const renderUploadButton = useCallback(({ open }: { open?: () => void }) => {
    const handleClick = () => {
      setIsUploading(true);
      if (typeof open === 'function') {
        open();
      } else {
        // If open is not available, reset the loading state
        setIsUploading(false);
        console.warn('Cloudinary widget not properly initialized');
      }
    };

    if (multiple && (!maxFiles || uploadedImages.length < maxFiles)) {
      return (
        <Button
          type="button"
          variant="outline"
          className="w-24 h-24 flex flex-col items-center justify-center gap-2 border-2 border-dashed hover:bg-gray-50"
          onClick={handleClick}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          ) : (
            <>
              <Upload className="h-6 w-6 text-gray-400" />
              <span className="text-xs text-gray-500">Upload</span>
            </>
          )}
        </Button>
      );
    }

    return (
      <Button
        type="button"
        variant="outline"
        className="flex items-center gap-2"
        onClick={handleClick}
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
        <span>{isUploading ? "Opening..." : "Upload Image"}</span>
      </Button>
    );
  }, [isUploading, multiple, maxFiles, uploadedImages.length]);

  const renderImage = useCallback((image: string, index: number) => (
    <div key={index} className="relative w-24 h-24">
      {loadingImages[image] && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        </div>
      )}
      <img
        src={image}
        alt={`Uploaded image ${index + 1}`}
        className="w-24 h-24 object-cover rounded-md"
        onLoad={() => handleImageLoad(image)}
      />
      {onRemove && !loadingImages[image] && (
        <button
          onClick={() => onRemove(index)}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      )}
    </div>
  ), [loadingImages, onRemove, handleImageLoad]);

  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium">{multiple ? 'Images' : 'Image'}</label>
      <div className="flex flex-wrap gap-4">
        {multiple ? (
          uploadedImages.map((image, index) => renderImage(image, index))
        ) : (
          uploadedImages[0] && renderImage(uploadedImages[0], 0)
        )}

        <CldUploadWidget 
          uploadPreset="boarding-sky"
          options={{
            maxFiles: multiple ? maxFiles : 1,
            clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
            sources: ["local", "url", "camera"],
            showUploadMoreButton: multiple,
          }}
          onSuccess={handleUploadSuccess}
          onError={() => setIsUploading(false)}
          onClose={() => setIsUploading(false)}
        >
          {(props) => renderUploadButton(props as { open?: () => void })}
        </CldUploadWidget>
      </div>
    </div>
  );
}