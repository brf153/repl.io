export const Type = {
  FILE: "FILE",
  DIRECTORY: "DIRECTORY",
  DUMMY: "DUMMY",
} as const;
type Type = (typeof Type)[keyof typeof Type];

interface CommonProps {
  id: string; // 文件id
  type: Type; // 文件类型
  name: string; // 名称
  content?: string;
  path: string;
  parentId: string | undefined; // 父级目录，如果为根目录则undefined
  depth: number; // 文件深度
}

export interface File extends CommonProps {}

export interface Directory extends CommonProps {
  files: File[];
  dirs: Directory[];
}