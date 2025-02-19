'use client';
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
);

const htmlToDraft = dynamic(
  () => import('html-to-draftjs').then((mod) => mod.default),
  { ssr: false }
);

interface WysiwygEditorProps {
  initialContent?: string;
  setContent: (content: string) => void;
}

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({ initialContent, setContent }) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    if (initialContent && htmlToDraft) {
      const contentBlock = htmlToDraft(initialContent);
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, [initialContent]);

  const handleChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
    const content = draftToHtml(convertToRaw(newEditorState.getCurrentContent()));
    setContent(content);
  };

  return (
    <div>
      <Editor
        editorState={editorState}
        onEditorStateChange={handleChange}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
      />
    </div>
  );
};

export default WysiwygEditor;