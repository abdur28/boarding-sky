'use client'

import { useEffect, useRef, useState } from 'react';
import { useClerk } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';

export default function Settings() {
  const clerk = useClerk();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const mountProfile = async () => {
      if (!containerRef.current) return;

      try {
        if (mounted) {
          clerk.mountUserProfile(containerRef.current);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error mounting UserProfile:', error);
        if (mounted) setIsLoading(false);
      }
    };

    mountProfile();

    return () => {
      mounted = false;
      if (containerRef.current) {
        clerk.unmountUserProfile(containerRef.current);
      }
    };
  }, [clerk]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <div 
        ref={containerRef} 
        className={isLoading ? 'opacity-0' : 'opacity-100'}
      />
    </div>
  );
}