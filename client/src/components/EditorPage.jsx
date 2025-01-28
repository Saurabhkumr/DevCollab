import React, { useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import CodeEditor from "./CodeEditor";
import Output from "./Output";

const EditorPage = () => {
  const [language, setLanguage] = useState("javascript"); // Default language
  const [code, setCode] = useState("// Start coding here"); // Code content
  const [output, setOutput] = useState(""); // Output from execution
  const [loading, setLoading] = useState(false); // Loading state for execution

  const collaborators = [
    { socketId: 1, username: "Alice" },
    { socketId: 2, username: "Bob" },
    { socketId: 3, username: "Charlie" },
    { socketId: 4, username: "David" },
  ];

  // Function to execute code using the backend proxy server
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

      // Submit code to the backend proxy server
      const { data: submission } = await axios.post(
        "http://localhost:5000/run", // Call the backend proxy server
        {
          source_code: code,
          language_id: languageId,
          stdin: "", // You can include input if needed
        }
      );

      // Process output from the backend proxy server
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
      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar */}
        <Sidebar collaborators={collaborators} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Code Editor */}
          <CodeEditor
            language={language}
            setLanguage={setLanguage}
            code={code}
            setCode={setCode}
            runCode={runCode}
          />
          {/* Output */}
          <div className="flex-1 overflow-auto">
            <Output output={output} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
