// WysiwygEditor.tsx
'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Loader2 } from 'lucide-react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// Import Editor dynamically
const Editor = dynamic(
  () => import('react-draft-wysiwyg').then(mod => mod.Editor),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-[500px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }
);

interface WysiwygEditorProps {
  initialContent?: string;
  onSave: (content: string) => Promise<void>;
  label?: string;
}

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  initialContent = '',
  onSave,
  label
}) => {
  // Track if component is mounted
  const [mounted, setMounted] = useState(false);
  
  // Initialize with empty state
  const [editorState, setEditorState] = useState<EditorState>(() => 
    EditorState.createEmpty()
  );
  
  const [isSaving, setIsSaving] = useState(false);

  // Handle initial content loading
  useEffect(() => {
    setMounted(true);
    
    const initializeEditor = async () => {
      if (initialContent) {
        try {
          // Dynamically import html-to-draftjs
          const htmlToDraft = (await import('html-to-draftjs')).default;
          const contentBlock = htmlToDraft(initialContent);
          
          if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(
              contentBlock.contentBlocks,
              contentBlock.entityMap
            );
            const newEditorState = EditorState.createWithContent(contentState);
            setEditorState(newEditorState);
          }
        } catch (error) {
          console.error('Error loading editor content:', error);
        }
      }
    };

    initializeEditor();

    // Cleanup
    return () => {
      setMounted(false);
    };
  }, [initialContent]);

  // Handle editor state changes
  const handleEditorStateChange = (newState: EditorState) => {
    if (mounted) {
      setEditorState(newState);
    }
  };

  // Handle save action
  const handleSave = async () => {
    if (!mounted) return;

    setIsSaving(true);
    try {
      const contentState = editorState.getCurrentContent();
      const rawContent = convertToRaw(contentState);
      const htmlContent = draftToHtml(rawContent);
      await onSave(htmlContent);
    } catch (error) {
      console.error('Error saving content:', error);
    } finally {
      if (mounted) {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      {label && (
        <div className="text-lg font-semibold">{label}</div>
      )}
      
      <div className="min-h-[500px] border rounded-lg overflow-hidden">
        <Editor
          editorState={editorState}
          onEditorStateChange={handleEditorStateChange}
          wrapperClassName="wrapper-class w-full"
          editorClassName="editor-class px-4 py-2 min-h-[450px]"
          toolbarClassName="toolbar-class sticky top-0 z-50 !justify-start"
          toolbar={{
            options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'history', 'embedded', 'emoji', 'image'],
            inline: { inDropdown: false },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            history: { inDropdown: false },
          }}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {isSaving ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </div>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  );
};

export default WysiwygEditor;