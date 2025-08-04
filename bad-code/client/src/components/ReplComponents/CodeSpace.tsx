import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import useDebounce from "lodash.debounce";
import type { File } from "../../types/FileType";

type Props = {
  socket: any; // Replace with actual socket type if available
  file: File | undefined; // Add file prop
};

const languageRender = (fileName: string | undefined) => {
  if (!fileName) return "javascript";
  const extension = fileName.split(".").pop();
  switch (extension) {
    case "js":
      return "javascript";
    case "py":
      return "python";
    case "java":
      return "java";
    case "ts":
      return "typescript";
    case "html":
      return "html";
    case "css":
      return "css";
    case "json":
      return "json";
    default:
      return "plaintext";
  }
};

const CodeEditor: React.FC<Props> = ({ socket, file }: Props) => {
  const [code, setCode] = useState("// Write your code here");

  useEffect(() => {
    if (file?.content) {
      setCode(file.content);
    }
  }, [file]);

  const handleCodeChange = useDebounce((value: string) => {
    if (socket && file) {
      socket.emit("updateContent", { path: file.name, content: value }); // Adjust path as needed
    }
  }, 300);

  return (
    <div className="flex-1 bg-[#1e1e1e] w-full h-full">
      <Editor
        height="100%"
        theme="vs-dark"
        value={code}
        language={languageRender(file?.name)} // Use file extension for language
        onChange={(value) => {
          setCode(value || "");
          handleCodeChange(value || "");
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
