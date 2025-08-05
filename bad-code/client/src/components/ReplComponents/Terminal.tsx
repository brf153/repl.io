import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { FitAddon } from "xterm-addon-fit";
import { Socket } from "socket.io-client";
const fitAddon = new FitAddon();

const PROMPT = "> ";

type Props = {
  socket: typeof Socket | null;
};

function ab2str(buf: ArrayBuffer) {
  return String.fromCharCode(...new Uint8Array(buf));
}

const TerminalComponent = ({ socket }: Props) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const commandBufferRef = useRef("");
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);

  const prompt = () => {
    xtermRef.current?.write(`\r\n${PROMPT}`);
    commandBufferRef.current = "";
  };

  const handleCommand = (cmd: string, socket: typeof Socket) => {
    if (!cmd.trim()) return;

    // Save to history
    historyRef.current.unshift(cmd);
    historyIndexRef.current = -1;

    socket.emit("terminalData", {
      data: cmd + "\r\n",
    });
  };

  useEffect(() => {
    if (!socket) return;
    const term = new XTerm({
      cursorBlink: true,
      fontSize: 14,
    });

    xtermRef.current = term;
    term.loadAddon(fitAddon);
    socket.emit("requestTerminal");
    socket.on("terminal", terminalHandler);
    const handleResize = () => fitAddon.fit();

    if (terminalRef.current) {
      term.open(terminalRef.current);
      fitAddon.fit();
      term.write("Welcome to the terminal!\r\n");
      prompt();
      window.addEventListener("resize", handleResize);
    }

    function terminalHandler({ data }: { data: ArrayBuffer }) {
      if (data instanceof ArrayBuffer) {
        term.write(ab2str(data));
      }
    }

    term.onKey(({ key, domEvent }) => {
      const char = key;
      const buffer = commandBufferRef.current;

      switch (domEvent.key) {
        case "Enter":
          term.write("\r\n");
          handleCommand(buffer, socket);
          prompt();
          commandBufferRef.current = ""; // Clear the command buffer
          historyIndexRef.current = -1; // Reset history index
          break;

        case "Backspace":
          if (buffer.length > 0) {
            // Move cursor back, overwrite with space, move back again
            term.write("\b \b");
            commandBufferRef.current = buffer.slice(0, -1);
          }
          break;

        case "ArrowUp": {
          const history = historyRef.current;
          if (
            history.length > 0 &&
            historyIndexRef.current < history.length - 1
          ) {
            historyIndexRef.current++;
            const prevCommand = history[historyIndexRef.current];

            // Clear current line
            const len = buffer.length + PROMPT.length;
            term.write(`\r${" ".repeat(len)}\r${PROMPT}${prevCommand}`);
            commandBufferRef.current = prevCommand;
          }
          break;
        }

        case "ArrowDown": {
          const history = historyRef.current;
          if (historyIndexRef.current > 0) {
            historyIndexRef.current--;
            const nextCommand = history[historyIndexRef.current];

            const len = buffer.length + PROMPT.length;
            term.write(`\r${" ".repeat(len)}\r${PROMPT}${nextCommand}`);
            commandBufferRef.current = nextCommand;
          } else {
            // Blank line
            const len = buffer.length + PROMPT.length;
            term.write(`\r${" ".repeat(len)}\r${PROMPT}`);
            commandBufferRef.current = "";
            historyIndexRef.current = -1;
          }
          break;
        }

        default:
          if (domEvent.key.length === 1) {
            term.write(char);
            commandBufferRef.current += char;
          }
          break;
      }
    });

    return () => {
      xtermRef.current?.dispose();
      xtermRef.current = null;
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={terminalRef}
      style={{ width: "100%", height: "100%", overflow: "hidden" }}
    />
  );
};

export default TerminalComponent;
