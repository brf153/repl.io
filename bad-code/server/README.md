# Repl.io Server

This is the backend server for the Repl.io project. It provides REST APIs and real-time socket communication for a collaborative online code editor and terminal environment, similar to Replit.

## Tech Stack

- **Node.js**: JavaScript runtime for building scalable server-side applications.
- **TypeScript**: Strongly typed language for maintainable code.
- **Express**: Web framework for REST APIs.
- **Socket.IO**: Real-time bidirectional communication for collaborative editing and terminal.
- **AWS S3 (via @aws-sdk/client-s3)**: Cloud storage for code environments and files.
- **node-pty**: Provides pseudo-terminal (PTY) for shell access in the browser.
- **dotenv**: Loads environment variables from `.env`.
- **uuid**: Generates unique IDs for files and directories.
- **lodash.throttle**: Throttles S3 uploads to avoid excessive requests.
- **diff-match-patch-typescript**: Efficiently computes and applies text diffs for collaborative editing.

## Folder Structure

- `controllers/`: Express route handlers (e.g., [`controllers/aws.ts`](controllers/aws.ts)).
- `routes/`: Express routers (e.g., [`routes/api.ts`](routes/api.ts)).
- `services/`: Business logic for S3 operations, terminal management, etc.
- `sockets/`: Socket.IO event handlers ([`sockets/socketHandler.ts`](sockets/socketHandler.ts)).
- `utils/`: Utility functions for file operations, throttling, etc.

## Environment Variables

Configured in `.env` (see `.env.sample` for template):

- `PORT`: Server port (default 4000)
- `BUCKET_NAME`: AWS S3 bucket name
- `AWS_REGION`: AWS region
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`: AWS credentials

## Main Features & Flow

### 1. REST API

- **POST `/v1/create-repl`**  
  Handled by [`controllers/aws.ts`](controllers/aws.ts).  
  - Copies a base template folder from S3 (`base/{tech}`) to a new code environment (`code/{replName}`) in S3.
  - Used to initialize a new REPL environment for a user.

### 2. Socket.IO Real-Time Collaboration

Handled by [`sockets/socketHandler.ts`](sockets/socketHandler.ts):

- **Connection**:  
  - On client connect, downloads the user's code environment from S3 to a local `tmp/{replId}` folder.
  - Emits the file structure to the client.

- **File Tree & Content**:  
  - `fetchDir`: Returns directory contents.
  - `fetchContent`: Returns file content.

- **Code Editing**:  
  - `updateContent`: Receives diffs from the client, applies them using diff-match-patch, saves locally, and uploads to S3 (throttled).

- **Terminal**:  
  - `requestTerminal`: Spawns a shell using node-pty, streams output to the client.
  - `terminalData`: Receives commands from the client and writes to the shell.

### 3. S3 Integration

- **Copy Folder**:  
  [`services/copyFolder.ts`](services/copyFolder.ts) copies all objects from a base template to a new code environment.

- **Fetch Folder**:  
  [`services/fetchFolder.ts`](services/fetchFolder.ts) downloads all files for a REPL from S3 to local disk.

- **Save File**:  
  [`services/saveS3.ts`](services/saveS3.ts) uploads updated files to S3.

### 4. File Operations

- [`utils/utils.ts`](utils/utils.ts):  
  - Reads/writes files and directories.
  - Generates file metadata for the frontend file tree.

### 5. Terminal Management

- [`services/terminalManager.ts`](services/terminalManager.ts):  
  - Manages PTY processes per socket connection.
  - Handles shell input/output.

### 6. Throttling

- [`utils/throttle.ts`](utils/throttle.ts):  
  - Throttles S3 uploads to avoid excessive requests (uploads at most once every 5 seconds per file).

## Development

- **Start Server**:  
  ```sh
  npm run dev
  ```
- **Environment**:  
  Ensure `.env` is configured with valid AWS credentials and bucket.

## Security Notes

- No authentication or user isolation is implemented (for learning/demo only).
- Directory traversal is checked in file paths.
- CORS is open (`origin: *`); restrict in production.

## References

- [Express](https://expressjs.com/)
- [Socket.IO](https://socket.io/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
-