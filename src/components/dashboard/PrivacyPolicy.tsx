// PrivacyPolicy.tsx
'use client';

import React, { useEffect, useCallback } from 'react';
import WysiwygEditor from '@/components/WysiwygEditor';
import { useDashboard } from '@/hooks/useDashboard';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const PrivacyPolicy = () => {
  const {
    privacyPolicy,
    isLoading,
    fetchPrivacyPolicy,
    updatePrivacyPolicy,
  } = useDashboard();

  // Load initial data
  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  // Handle save
  const handleSave = useCallback(async (content: string) => {
    try {
      await updatePrivacyPolicy(content);
    } catch (error) {
      console.error('Failed to update privacy policy:', error);
    }
  }, [updatePrivacyPolicy]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full flex-col gap-3">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Loading privacy policy...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="sticky top-0 z-50 w-full bg-white border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <h1 className="text-2xl font-semibold">Privacy Policy</h1>
        </div>
      </div>
      <div className="container py-6">
        <Card>
          <CardContent className="pt-6">
            <WysiwygEditor
              initialContent={privacyPolicy}
              onSave={handleSave}
              label="Edit Privacy Policy"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
