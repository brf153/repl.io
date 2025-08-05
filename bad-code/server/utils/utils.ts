import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid"; // Make sure to install uuid via `npm i uuid`

export const Type = {
  FILE: "FILE",
  DIRECTORY: "DIRECTORY",
  DUMMY: "DUMMY",
} as const;

export type Type = (typeof Type)[keyof typeof Type];

interface File {
  id: string;
  type: Type;
  name: string;
  content?: string;
  path: string;
  parentId: string | undefined;
  depth: number;
}

function writeFile(filePath: string, fileData: Buffer): Promise<void> {
  return new Promise(async (resolve, reject) => {
    await createFolder(path.dirname(filePath));

    fs.writeFile(filePath, fileData, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function createFolder(dirName: string) {
  return new Promise<void>((resolve, reject) => {
    fs.mkdir(dirName, { recursive: true }, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

const fetchDir = (
  dir: string,
  baseDir: string,
  parentId: string | undefined,
  depth: number
): Promise<File[]> => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(
          files.map((file) => ({
            id: uuidv4(),
            type: file.isDirectory() ? Type.DIRECTORY : Type.FILE,
            name: file.name,
            path: `${baseDir}/${file.name}`,
            parentId,
            depth,
          }))
        );
      }
    });
  });
};

const fetchFileContent = (file: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const saveFile = async (file: string, content: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, content, "utf8", (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

export { writeFile, createFolder, fetchDir, fetchFileContent, saveFile };
