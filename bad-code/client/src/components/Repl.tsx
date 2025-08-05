import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import TerminalComponent from "./ReplComponents/Terminal";
import CodeEditor from "./ReplComponents/CodeSpace";
import useSocket from "../utils/socket";
import { buildFileTree, Type, type File } from "../types/FileType";
import Sidebar from "./ReplComponents/sidebar/sidebar";
import { FileTree } from "./ReplComponents/sidebar/file-tree";

const Repl = () => {
  const { replId } = useParams<{ replId: string }>();
  const socket = useSocket(replId || "");
  const [loaded, setLoaded] = useState(false);
  const [fileStructure, setFileStructure] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  const rootDir = useMemo(() => {
    return buildFileTree(fileStructure);
  }, [fileStructure]);

  useEffect(() => {
    if (socket) {
      socket.on("loaded", ({ rootContent }: { rootContent: File[] }) => {
        setLoaded(true);
        setFileStructure(rootContent);
      });
    }
  }, [socket]);

  const onSelect = (file: File) => {
    if (file.type === Type.DIRECTORY) {
      socket?.emit("fetchDir", file.path, (data: File[]) => {
        setFileStructure((prev) => {
          const allFiles = [...prev, ...data];
          return allFiles.filter(
            (file, index, self) =>
              index === self.findIndex((f) => f.path === file.path)
          );
        });
      });
    } else {
      socket?.emit("fetchContent", { path: file.path }, (data: string) => {
        file.content = data;
        setSelectedFile(file);
      });
    }
  };

  if (!loaded) {
    return "Loading...";
  }

  return (
    <div className="w-screen h-screen flex flex-row justify-between bg-black text-white">
      <div className="w-[15%]">
        <Sidebar>
          <FileTree
            rootDir={rootDir}
            selectedFile={selectedFile}
            onSelect={onSelect}
          />
        </Sidebar>
      </div>
      <div className="bg-[#1e1e1e] w-[55%]">
        <CodeEditor socket={socket} file={selectedFile} />
      </div>
      <div className="w-auto">
        <TerminalComponent socket={socket} />
      </div>
    </div>
  );
};

export default Repl;
