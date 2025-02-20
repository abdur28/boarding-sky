
'use client';

import React, { useEffect, useCallback } from 'react';
import WysiwygEditor from '@/components/WysiwygEditor';
import { useDashboard } from '@/hooks/useDashboard';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const TermsAndConditions = () => {
  const {
    termsAndConditions,
    isLoading,
    fetchTermsAndConditions,
    updateTermsAndConditions,
  } = useDashboard();

  // Load initial data
  useEffect(() => {
    fetchTermsAndConditions();
  }, []);

  // Handle save
  const handleSave = useCallback(async (content: string) => {
    try {
      await updateTermsAndConditions(content);
    } catch (error) {
      console.error('Failed to update terms and conditions:', error);
    }
  }, [updateTermsAndConditions]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full flex-col gap-3">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Loading terms and conditions...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="sticky top-0 z-50 w-full bg-white border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <h1 className="text-2xl font-semibold">Terms & Conditions</h1>
        </div>
      </div>
      <div className="container py-6">
        <Card>
          <CardContent className="pt-6">
            <WysiwygEditor
              initialContent={termsAndConditions}
              onSave={handleSave}
              label="Edit Terms & Conditions"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsAndConditions;