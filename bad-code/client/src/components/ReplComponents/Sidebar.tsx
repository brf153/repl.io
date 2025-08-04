import type { File } from "../../types/FileType";

type Props = {
  socket: any,
  selectedFile: any,
  onSelect: any,
  files: any
};

const Sidebar = (props: Props) => {
  return (
    <div className="flex flex-col gap-10 items-center h-full text-white">
        <div className="text-2xl font-bold mt-4">
            Repl.io
        </div>
        <div className="flex flex-col text-left w-full">
            {props.files.map((file: File, index: number) => (
              <div
                key={index}
                className={`w-full py-1 pl-4 ${props.selectedFile?.id === file.id ? 'bg-gray-700' : ''}`}
                onClick={() => props.onSelect(file)}
              >
                {file.name}
              </div>
            ))}
        </div>
    </div>
  )
}

export default Sidebar