export const Type = {
  FILE: "FILE",
  DIRECTORY: "DIRECTORY",
  DUMMY: "DUMMY"
} as const;

export type Type = typeof Type[keyof typeof Type];

interface CommonProps {
  id: string;
  type: Type;
  name: string;
  content?: string;
  path: string;
  parentId: string | undefined;
  depth: number;
}

export interface File extends CommonProps {
  
}

export interface RemoteFile {
  type: "file" | "dir";
  name: string;
  path: string;
}

export interface Directory extends CommonProps {
  files: File[];
  dirs: Directory[];
}