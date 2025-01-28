import React, { useState } from "react";
import axios from "axios";

import CodeEditor from "./CodeEditor";
import Output from "./Output";
import Topbar from "./Topbar";

const EditorPage = () => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Start coding here");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const collaborators = [
    { socketId: 1, username: "Alice" },
    { socketId: 2, username: "Bob" },
    { socketId: 3, username: "Charlie" },
    { socketId: 4, username: "David" },
  ];

  const clearOutput = () => {
    setOutput("");
  };

  const runCode = async () => {
    setLoading(true);
    setOutput("");

    try {
      const languageMap = {
        javascript: 93,
        python: 92,
        cpp: 54,
        java: 91,
      };

      const languageId = languageMap[language];
      if (!languageId) {
        setOutput(`Execution for ${language} is not supported.`);
        setLoading(false);
        return;
      }

      const { data: submission } = await axios.post(
        "http://localhost:5000/run",
        {
          source_code: code,
          language_id: languageId,
          stdin: "",
        }
      );

      if (submission.stderr) {
        setOutput(`Error: ${submission.stderr}`);
      } else if (submission.compile_output) {
        setOutput(`Compilation Error: ${submission.compile_output}`);
      } else {
        setOutput(submission.stdout || "Code executed successfully.");
      }
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-800 text-white flex flex-col overflow-hidden">
      <Topbar collaborators={collaborators} />
      <div className="flex flex-1">
        {/* Code Editor on Left Half */}
        <div className="flex-1 p-4">
          <CodeEditor
            language={language}
            setLanguage={setLanguage}
            code={code}
            setCode={setCode}
            runCode={runCode}
          />
        </div>

        {/* Output on Right Half */}
        <div className="w-1/2 p-4">
          <Output output={output} loading={loading} clearOutput={clearOutput} />
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
