import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import debounce from "lodash.debounce";
import type { File } from "../../types/FileType";
import { Socket } from "socket.io-client";
import { DiffMatchPatch } from 'diff-match-patch-typescript';

const dmp = new DiffMatchPatch();

type Props = {
  socket: typeof Socket | null;
  file: File | undefined;
};

const languageRender = (fileName: string | undefined) => {
  if (!fileName) return "javascript";
  const extension = fileName.split(".").pop();
  switch (extension) {
    case "js": return "javascript";
    case "py": return "python";
    case "java": return "java";
    case "ts": return "typescript";
    case "html": return "html";
    case "css": return "css";
    case "json": return "json";
    default: return "plaintext";
  }
};

const CodeEditor: React.FC<Props> = ({ socket, file }) => {
  const [code, setCode] = useState("// Write your code here");

  // 🔁 Store the previous version to diff against
  const previousContentRef = useRef<string>("");

  useEffect(() => {
    if (file?.content) {
      setCode(file.content);
      previousContentRef.current = file.content;
    }
  }, [file]);

  const handleCodeChange = debounce((value: string) => {
    if (socket && file) {
      const oldText = previousContentRef.current;
      const newText = value;

      // 🧠 Compute the diff
      const diffs = dmp.diff_main(oldText, newText);
      if (diffs.length === 1 && diffs[0][0] === 0) return; // No change

      dmp.diff_cleanupEfficiency(diffs);
      const patches = dmp.patch_make(oldText, diffs);
      const patchText = dmp.patch_toText(patches);

      // Emit diff
      socket.emit("updateContent", {
        path: file.name,
        diff: patchText,
      });

      // Update reference to latest content
      previousContentRef.current = newText;
    }
  }, 300);

  return (
    <div className="flex-1 bg-[#1e1e1e] w-full h-full">
      <Editor
        height="100%"
        theme="vs-dark"
        value={code}
        language={languageRender(file?.name)}
        onChange={(value) => {
          const newValue = value || "";
          setCode(newValue);
          handleCodeChange(newValue);
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