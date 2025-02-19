'use client';
import React from 'react';
import WysiwygEditor from '@/components/WysiwygEditor';
import { useDashboard } from '@/hooks/useDashboard';
import { Loader2 } from 'lucide-react';

const TermsAndConditions = () => {
  const {
    termsAndConditions,
    isLoading,
    fetchTermsAndConditions,
    updateTermsAndConditions,
  } = useDashboard();

  React.useEffect(() => {
    fetchTermsAndConditions();
  }, [fetchTermsAndConditions]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Terms & Conditions</h1>
      <WysiwygEditor
        initialContent={termsAndConditions}
        onSave={updateTermsAndConditions}
      />
    </div>
  );
};

export default TermsAndConditions;