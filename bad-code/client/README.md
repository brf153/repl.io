# Repl.io Client

This is the frontend client for the Repl.io project, built with **React**, **TypeScript**, and **Vite**. It provides a web-based code editor and terminal interface, similar to an online IDE.

## Tech Stack

- **React**: UI library for building interactive interfaces.
- **TypeScript**: Type-safe JavaScript for maintainable code.
- **Vite**: Fast development server and build tool.
- **TailwindCSS**: Utility-first CSS framework for styling.
- **Monaco Editor**: Code editor component (used in VS Code).
- **Xterm.js**: Terminal emulator for the browser.
- **Socket.IO Client**: Real-time communication with the backend.
- **Axios**: HTTP client for API requests.
- **Emotion**: CSS-in-JS for styled components.
- **React Router**: Routing for SPA navigation.

## Folder Structure

- `src/`
  - `App.tsx`: Main app component, sets up routes.
  - `main.tsx`: Entry point, renders the app.
  - `index.css`: Global styles, includes TailwindCSS.
  - `components/`: UI components.
    - `Inference.tsx`: Form to create/select a REPL environment.
    - `Repl.tsx`: Main REPL interface (editor, file tree, terminal).
    - `NotFound.tsx`: 404 page.
    - `ReplComponents/`: Editor, terminal, sidebar, file tree, icons.
  - `types/types.ts`: Type definitions for files and directories.
  - `utils/`: Utility functions.
    - `axios.ts`: Configured Axios instance for API calls.
    - `socket.ts`: Custom React hook for Socket.IO connection.
    - `fileTree.ts`: Functions to build and manage file tree structure.
  - `assets/`: Static assets (e.g., SVGs).
- `.env`: Environment variables for API and WebSocket URLs.
- `vite.config.ts`: Vite configuration (React + TailwindCSS plugins).
- `tsconfig.*.json`: TypeScript configuration files.
- `eslint.config.js`: ESLint configuration for code linting.

## Main Features

### 1. Inference Page

- Users enter an "Inference ID" and select a technology (Node.js or Python).
- On submit, a POST request is sent to the backend (`/create-repl`) to set up the REPL environment.
- On success, navigates to the REPL interface.

### 2. REPL Interface

- **Sidebar**: Displays a file tree, built from the backend's file structure. Users can navigate directories and select files.
- **Code Editor**: Monaco Editor for editing code. Changes are sent to the backend via Socket.IO using diff-match-patch for efficient updates.
- **Terminal**: Xterm.js-based terminal, connected to a backend shell via Socket.IO. Supports command history and basic shell interaction.

### 3. Real-Time Collaboration

- Uses Socket.IO for real-time updates between client and server.
- File changes and terminal commands are synchronized instantly.

### 4. API & WebSocket Configuration

- API base URL and WebSocket URL are set via `.env` file:
  ```
  VITE_API_URL=http://localhost:4000/v1
  VITE_WS_URL=http://localhost:4000/
  ```

## Development

- **Start Dev Server**:  
  ```sh
  npm run dev
  ```
- **Build for Production**:  
  ```sh
  npm run build
  ```
- **Lint Code**:  
  ```sh
  npm run lint
  ```

## Notes

- This client is designed for learning and experimentation. It does not implement user authentication or environment isolation.
- The backend must be running and accessible at the URLs specified in `.env`.

## References

- [Monaco Editor](https://github.com/microsoft/monaco-editor)
- [Xterm.js](https://github.com/xtermjs/xterm.js)
- [Socket.IO](https://socket.io/)
- [TailwindCSS](https://tailwindcss.com/)