import { spawn } from "node-pty";
import type { IPty } from "node-pty";
import path from "path";

interface TerminalMap {
    [socketId: string]: IPty;
}

const terminals: TerminalMap = {};

const __dirname = path.resolve(path.dirname(''));

function createPty(socketId: string, replId: string, onData: (data: string, id: string) => void) {
    // You can customize shell and cwd as needed
    const shell = process.platform === "win32" ? "powershell.exe" : "bash";
    const pty = spawn(shell, [], {
        name: "xterm-color",
        cols: 80,
        rows: 30,
        cwd: path.join(__dirname, `../tmp/${replId}`),
        env: process.env,
    });

    terminals[socketId] = pty;

    pty.onData((data) => {
        onData(data, socketId);
    });
}

function writeTerminal(socketId: string, data: string) {
    const pty = terminals[socketId];
    if (pty) {
        pty.write(data);
    }
}

function clearTerminal(socketId: string) {
    const pty = terminals[socketId];
    if (pty) {
        pty.kill();
        delete terminals[socketId];
    }
}

export {
    createPty,
    writeTerminal,
    clearTerminal,
};