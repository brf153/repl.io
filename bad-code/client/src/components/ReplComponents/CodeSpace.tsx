import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import useDebounce from 'lodash.debounce';
import type { File } from '../../types/FileType';

type Props = {
  socket: any; // Replace with actual socket type if available
  file: File | undefined; // Add file prop
}

const CodeEditor: React.FC<Props> = ({ socket, file }: Props) => {
  const [code, setCode] = useState('// Write your code here');

  useEffect(() => {
    if(file?.content){
      setCode(file.content)
    }
  }, [file]);

  const handleCodeChange = useDebounce((value: string) => {
    console.log("Code changed:", value, socket && file);
    if(socket && file){
      console.log("Emitting updateContent for file:", file.name);
      socket.emit('updateContent', { path: file.name, content: value }); // Adjust path as needed
    }
  }, 300);

  return (
    <div className="flex-1 bg-[#1e1e1e] w-full h-full">
      <Editor
        height="100%"
        theme="vs-dark"
        language="javascript"
        value={code}
        onChange={(value) => {
          setCode(value || '');
          handleCodeChange(value || '');
        }}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
};

export default CodeEditor;
