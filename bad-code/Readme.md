# bad-code REPL

This project is a simple web-based REPL (Read-Eval-Print Loop) environment inspired by platforms like Replit. It is designed for learning purposes and is not intended for production use or scalability. The architecture supports only a single user and does not provide environment isolation.

## Features

- **Monaco Editor**: Provides a code editing experience similar to Visual Studio Code.
- **Xterm.js Terminal**: Interactive terminal UI with command history and clearance.
- **File Management**: Create, edit, and delete files in the workspace.
- **Basic REPL Functionality**: Run code and view output in the terminal.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Monaco Editor, Xterm.js
- **Backend**: Node.js, Express, Socket.IO, AWS S3 (for file storage)

## Architecture Overview

- **Client**: A React SPA that handles the UI, code editing, and terminal interactions.
- **Server**: Node.js/Express backend that manages REST APIs, real-time collaboration (Socket.IO), file operations, and S3 integration.

## Limitations

- No environment isolation (all code runs in a shared context).
- Restricted to a single user.
- Not scalable or secure for production use.

## Getting Started

1. Clone the repository.
2. Install dependencies for both `client` and `server` folders.
3. Start the backend server.
4. Start the frontend development server.
5. Access the app in your browser.

## License

This project is for educational purposes only.