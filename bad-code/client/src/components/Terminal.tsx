import { Terminal as XTermType } from "@xterm/xterm";
import { useEffect, useRef } from "react";

const TerminalComponent = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTermType | null>(null);

  useEffect(() => {
    // Initialize xterm
    const term = new XTermType({
      cursorBlink: true,
      fontSize: 14,
      theme: {
        background: "#1e1e1e",
        foreground: "#ffffff",
        cursor: "#ffffff",
      },
    });
    xtermRef.current = term;
    if (terminalRef.current) {
      term.open(terminalRef.current);
      term.write("Welcome to the terminal!\r\n");
    }

    term.onKey((event) => {
      const char = event.key;
      if (char === "Enter") {
        term.write("\r\n");
      } else {
        term.write(char);
      }
    });

    return () => {
      // Cleanup xterm instance
      if (xtermRef.current) {
        xtermRef.current.dispose();
        xtermRef.current = null;
      }
    };
  }, [terminalRef]);

  return (
    <div
      ref={terminalRef}
      style={{ width: "100%", height: "100vh", backgroundColor: "#1e1e1e" }}
    />
  );
};

export default TerminalComponent;
