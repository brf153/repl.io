import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { fetchS3FolderContents } from "../services/fetchFolder.js";
import path from "path";
import fs from "fs";
import { fetchDir, fetchFileContent, saveFile } from "../utils/utils.js";
import {
  clearTerminal,
  createPty,
  writeTerminal,
} from "../services/terminalManager.js";
import { saveToS3 } from "../services/saveS3.js";
import { DiffMatchPatch } from "diff-match-patch-typescript";
import { throttleS3Upload } from "../utils/throttle.js";
const dmp = new DiffMatchPatch();

const __dirname = path.resolve(path.dirname(""));
const MAX_FILE_SIZE = 500 * 1024; // 500 KB

function socketHandler(server: HttpServer) {
  try {
    const io = new Server(server, {
      cors: {
        // Should restrict this more!
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", async (socket) => {
      // Auth checks should happen here
      const replId = socket.handshake.query.roomId as string;

      if (!replId) {
        socket.disconnect();
        clearTerminal(socket.id);
        return;
      }

      await fetchS3FolderContents(
        `code/${replId}/`,
        path.join(__dirname, `../tmp/${replId}`)
      );
      socket.emit("loaded", {
        rootContent: await fetchDir(
          path.join(__dirname, `../tmp/${replId}`),
          "",
          undefined,
          0
        ),
      });

      initHandlers(socket, replId);
    });
  } catch (err) {
    console.error(`Error in socketHandler:`, err);
  }
}

function initHandlers(socket: Socket, replId: string) {
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("fetchDir", async (dir: string, callback) => {
    const dirPath = path.join(__dirname, `../tmp/${replId}/${dir}`);
    const contents = await fetchDir(dirPath, dir, undefined, 0);
    callback(contents);
  });

  socket.on(
    "fetchContent",
    async ({ path: filePath }: { path: string }, callback) => {
      const fullPath = path.join(__dirname, `../tmp/${replId}/${filePath}`);
      const data = await fetchFileContent(fullPath);
      callback(data);
    }
  );

  socket.on(
    "updateContent",
    async ({ path: filePath, diff }: { path: string; diff: string }) => {
      console.log(`[updateContent] Received update for file: ${filePath}`);

      // Optional: prevent directory traversal attacks
      if (filePath.includes("..")) {
        console.warn(
          `[updateContent] Invalid filePath (traversal detected): ${filePath}`
        );
        return;
      }

      const fullPath = path.join(__dirname, `../tmp/${replId}/${filePath}`);
      let oldContent = "";

      // Step 1: Read existing file content
      try {
        oldContent = await fs.promises.readFile(fullPath, "utf-8");
        console.log(`[updateContent] Loaded existing content from ${fullPath}`);
      } catch (err) {
        console.warn(
          `[updateContent] File not found at ${fullPath}, assuming new file.`
        );
      }

      // Step 2: Apply patch
      let newContent = "";
      let patchResults: boolean[] = [];
      try {
        const patches = dmp.patch_fromText(diff);
        [newContent, patchResults] = dmp.patch_apply(patches, oldContent);

        if (patchResults.some((r) => !r)) {
          console.error(
            "[updateContent] Patch application failed for some chunks."
          );
          return;
        }

        console.log(
          `[updateContent] Patch applied successfully. Patch length: ${diff.length}`
        );
      } catch (err) {
        console.error("[updateContent] Error while applying patch:", err);
        return;
      }

      // Step 3: Check file size
      const size = Buffer.byteLength(newContent, "utf-8");
      if (size > MAX_FILE_SIZE) {
        console.warn(
          `[updateContent] Skipping save: content too large (${size} bytes).`
        );
        return;
      }

      // Step 4: Save file locally
      try {
        await saveFile(fullPath, newContent);
        console.log(`[updateContent] File saved locally: ${fullPath}`);
      } catch (err) {
        console.error(
          `[updateContent] Failed to save file at ${fullPath}:`,
          err
        );
        return;
      }

      // Step 5: Throttle and upload to S3
      try {
        throttleS3Upload(() =>
          saveToS3(`code/${replId}/`, filePath, newContent)
            .then(() =>
              console.log(
                `[updateContent] Uploaded updated file to S3: ${filePath}`
              )
            )
            .catch((err) =>
              console.error(`[updateContent] Failed to upload to S3:`, err)
            )
        );
      } catch (err) {
        console.error(`[updateContent] Throttling failed for S3 upload:`, err);
      }
    }
  );

  socket.on("requestTerminal", async () => {
    createPty(socket.id, replId, (data, id) => {
      socket.emit("terminal", {
        data: Buffer.from(data, "utf-8"),
      });
    });
  });

  socket.on(
    "terminalData",
    async ({ data }: { data: string; terminalId: number }) => {
      writeTerminal(socket.id, data);
    }
  );
}

export default socketHandler;
