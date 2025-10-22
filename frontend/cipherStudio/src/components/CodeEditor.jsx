import React, { useState, useEffect } from 'react';
import { 
  SandpackProvider, 
  SandpackLayout, 
  SandpackCodeEditor, 
  SandpackPreview,
  SandpackFileExplorer
} from '@codesandbox/sandpack-react';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';
import { SaveIcon, PlayIcon } from 'lucide-react';

const SandpackEditor = ({ files }) => {
  const { axios } = useAppContext();
  const [sandpackFiles, setSandpackFiles] = useState({});
  const [activeFile, setActiveFile] = useState('/App.js');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const formatted = {};
    files.forEach(file => {
      if (file.type === 'file') {
        const path = getFilePath(file, files);
        formatted[path] = {
          code: file.content || '',
        };
      }
    });

    if (Object.keys(formatted).length === 0) {
      formatted['/App.js'] = {
        code: `export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Welcome to CipherStudio!</h1>
      <p>Start editing to see live changes.</p>
    </div>
  );
}`
      };
      formatted['/index.js'] = {
        code: `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);`
      };
    }

    setSandpackFiles(formatted);
  }, [files]);

  const getFilePath = (file, allFiles) => {
    const parts = [file.name];
    let current = file;
    
    while (current.parentId) {
      const parent = allFiles.find(f => f._id === current.parentId);
      if (!parent) break;
      parts.unshift(parent.name);
      current = parent;
    }
    
    return '/' + parts.join('/');
  };

  const saveAllFiles = async () => {
    try {
      setSaving(true);
      
      const updates = Object.entries(sandpackFiles).map(([path, { code }]) => {
        const file = files.find(f => getFilePath(f, files) === path);
        if (file && file.content !== code) {
          return axios.put(`/api/files/${file._id}`, { content: code });
        }
        return null;
      }).filter(Boolean);

      if (updates.length > 0) {
        await Promise.all(updates);
        toast.success('All files saved!');
      } else {
        toast.success('No changes to save');
      }
    } catch (error) {
      toast.error('Failed to save files');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="bg-gray-800 px-4 py-2 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center gap-4">
          <span className="text-white text-sm font-medium">Live Editor</span>
          <span className="text-gray-400 text-xs">
            {Object.keys(sandpackFiles).length} files
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={saveAllFiles}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm disabled:opacity-50 transition"
          >
            <SaveIcon className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save All'}
          </button>
        </div>
      </div>

      {/* Sandpack Editor */}
      <div className="flex-1 overflow-hidden">
        <SandpackProvider
          template="react"
          files={sandpackFiles}
          theme="dark"
          options={{
            autorun: true,
            autoReload: true,
            showNavigator: true,
            showTabs: true,
            showLineNumbers: true,
            showInlineErrors: true,
            wrapContent: true,
            editorHeight: '100%',
            activeFile: activeFile,
          }}
        >
          <SandpackLayout style={{ height: '100%' }}>
            {/* File Explorer */}
            <SandpackFileExplorer style={{ height: '100%' }} />
            
            {/* Code Editor */}
            <SandpackCodeEditor
              style={{ height: '100%' }}
              showTabs
              showLineNumbers
              showInlineErrors
              wrapContent
              closableTabs
            />
            
            {/* Live Preview */}
            <SandpackPreview
              style={{ height: '100%' }}
              showNavigator
              showRefreshButton
              showOpenInCodeSandbox={false}
            />
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>
  );
};

export default SandpackEditor;