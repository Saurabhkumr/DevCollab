import React from "react";
import { Editor } from "@monaco-editor/react";

const CodeEditor = ({ language, setLanguage, code, setCode, runCode }) => {
  return (
    <div className="flex flex-col h-[70vh]">
      {" "}
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-800 text-white px-3 py-1 rounded border border-gray-600"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
        <button
          onClick={runCode}
          className="bg-green-500 px-4 py-2 rounded text-black font-bold hover:bg-green-600"
        >
          Run Code
        </button>
      </div>
      {/* Monaco Code Editor */}
      <div className="flex-1 bg-gray-800 p-4 overflow-auto">
        <Editor
          height="100%" // Monaco editor takes up full height of the container
          language={language}
          value={code}
          theme="vs-dark"
          onChange={(value) => setCode(value || "")}
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
