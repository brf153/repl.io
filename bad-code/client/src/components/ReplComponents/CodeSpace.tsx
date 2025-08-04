import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

type Props = {
  socket: any; // Replace with actual socket type if available
}

const CodeEditor: React.FC<Props> = ({ socket }: Props) => {
  const [code, setCode] = useState('// Write your code here');

  return (
    <div className="flex-1 bg-[#1e1e1e] w-full h-full">
      <Editor
        height="100%"
        theme="vs-dark"
        language="javascript"
        value={code}
        onChange={(value) => setCode(value || '')}
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
