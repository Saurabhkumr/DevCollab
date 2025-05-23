import React, { useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import toast from "react-hot-toast";

const CodeEditor = ({
  socketRef,
  roomId,
  language,
  setLanguage,
  code,
  setCode,
  runCode,
}) => {
  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("code-change", ({ newCode }) => {
      setCode(newCode);
    });

    return () => {
      socketRef.current.off("code-change");
    };
  }, [socketRef]);

  const handleCodeChange = (value) => {
    setCode(value || "");

    if (socketRef.current) {
      socketRef.current.emit("code-change", {
        roomId,
        newCode: value || "",
      });
    }
  };
  const handleCopy = () => {
    if (roomId) {
      navigator.clipboard
        .writeText(roomId)
        .then(() => {
          toast.success("Room ID copied to clipboard!");
        })
        .catch((err) => {
          toast.error("Failed to copy Room ID.");
        });
    }
  };

  return (
    <div className="flex flex-col h-[85vh] w-[130vh]">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-800 text-white px-3  py-1 rounded border border-gray-600"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
        <div>
          <button
            className="px-4 py-2 mr-5 bg-blue-500 rounded text-white hover:bg-blue-600"
            onClick={handleCopy}
          >
            + Invite
          </button>
          <button
            onClick={runCode}
            className="bg-green-500 px-4 py-2 rounded text-black font-bold hover:bg-green-600"
          >
            Run Code
          </button>
        </div>
      </div>
      {/* Monaco Code Editor */}
      <div className="flex-1 bg-gray-800 p-4 overflow-auto">
        <Editor
          height="100%"
          language={language}
          value={code}
          theme="vs-dark"
          onChange={handleCodeChange}
          options={{
            fontSize: 16,
            wordWrap: "on",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
