import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import TerminalComponent from './ReplComponents/Terminal'
import Sidebar from './ReplComponents/Sidebar'
import CodeEditor from './ReplComponents/CodeSpace'
import useSocket from '../utils/socket'
import { Type, type File, type RemoteFile } from '../types/FileType'

const Repl = () => {
  const { replId } = useParams<{ replId: string }>()
  const socket = useSocket(replId || '')
  const [loaded, setLoaded] = useState(false)
  const [fileStructure, setFileStructure] = useState<RemoteFile[]>([])
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  useEffect(() => {
        if (socket) {
          console.log("Socket connected:", socket);
            socket.on('loaded', ({ rootContent }: { rootContent: RemoteFile[]}) => {
              console.log("Root content loaded:", rootContent);
                setLoaded(true);
                setFileStructure(rootContent);
            });
        }
    }, [socket]);

    const onSelect = (file: File) => {
        if (file.type === Type.DIRECTORY) {
            socket?.emit("fetchDir", file.path, (data: RemoteFile[]) => {
                setFileStructure(prev => {
                    const allFiles = [...prev, ...data];
                    return allFiles.filter((file, index, self) => 
                        index === self.findIndex(f => f.path === file.path)
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
    <div className='w-screen h-screen flex flex-row justify-between bg-black text-white'>
      <div className='w-[10%]'><Sidebar socket={socket} selectedFile={selectedFile} onSelect={onSelect} files={fileStructure} /></div>
      <div className='bg-[#1e1e1e] w-[55%]'><CodeEditor socket={socket} /></div>
      <div className='w-[35%]'><TerminalComponent socket={socket} /></div>
    </div>
  )
}

export default Repl