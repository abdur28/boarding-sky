'use client';
import React, { useEffect, useState } from 'react';
import WysiwygEditor from '@/components/WysiwygEditor';
import { useDashboard } from '@/hooks/useDashboard';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

const PrivacyPolicy = () => {
  const [isSaving, setIsSaving] = useState(false);  
  const [content, setContent] = useState('');
  const {
    privacyPolicy,
    isLoading,
    fetchPrivacyPolicy,
    updatePrivacyPolicy,
  } = useDashboard();

  useEffect(() => {
    fetchPrivacyPolicy();
  }, [fetchPrivacyPolicy]);

  useEffect(() => {
    if (privacyPolicy) {
      setContent(privacyPolicy);
    }
  }, [privacyPolicy]);

  if (isLoading && !isSaving) {
    return (
      <div className="flex items-center justify-center h-full flex-col gap-3">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Loading privacy policy...</p>
      </div>
    );
  }

    const handleSave = async () => {
      setIsSaving(true);
      console.log(content);
    //   try {
    //     await updatePrivacyPolicy(content);
    //   } catch (error) {
    //     console.error('Failed to update privacy policy:', error);
    //   } finally {
    //     setIsSaving(false);
    //   }
    }  



  return (
    <div className="w-full h-full">

      <div className="sticky top-0 z-50 w-full bg-white border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-2xl font-semibold">Configuration</h1>
          <Button 
            className="w-24"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving
              </>
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </div>
      <div className="container py-6 space-y-6">
        {/* Services Configuration */}
        <Card>
            <CardContent>
                <WysiwygEditor
                    initialContent={content}
                    setContent={setContent}
                />
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;